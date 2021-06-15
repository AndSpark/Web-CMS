<template>
<div>
	<el-tabs  tab-position="top" v-model="activeName">
			<el-tab-pane label="扩展字段列表" name="1">
				<el-table :data="extList" style="width: 100%">
					<el-table-column prop="id" label="序号"> </el-table-column>
					<el-table-column prop="mcode" label="内容模型">
							<template #default="{ row }">
							<p>{{ getModelLabel(row.mcode) }}</p>
						</template>
					</el-table-column>
					<el-table-column prop="description" label="字段描述"> </el-table-column>
					<el-table-column prop="name" label="字段名称"> </el-table-column>
					<el-table-column prop="type" label="字段类型">
						<template #default="{ row }">
							<p>{{type.find(v => v.type === row.type) && type.find(v => v.type === row.type).name}}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-popconfirm title="确定删除吗？" @confirm="deleteExt(row.id)">
								<template #reference>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="扩展字段新增" name="2">
				<el-form ref="form" :model="extForm" label-width="120px">
					<el-form-item label="内容模型">
						<el-select v-model="extForm.mcode" placeholder="">
							<el-option
								v-for="item in models"
								:key="item.id"
								:label="item.name"
								:value="item.mcode">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="字段描述">
						<el-input v-model="extForm.description"></el-input>
					</el-form-item>
					<el-form-item label="字段名称">
						<el-input v-model="extForm.name" placeholder="请输入英文"></el-input>
					</el-form-item>
					<el-form-item label="字段类型">
						<el-select v-model="extForm.type" placeholder="">
							<el-option
								v-for="item in type"
								:key="item.name"
								:label="item.name"
								:value="item.type">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item >
						<el-button type="primary" @click="addExt">立即提交</el-button>
						<el-button type="warning" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			
		</el-tabs>
</div>
</template>

<script lang='ts'>
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { extForm, _addExt, _deleteExt, _getExtField } from '../../../api/extfield'
import { _getModels } from '../../../api/model'
export default defineComponent({ 
	name:'ExtField',
	setup(){
		const state = reactive({
			models:[] as any[],
			extList:[],
			extForm:{
				mcode: '',
				name: '',
				type: '',
				value: '',
				description: '',
				sorting:255
			} as extForm,
			originExtForm:{} as extForm,
			activeName:'1',
			type:[
				{name:'单行文本',type:'1'},
				{name:'多行文本',type:'2'},
				{name:'编辑器',type:'8'},
			]
		})
		state.originExtForm = JSON.parse(JSON.stringify(state.extForm))
		const actions = {
			getExt(){
				_getExtField().then(res => {
					state.extList = res
				})
			},
			getModels(){
				_getModels()
				.then(res => {
					state.models = res
				})
				.catch(err => {
					ElMessage.error(err.message + '| 出错了，请过会几分钟再试')
				})
			},
			getModelLabel(mcode: string) {
				if(!state.models.length)return ''
				const model = state.models.find(v => v.mcode === mcode)
				return model.name
			},
			addExt(){
				_addExt(state.extForm).then(res => {
					state.activeName = '1'
					state.extForm = state.originExtForm
					ElMessage.success('添加成功')
					actions.getExt()
				})
					.catch(err => {
					ElMessage.error(err.message + '| 出错了，请过会几分钟再试')
				})
			},
			reset(){
				state.extForm = state.originExtForm
			},
			deleteExt(id:number){
				_deleteExt({id}).then(res=> {
					ElMessage.success('删除成功')
					actions.getExt()
				})	.catch(err => {
					ElMessage.error(err.message + '| 出错了，请过会几分钟再试')
				})
			}

		}

		actions.getExt()
		actions.getModels()

		return {
			...actions,
			...toRefs(state)
		}
	}
})
</script>

<style lang='scss' scoped>

</style>