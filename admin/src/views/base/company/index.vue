<template>
	<div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="公司信息" name="first">
				<el-form ref="form" :model="companyForm" label-width="120px">
					<el-form-item label="公司名称">
						<el-input v-model="companyForm.name"></el-input>
					</el-form-item>
					<el-form-item label="公司地址">
						<el-input v-model="companyForm.address"></el-input>
					</el-form-item>
					<el-form-item label="邮政编码">
						<el-input v-model="companyForm.postcode"></el-input>
					</el-form-item>
					<el-form-item label="联系人">
						<el-input v-model="companyForm.contact"></el-input>
					</el-form-item>
					<el-form-item label="手机号码">
						<el-input v-model="companyForm.mobile"></el-input>
					</el-form-item>
					<el-form-item label="电话号码">
						<el-input v-model="companyForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="传真号码">
						<el-input v-model="companyForm.fax"></el-input>
					</el-form-item>
					<el-form-item label="电子邮箱">
						<el-input v-model="companyForm.email" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="QQ号码">
						<el-input v-model="companyForm.qq"></el-input>
					</el-form-item>
					<el-form-item label="微信图标">
						<upload v-model="companyForm.weixin"></upload>
					</el-form-item>
					<el-form-item label="营业执照代码">
						<el-input v-model="companyForm.blicense"></el-input>
					</el-form-item>
					<el-form-item label="其它信息">
						<el-input v-model="companyForm.other"></el-input>
					</el-form-item>
					<el-form-item >
						<el-button type="primary" @click="update">修改</el-button>
						<el-button type="warning" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
interface Company {
	id:number;
	acode: string;
	address: string;
	blicense: string;
	contact: string;
	email: string;
	fax: string;
	mobile: string;
	name: string;
	other: string;
	phone: string;
	postcode: string;
	qq: string;
	weixin: string;
}

import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { _getCompany,_updateCompany } from '../../../api/company'
import Upload from '../../../components/Upload/index.vue'
export default defineComponent({
	name: 'index',
	components:{
		Upload
	},
	setup() {
		const store = useStore()
		const state = reactive({
			activeName: 'first',
			company: [] as Company[],
			companyForm: {
					id:0,
					acode: '',
					address: '',
					blicense: '',
					contact: '',
					email: '',
					fax: '',
					mobile: '',
					name: '',
					other: '',
					phone: '',
					postcode: '',
					qq: '',
					weixin: '',
			},
		})

		watch(()=>store.state.acode,(n,o)=>{
				state.companyForm = Object.assign({},state.company.find(v => v.acode === n)) as Company
		})

		const getCompany = () => {
			_getCompany()
				.then((company: Company[]) => {
					state.company = company
					state.companyForm = Object.assign({},company.find(v => v.acode === store.state.acode))
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		}
		getCompany()
		return {
			...toRefs(state),
			getCompany,
		}
	},
	methods: {
		reset(){
			let companyForm = this.company.find(company => company.acode === this.$store.state.acode)
			this.companyForm = Object.assign({},companyForm)
		},
		async update(){
			try {
				await _updateCompany({
					findOption:{
						id:this.companyForm.id
					},
					data:this.companyForm
				})
				ElMessage.success('修改成功')
				this.getCompany()
			} catch (err) {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			}
		}
	},
})
</script>

<style lang="scss" scoped>
</style>
