<template>
	<div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="站点信息" name="first">
				<el-form ref="form" :model="siteForm" label-width="120px">
					<el-form-item label="站点标题">
						<el-input v-model="siteForm.title"></el-input>
					</el-form-item>
					<el-form-item label="站点副标题">
						<el-input v-model="siteForm.subtitle"></el-input>
					</el-form-item>
					<el-form-item label="站点域名">
						<el-input v-model="siteForm.domain"></el-input>
					</el-form-item>
					<el-form-item label="站点LOGO">
						<upload v-model="siteForm.logo"></upload>
					</el-form-item>
					<el-form-item label="站点关键字">
						<el-input v-model="siteForm.keywords"></el-input>
					</el-form-item>
					<el-form-item label="站点描述">
						<el-input type="textarea" v-model="siteForm.description"></el-input>
					</el-form-item>
					<el-form-item label="站点备案">
						<el-input v-model="siteForm.icp"></el-input>
					</el-form-item>

					<el-form-item label="站点模板">
						<el-select v-model="currentTheme">
							<el-option v-for="item in themes" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="统计代码">
						<el-input type="textarea" v-model="siteForm.statistical"></el-input>
					</el-form-item>
					<el-form-item label="尾部信息">
						<el-input type="textarea" v-model="siteForm.copyright"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="update">修改</el-button>
						<el-button type="warning" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
interface site {
	id: number
	title: string
	subtitle: string
	domain: string
	logo: string
	keywords: string
	description: string
	icp: string
	theme: string
	statistical: string
	copyright: string
}

import { ElMessage } from 'element-plus'
import { computed, defineComponent, reactive, toRef, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { _getSite, _updateSite } from '../../../api/site'
import Upload from '../../../components/Upload/index.vue'
export default defineComponent({
	name: 'index',
	components: {
		Upload,
	},
	setup() {
		const store = useStore()
		const state = reactive({
			activeName: 'first',
			sites: [] as site[],
			siteForm: {
				id: 0,
				title: '',
				subtitle: '',
				domain: '',
				logo: '',
				keywords: '',
				description: '',
				icp: '',
				theme: '',
				statistical: '',
				copyright: '',
			},
			currentTheme: '',
			themes: [] as string[],
		})

		const acode = store.state.acode


		watch(
			() => store.state.acode,
			(n, o) => {
				state.siteForm = state.sites.find(site => site.theme === n) as site
				state.currentTheme = n
			}
		)

		const getSite = () => {
			_getSite()
				.then((sites: site[]) => {
					state.sites = sites
					state.siteForm = Object.assign(
						{},
						sites.find(site => site.theme === acode)
					)
					state.currentTheme = acode
					state.themes = sites.map(site => site.theme)
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		}

		getSite()

		return {
			...toRefs(state),
			getSite,
		}
	},
	methods: {
		reset() {
			let siteForm = this.sites.find(site => site.theme === this.currentTheme) as site
			this.siteForm = Object.assign({}, siteForm)
		},
		async update() {
			let data: any = {}
			Object.keys(this.siteForm).forEach(key => {
				if (key !== 'id') {
					//@ts-ignore
					data[key] = this.siteForm[key]
				}
			})
			try {
				await _updateSite({
					findOption: {
						id: this.siteForm.id,
					},
					data,
				})
				ElMessage.success('修改成功')
				this.getSite()
			} catch (err) {
				ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
			}
		}
	},
})
</script>

<style lang="scss" scoped></style>
