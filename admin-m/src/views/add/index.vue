<template>
<div>
	<h3>新增网站</h3>
	<el-form :model="form" label-width="80px">
		<el-form-item label="英文ID">
			<el-input v-model="form.site"></el-input>
		</el-form-item>
		<el-form-item label="网站名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="域名">
			<el-input v-model="form.hosts" placeholder="多个域名用逗号或空格隔开" type="textarea"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="addSite">立即添加</el-button>
		</el-form-item>
	</el-form>
</div>
</template>

<script lang='ts'>
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { _addSite } from '../../api/other'
export default defineComponent({ 
	name:'index',
	setup() {
		const state = reactive({ 
			form:{
				site:'',
				name:'',
				hosts:''
			}
		})

		const actions = {
			async addSite(){
				state.form.hosts = state.form.hosts.replace('/\s/',',').replace(/,+/,',')
				try {
					await _addSite(state.form)
				ElMessage.success('添加成功')
				} catch (error) {
					ElMessage.error(error.message)
				}
	
			}
		}

		return {
			...toRefs(state),

			...actions
		}
	}
})
</script>

<style lang='scss' scoped>

</style>