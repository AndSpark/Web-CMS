<template>
	<div v-loading="uploading">
		<el-row :gutter="20"  >
			<el-col :span="12" :offset="0">
				<el-input :modelValue="modelValue" @input="handleImgUrlInput"></el-input>
				<el-row v-if="!file" :gutter="20" class="img-list">
					<el-col :span="8" :offset="0"  v-for="img in showImgUrlList" :key="img.url" style="position:relative">
						<img :src="img.url" style="max-height:100px;margin-top:20px" />
						<el-button v-if="deleteBtn" @click="remove(img.origin)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="12" :offset="0">
				<el-upload
					:headers="headers"
					:action="uploadUrl"
					:on-success="onSuccess"
					:on-error="handleError"
					:show-file-list="false"
					:multiple="multiple"
					:before-upload="handleBeforeUpload"
					:accept="accept"
				>
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { localGet } from '../../utils'

export default defineComponent({
	name: 'index',
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		file:{
			type:Boolean,
			default: false,
		},
		deleteBtn:{
			type:Boolean,
			default: false,
		}
	},
	setup(props, { emit }) {
		const state = reactive({
			uploadUrl: import.meta.env.VITE_BASE_URL + '/api/upload',
			imgBaseUrl: location.protocol + '//' + location.hostname,
			uploading:false
		})
		const { multiple, modelValue,file } = toRefs(props)
		const accept = computed(() => {
			if(file.value){
				return 'any'
			}
			return 'image/png, image/jpeg'
		})
		const showImgUrlList = computed(() => {
			return modelValue.value.split(',').map(v => {
				return {
					url:state.imgBaseUrl + v,
					origin:v,
					show:v ? true : false
				}
			}).filter(v => v.show)
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
			onSuccess(res: any) {
					state.uploading = false
				const url = '/' + res.file.path.replace(/\\/g, '/')
				if (!multiple.value) {
					emit('update:modelValue', url)
				}else {
					let separator = ','
					if(!modelValue.value){
						separator = ''
					}
					emit('update:modelValue', modelValue.value + separator + url)
				}
			},
			handleBeforeUpload(){
				state.uploading = true
			},
			handleImgUrlInput(value: string) {
				emit('update:modelValue', value)
			},
			handleError(){
				ElMessage.error('上传出错')
			},
			remove(url: string) {
				let res;
				if(modelValue.value.includes(','+url)){
					res = modelValue.value.replace(','+url,'')
				}else {
					res = modelValue.value.replace(url,'')
				}
				emit('update:modelValue', res)
			}
		}

		return {
			...toRefs(state),
			...actions,
			headers,
			showImgUrlList,
			accept
			
		}
	},
})
</script>

<style lang="scss" scoped>
.img-list {
.el-col {
	position: relative;
	.el-button {
		position:absolute;top:25px;right:25px
	}
}
}

</style>
