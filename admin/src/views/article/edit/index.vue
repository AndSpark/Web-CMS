<template>
	<div>
		<el-tabs v-model="activeName" type="card" tab-position="top">
			<el-tab-pane label="基础内容" name="1">
				<el-form ref="form" :model="content" label-width="120px">
					<el-form-item label="内容栏目" v-if="!single">
						<el-cascader
							:options="sortTree"
							v-model="content.scode"
							:show-all-levels="false"
							:props="{
								expandTrigger: 'hover',
								value: 'scode',
								label: 'name',
								emitPath: false,
							}"
						>
						</el-cascader>
					</el-form-item>
					<el-form-item label="内容标题">
						<el-input v-model="content.title"></el-input>
					</el-form-item>

					<el-form-item :label="ext.description" v-for="ext in extList" :key="ext.id">
						<Tinymce v-model="content[ext.name]" v-if="ext.type === '8'"></Tinymce>
						<el-input v-model="content[ext.name]" v-else :type="ext.type === '2' ? 'textarea' : ''"></el-input>
					</el-form-item>

					<el-form-item label="内容">
						<Tinymce v-model="content.content"></Tinymce>
					</el-form-item>
					<el-form-item label="tags">
						<el-input v-model="content.tags"></el-input>
					</el-form-item>
					<el-form-item label="作者">
						<el-input v-model="content.admin"></el-input>
					</el-form-item>
					<el-form-item label="来源">
						<el-input v-model="content.source"></el-input>
					</el-form-item>
					<el-form-item label="略缩图">
						<upload v-model="content.ico"></upload>
					</el-form-item>
					<el-form-item label="轮播多图">
						<upload v-model="content.pics" :multiple="true" :deleteBtn="true"></upload>
					</el-form-item>
					<el-form-item label="参数" v-if="!single">
						<el-checkbox v-model="content.istop" label="顶置" border size="medium"></el-checkbox>
						<el-checkbox
							v-model="content.isrecommend"
							label="推荐"
							border
							size="medium"
						></el-checkbox>
						<el-checkbox
							v-model="content.isheadline"
							label="头条"
							border
							size="medium"
						></el-checkbox>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="高级内容" name="2">
				<el-form ref="form2" :model="content" label-width="120px">
					<el-form-item label="内容副栏目" v-if="!single">
						<el-input v-model="content.subscode"></el-input>
					</el-form-item>
					<el-form-item label="标题颜色">
						<el-color-picker v-model="content.titlecolor"></el-color-picker>
					</el-form-item>
					<el-form-item label="副标题">
						<el-input v-model="content.subtitle"></el-input>
					</el-form-item>
					<el-form-item label="自定义路径名" v-if="!single">
						<el-input v-model="content.filename"></el-input>
					</el-form-item>
					<el-form-item label="跳转外链接">
						<el-input v-model="content.outlink"></el-input>
					</el-form-item>
					<el-form-item label="发布时间">
						<el-input v-model="content.create_time"></el-input>
					</el-form-item>
					<el-form-item label="附件">
						<upload v-model="content.enclosure" :file="true"></upload>
					</el-form-item>
					<el-form-item label="SEO关键字">
						<el-input v-model="content.keywords"></el-input>
					</el-form-item>
					<el-form-item label="SEO描述">
						<el-input v-model="content.description" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="状态">
						<el-radio v-model="content.status" label="1">显示</el-radio>
						<el-radio v-model="content.status" label="0">隐藏</el-radio>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>

		<el-button type="primary" style="margin-left: 120px" @click="postForm">立即提交</el-button>
		<el-button type="warning" @click="resetContent">重置</el-button>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Content, _getContentItem, _putContent } from '../../../api/content'
import { _getSortList } from '../../../api/sort'
import Tinymce from '../../../components/Tinymce/index.vue'
import { formatTree, htmlDecode, htmlEncode } from '../../../utils'
import Upload from '../../../components/Upload/index.vue'
import { _getContentExt, _getExtField } from '../../../api/extfield'
export default defineComponent({
	name: 'Edit',
	components: {
		Tinymce,
		Upload,
	},
	props: {
		single: {
			type: Boolean,
			default: true,
		},
		id: {
			type: Number,
			default: 0,
		},
		addMode: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, { emit }) {
		const route = useRoute()
		const store = useStore()
		const state = reactive({
			content: {
				acode: store.state.acode,
				scode: '',
				subscode: '',
				title: '',
				titlecolor: '#333333',
				subtitle: '',
				filename: '',
				author: '',
				source: '',
				outlink: '',
				date: '',
				ico: '',
				pics: '',
				content: '',
				tags: '',
				enclosure: '',
				keywords: '',
				description: '',
				sorting: 255,
				status: '1',
				istop: '0',
				isrecommend: '0',
				isheadline: '0',
				visits: 0,
				likes: 0,
				oppose: 0,
			} as Content,
			originContent: {} as Content,
			activeName: '1',
			sortList: [],
			extList: [] as any[],
			extContent: {} as any,
			extType:{
				
			},
			needEncode:[] as string[]
		})

		const sortTree = computed(() => {
			let tree = formatTree(state.sortList, 'scode', '0', 'pcode', 'children')
			if (tree.length === 1 && tree[0].children) {
				const list = tree[0].children
				return list
			}
			return tree
		})

		const actions = {
			resetContent() {
				state.content = JSON.parse(JSON.stringify(state.originContent))
			},
			postForm() {
				state.content.content = htmlEncode(state.content.content)
				state.needEncode.forEach(v => {
					state.content[v] = htmlEncode(state.content[v] as string)
				})
				_putContent(state.content)
					.then(res => {
						emit('posted')
						ElMessage.success('提交成功')
					})
					.catch(err => {
						console.log(err.message)
						ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
					})
			},
			async getContentExt() {
				let ext = await _getExtField()
				if (Array.isArray(ext) && ext.length) {
					ext = ext.filter(v => 
						 v.mcode === route.params.mcode
					)
					if (ext.length) {
						state.extList = ext
						let res = await _getContentExt(state.content.id)
						if (Array.isArray(res) && res.length) {
							state.extContent = res[0]
							state.extList.forEach(v => {
								let str = res[0][v.name]
								if (str) {
									if(v.type === '8'){
										str = htmlDecode(str)
										state.needEncode.push(v.name)
									}
									state.content[v.name] = str
									state.originContent[v.name] = str
								} else {
									state.content[v.name] = ''
									state.originContent[v.name] = ''
								}
							})
						} else {
							state.extList.forEach(v => {
								state.content[v.name] = ''
								state.originContent[v.name] = ''
							})
						}
					}
				}
			},
		}

		const getSortList = () => {
			_getSortList({ mcode: route.params.mcode as string, acode: store.state.acode })
				.then(sorts => (state.sortList = sorts))
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		}

		const getContentItem = () => {
			_getContentItem(props.id)
				.then(res => {
					state.content = JSON.parse(JSON.stringify(res[0]))
					state.content.content = htmlDecode(state.content.content)
					state.originContent = JSON.parse(JSON.stringify(res[0]))
					actions.getContentExt()
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		}
		if (!props.addMode) {
			getContentItem()
		}

		getSortList()
		return {
			route,
			...toRefs(state),
			...actions,
			getContentItem,
			getSortList,
			sortTree,
		}
	},
})
</script>

<style lang="scss" scoped></style>
