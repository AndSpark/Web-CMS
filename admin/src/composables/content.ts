import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Content, ContentFindOption, _deleteContent, _getContent, _putContent } from "../api/content";
import { _getContentExt, _getExtField } from "../api/extfield";
import { _getSortList } from "../api/sort";

function content() {
	const store = useStore()
	const route = useRoute()
	const state = reactive({
		activeName: '1',
		editId: 0,
		isEditContent:false,
		contentForm: {
			where: {
				mcode: route.params.mcode,
				acode:	store.state.acode
			},
			take: 10,
			skip:0
		} as ContentFindOption,
		count: 0,
		currentPage:1,
		contentList: [] as Content[],
		originContentList: [] as Content[],
		multipleSelection:[] as Content[],
		isEditSorting: false,
		sortingList: [] as Content[],
		extList: [],
		sortList: [] as any[],
		host:''
	})
	state.host = location.protocol + '//' + location.hostname;

	const actions = {
		async getContent() {
			try {
				let { list, count } = await _getContent(state.contentForm)
				state.contentList = list
				state.count = count
				state.originContentList = JSON.parse(JSON.stringify(state.contentList))
				await actions.getSortList()
				actions.setLan()
			} catch (err) {
				ElMessage.error(err.message + ' | 出错了，请过会儿再试（半分钟左右）')
			}
		},
		search(keyword: string) {
			if (!keyword) {
				delete state.contentForm.where.title
			} else {
				state.contentForm.where.title = keyword
			}
			actions.getContent()
			delete state.contentForm.where.title
		},
		scodeChange(scode: string) {
			state.contentForm.where.scode = scode
			actions.getContent()
		},
		edit(id: number) {
			state.activeName = '3'
			state.editId = id
			state.isEditContent = true
		},
		changeTab(tab:any) {
			if (tab.props.name !== '3') {
				state.isEditContent = false
			}
		},
		deleteContent(content:Content) {
			_deleteContent({ id: content.id }).then(res => {
				ElMessage.success('删除成功')
				actions.getContent()
			}).catch(err => ElMessage.error(err.message + ' | 出错了，请过会儿再试（半分钟左右）'))
		},
		deleleList() {
			const lists = state.multipleSelection.map(v => {return{id:v.id}})
			_deleteContent(lists).then(res => {
				ElMessage.success('删除成功')
				actions.getContent()
			}).catch(err => ElMessage.error(err.message + ' | 出错了，请过会儿再试（半分钟左右）'))
		},
		changeSorting(content: Content) {
			const sorting = Number(content.sorting)
			const findSort = state.sortingList.find(v => v.id === content.id)
			if (!findSort) {
				const originSort = state.contentList.find(v => v.id === content.id) as Content
				originSort.sorting = sorting
				state.sortingList.push(originSort)
			} else {
				findSort.sorting = sorting
			}
		},
		updateSorting() {
			_putContent(state.sortingList).then(res => {
				ElMessage.success('修改成功')
				actions.getContent()
				state.isEditSorting = false
				state.sortingList = []
			}).catch(err => {
				ElMessage.error(err.message + ' | 出错了，请过会儿再试（半分钟左右）')
			})
		},
		cancelSorting() {
			state.sortingList.forEach(v => {
				v.sorting = state.originContentList.find(x => x.id === v.id)?.sorting as number
			})
			state.isEditSorting = false
		},
		posted() {
			state.isEditContent = false
			state.activeName = '1'
			actions.getContent()
		},
		handleSelectionChange(val:Content[]){
			state.multipleSelection = val
		},
		pageChange(page: number) {
			state.contentForm.skip = (page - 1) * 10
			actions.getContent()
		},
		setLan() {
			state.contentList = state.contentList.map(v => {
				const sort = state.sortList.find(x => x.scode === v.scode)
				return {
					...v,
					lan:sort.name
				}
			})
		},
		pics(urls:string) {
			return urls.split(',').map(v => {
				return {
					url:location.protocol + '//' + location.hostname + v,
					origin:v,
					show:v ? true : false
				}
			}).filter(v => v.show)
		},
		async getSortList() {
			state.sortList = await 	_getSortList({ mcode: route.params.mcode as string, acode: store.state.acode })
		}
	}
	

	actions.getContent()	


	return {
		state,actions,store,
	}
}

export {content}