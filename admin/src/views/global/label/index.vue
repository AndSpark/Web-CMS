<template>
	<div>
		<el-tabs v-model="activeName" tab-position="top">
			<el-tab-pane label="标签管理" name="first">
				<div class="input-lan" v-for="label in labels" :key="label.id">
					<el-input v-model="label.value">
						<template #prepend>
							{{ label.name }}
						</template>
					</el-input>
					<el-button type="danger" icon="el-icon-delete" @click="deleteLabel(label.name)"></el-button>
				</div>
				<el-button type="primary" style="margin: 20px 0" @click="updateLabels">立即提交</el-button>
			</el-tab-pane>
			<el-tab-pane label="新增标签" name="thire">
				<el-form ref="form" :model="labelForm" :rules="rules" label-width="80px">
					<el-form-item label="标签名称" prop="name">
						<el-input v-model="labelForm.name"></el-input>
					</el-form-item>
					<el-form-item label="标签描述">
						<el-input v-model="labelForm.description"></el-input>
					</el-form-item>
					<el-form-item label="标签描述" prop="type">
						<el-select v-model="labelForm.type" placeholder="请选择" >
							<el-option label="单行文本" value="1"> </el-option>
							<el-option label="多行文本" value="2"> </el-option>
							<el-option label="编辑器" value="8"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item >
						<el-button type="primary" @click="addLabel">提交</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { _addLabel, _deleteLabel, _getLabel, _updateLabel } from '../../../api/label'
export default defineComponent({
	name: 'Label',
	setup() {
		const state = reactive({
			activeName: 'first',
			labels: [] as any[],
			labelForm: {
				name: '',
				type: '3',
				description: '',
			},
			rules:{
				name:[
					{
						required: true,message: '请输入标签名称',triger:'blur'
					},
					{
						validator(rule:string,value:string,callback:Function){
							if(/[\w]+/.test(value)){
								callback()
							}else {
								callback(new Error('只能含有字母、数字、下划线'))
							}
						}
					},
				],
				type:{
						required: true,message: '必须选择类型',triger:'change'
				}
			}
		})
		_getLabel()
			.then(lables => {
				state.labels = lables
			})
			.catch(err => {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			})

		return {
			...toRefs(state),
		}
	},
	methods:{
		addLabel(){
			//@ts-ignore
			this.$refs.form.validate(async (valid:any) => {
          if (!valid) {
            return false;
          }
					try {
						const label = await _addLabel(this.labelForm.name,this.labelForm.type,this.labelForm.description)
						this.labels.push(label)
						ElMessage.success('添加成功')
						this.activeName = 'first'
						this.labelForm.name = ''
						this.labelForm.description = ''
					} catch (err) {
						ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
					}
        });
		},
		async deleteLabel(name:string){
			try {
				await _deleteLabel(name)
				ElMessage.success('删除成功')
				this.labels = this.labels.filter((label:any) => {
					if(label.name === name){
						return false
					}
					return true
				})
			} catch (err) {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			}
		},
		async updateLabels(){
			try {
				await Promise.all(
					this.labels.map(async label => {
					return await _updateLabel(label.name,label.value)
				})
				)
				ElMessage.success('更新成功')
				this.$router.replace(this.$route.path)
			} catch (err) {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			}
		}
	}
})
</script>

<style lang="scss" scoped>
.input-lan {
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin-bottom:20px;
	.el-button {
		margin-right: 20px;
		flex:1;
	}
}

</style>
