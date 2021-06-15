<template>
	<div>
		<el-tabs v-model="active" tab-position="top">
			<el-tab-pane label="模型列表" name="1">
				<el-table :data="models" stripe style="width: 100%">
					<el-table-column prop="id" label="序号" width="100"> </el-table-column>
					<el-table-column prop="name" label="名称" width="100"> </el-table-column>
					<el-table-column prop="type" label="类型" width="100">
						<template #default="{ row }">
							<el-tag type="success" v-if="row.type === '1'">单页</el-tag>
							<el-tag type="primary" v-else>列表</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="listtpl" label="列表页模板"> </el-table-column>
					<el-table-column prop="contenttpl" label="内容页模板"> </el-table-column>
					<el-table-column prop="status" label="状态">
						<template #default="{ row }">
							<el-tag type="success" v-if="row.status === '1'">启用</el-tag>
							<el-tag type="danger" v-else>禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" size="small" @click="openDialog(row)">修改</el-button>
							<el-popconfirm
								title="确定删除吗？"
								@confirm="deleteModel(row.name)"
								v-if="row.issystem !== '1'"
							>
								<template #reference>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="新增模型" name="2">
				<el-form ref="form" :model="modelForm" :rules="rules" label-width="120px">
					<el-form-item label="模型名称" prop="name">
						<el-input v-model="modelForm.name"></el-input>
					</el-form-item>
					<el-form-item label="模型类型" prop="type">
						<el-select v-model="modelForm.type" placeholder="请选择">
							<el-option label="单页" value="1"> </el-option>
							<el-option label="列表" value="2"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="列表页模板" prop="listtpl">
						<el-input v-model="modelForm.listtpl"></el-input>
					</el-form-item>
					<el-form-item label="内容页模板" prop="contenttpl">
						<el-input v-model="modelForm.contenttpl"></el-input>
					</el-form-item>
					<el-form-item label="状态">
						<el-radio v-model="modelForm.status" label="1">启用</el-radio>
						<el-radio v-model="modelForm.status" label="0">禁用</el-radio>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addModel">提交</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<el-dialog
  title="修改模型"
  v-model="dialogStatus"
  width="50%">
		<el-form ref="form" :model="updateModelForm" :rules="rules" label-width="120px">
		<el-form-item label="模型名称" prop="name">
			<el-input v-model="updateModelForm.name"></el-input>
		</el-form-item>
		<el-form-item label="模型类型" prop="type">
			<el-select v-model="updateModelForm.type" placeholder="请选择">
				<el-option label="单页" value="1"> </el-option>
				<el-option label="列表" value="2"> </el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="列表页模板" prop="listtpl">
			<el-input v-model="updateModelForm.listtpl"></el-input>
		</el-form-item>
		<el-form-item label="内容页模板" prop="contenttpl">
			<el-input v-model="updateModelForm.contenttpl"></el-input>
		</el-form-item>
		<el-form-item label="状态">
			<el-radio v-model="updateModelForm.status" label="1">启用</el-radio>
			<el-radio v-model="updateModelForm.status" label="0">禁用</el-radio>
		</el-form-item>
	</el-form>
	
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogStatus = false">取 消</el-button>
      <el-button type="primary" @click="updateModel">确 定</el-button>
    </span>
  </template>
</el-dialog>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { _getModels, _addModel, _deleteModel, _updateModel } from '../../../api/model'
export default defineComponent({
	name: 'Model',
	components: {
	},
	setup() {
		const state = reactive({
			active: '1',
			models: [],
			modelForm: {
				name: '',
				type: '',
				listtpl: '',
				contenttpl: '',
				status: '1',
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入模型名称',
						trigger: 'blur',
					},
				],
				type: [
					{
						required: true,
						message: '请选择模型类型',
						trigger: 'change',
					},
				],
				listtpl: [
					{
						required: true,
						message: '请输入列表页模板',
						trigger: 'blur',
					},
				],
				contenttpl: [
					{
						required: true,
						message: '请输入内容页模板',
						trigger: 'blur',
					},
				],
			},
			dialogStatus: false,
			updateModelForm:{
				name: '',
				type: '',
				listtpl: '',
				contenttpl: '',
				status: '1',
			},
			updateModelName:''
		})

		const getModels = () => {
			_getModels()
				.then(res => {
					state.models = res
				})
				.catch(err => {
					ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
				})
		}
		getModels()

		return {
			...toRefs(state),
			getModels,
		}
	},
	methods: {
		addModel() {
			//@ts-ignore
			this.$refs.form.validate(async (vali: any) => {
				if (!vali) {
					return false
				}
				try {
					const model = await _addModel(this.modelForm)
					ElMessage.success('添加成功')
					this.getModels()
				} catch (err) {
					ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
				}
			})
		},
		async deleteModel(name: string) {
			try {
				await _deleteModel(name)
				ElMessage.success('删除成功')
				this.getModels()
			} catch (err) {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			}
		},
		openDialog(model: any) {
			this.dialogStatus = true
			Object.keys(this.updateModelForm).forEach(k => {
				//@ts-ignore
				this.updateModelForm[k] = model[k]
			})
			this.updateModelName = model.name
		},
		async updateModel(){
			try {
				await _updateModel({
					findOption:{
						name:this.updateModelName
					},
					data:this.updateModelForm
				})
				ElMessage.success('修改成功')
				this.dialogStatus = false
				this.getModels()
			} catch (err) {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			}
		},
	},
})
</script>

<style lang="scss" scoped></style>
