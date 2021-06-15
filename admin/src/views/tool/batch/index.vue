<template>
<div v-loading="uploading" element-loading-text="拼命上传中"
>
	<el-alert
		title="1. 图片命名为产品名称  2.图片放到产品分类目录下面  3.产品目录放到product文件夹下面  4.将product文件夹压缩后上传"
		type="warning"
		
		>
	</el-alert>
	<el-divider></el-divider>
	<el-row :gutter="20">
		<el-col :span="12" :offset="0">
				<el-input v-model="data.info.pcode" placeholder="请输入产品栏目编码"></el-input>
		</el-col>
		<el-col :span="12" :offset="0">

			<el-upload
					:headers="headers"
					:action="uploadUrl"
					:on-success="onSuccess"
					:on-error="handleError"
					:show-file-list="false"
					:before-upload="handleBeforeUpload"
					:data="dataJSON"
					accept=".zip"
				>
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
		</el-col>
	</el-row>
	
	
</div>
</template>

<script lang='ts'>
import { ElMessage } from 'element-plus'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { localGet } from '../../../utils'

export default defineComponent({ 
	name:'index',
	setup(){
		const store = useStore()
		const state = reactive({
			uploadUrl: import.meta.env.VITE_BASE_URL + '/api/upload/batch',
			data:{
				info:{
					acode:store.state.acode,
					pcode:'',
				}
			},
			uploading:false
		})

		const dataJSON = computed(()=>{
			return {
				info:JSON.stringify(state.data.info)
			}
		})

		const headers = computed(() => {
			let token = localGet('token') || ''
			if (token) {
				return {
					Authorization: token,
				}
			}
		})

		const actions = {
			onSuccess(){
				ElMessage.success('上传完成')
				state.uploading = false

			},
			handleError(){
				ElMessage.error('上传失败')
				state.uploading = false

			},
			handleBeforeUpload(){
				state.uploading = true
			}
		}

		return {
			...toRefs(state),
			headers,
			...actions,
			dataJSON
		}
	}
})
</script>

<style lang='scss' scoped>

</style>