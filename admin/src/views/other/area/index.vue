<template>
	<div>
		<el-tabs  tab-position="top" v-model="activeName">
			<el-tab-pane label="区域列表" name="1">
				<el-table :data="areas" style="width: 100%">
					<el-table-column prop="id" label="序号"> </el-table-column>
					<el-table-column prop="name" label="区域名称"> </el-table-column>
					<el-table-column prop="acode" label="区域编码"> </el-table-column>
					<el-table-column prop="is_default" label="是否默认">
						<template #default="{ row }">
							<el-tag type="success" v-if="row.is_default === '1'">是</el-tag>
							<el-tag type="success" v-else>否</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-popconfirm title="确定删除吗？" @confirm="deleteArea(row.acode)">
								<template #reference>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="区域新增" name="2">
				<el-form ref="form" :model="areaForm" label-width="120px">
					<el-form-item label="区域名称">
						<el-input v-model="areaForm.name"></el-input>
					</el-form-item>
					<el-form-item label="区域编码">
						<el-input v-model="areaForm.acode"></el-input>
					</el-form-item>
					<el-form-item label="是否默认">
						<el-radio v-model="areaForm.is_default" label="1">是</el-radio>
						<el-radio v-model="areaForm.is_default" label="0">否</el-radio>
					</el-form-item>
					<el-form-item >
						<el-button type="primary" @click="addArea">立即提交</el-button>
						<el-button type="warning" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { _addArea, _deleteArea } from '../../../api/area'
import { getAreaFunc } from '../../../composables/area'
export default defineComponent({
	name: 'Area',
	setup() {
		let { getArea, areas, currentArea } = getAreaFunc()

		const state = reactive({
			areaForm:{
				name:'',
				acode:'',
				is_default:'0',
			},
			activeName:'1'
		})

		const actions = {
			addArea(){
				_addArea(state.areaForm).then(res => {
					state.activeName = '1'
					actions.reset()
					getArea()
					ElMessage.success('添加成功')
					location.reload();
				}).catch(err => ElMessage.error(err.message + '| 出错了，请过会几分钟再试'))
			},
			reset(){
				state.areaForm = {
					name:'',
					acode:'',
					is_default:'0',
				}
			},
			deleteArea(acode:string){
				_deleteArea({acode}).then(res => {
					location.reload();
					ElMessage.success('删除成功')
				}).catch(err => ElMessage.error(err.message + '| 出错了，请过会几分钟再试'))
			}
		}

		getArea()

		return {
			...toRefs(state),
			...actions,
			getArea,
			areas,
			currentArea,
		}
	},
})
</script>

<style lang="scss" scoped></style>
