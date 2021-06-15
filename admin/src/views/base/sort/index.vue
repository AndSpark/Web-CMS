<template>
	<div>
		<el-tabs v-model="activeName" tab-position="top">
			<el-tab-pane label="栏目列表" name="1">
				<el-table
					:data="sortTree"
					border
					style="width: 100%"
					row-key="id"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="40"> </el-table-column>
					<el-table-column prop="name" label="栏目名称" min-width="200"> </el-table-column>
					<el-table-column prop="scode" label="栏目编码" width="80"></el-table-column>
					<el-table-column prop="pcode" label="父编码" width="70"></el-table-column>
					<el-table-column prop="mcode" label="模型" width="70">
						<template #default="{ row }">
							<p>{{ getModelLabel(row.mcode) }}</p>
						</template>
					</el-table-column>
					<el-table-column prop="listtpl" label="列表页模板" min-width="100"> </el-table-column>
					<el-table-column prop="contenttpl" label="内容页模板" min-width="100"> </el-table-column>
					<el-table-column prop="sorting" sortable label="排序" width="80">
						<template #default="{ row }">
							<p v-if="!isEditSorting">{{ row.sorting }}</p>
							<el-input v-model="row.sorting" v-else @input="changeSorting(row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" min-width="50">
						<template #default="{ row }">
							<el-tag type="success" v-if="row.status === '1'">启用</el-tag>
							<el-tag type="danger" v-else>禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template #default="{ row }">
							<el-popconfirm title="确定删除吗？" @confirm="deleteSort(row)">
								<template #reference>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
							<el-button type="primary" size="small" @click="openUpdateDialog(row)">修改</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row type="flex" style="margin: 20px">
					<el-popconfirm title="确定删除吗？" @confirm="deleteSortList">
						<template #reference>
							<el-button type="danger">批量删除</el-button>
						</template>
					</el-popconfirm>
					<el-button type="primary" v-if="!isEditSorting" @click="isEditSorting = true"
						>修改排序</el-button
					>
					<div v-else style="margin-left: 16px">
						<el-button type="primary" @click="updateSorting">保存排序</el-button>
						<el-button type="primary" @click="cancelSorting">取消</el-button>
					</div>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="栏目新增" name="2">
				<sort-detail
					:sortTree="sortTree"
					:addScode="addScode"
					@update-sort="addSortDone"
					:models="models"
				></sort-detail>
			</el-tab-pane>
			<el-tab-pane label="批量新增" name="3">
				<sort-detail
					:sortTree="sortTree"
					:addScode="addScode"
					@update-sort="addSortDone"
					:models="models"
					:batch="true"
				></sort-detail>
			</el-tab-pane>
		</el-tabs>

		<el-dialog v-model="dialogVisible" top="5vh" width="80%">
			<div>
				<sort-detail
					ref="sortDialog"
					:sortTree="sortTree"
					@update-sort="getSortList"
					:models="models"
					:update="true"
				></sort-detail>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts">
interface Sort {
	id: number
	acode: string
	mcode: string
	pcode: string
	scode: string
	name: string
	listtpl: string
	contenttpl: string
	status: string
	outlink: string
	subname: string
	ico: string
	pic: string
	title: string
	keywords: string
	description: string
	filename: string
	sorting: number
}

export interface SortTree extends Sort {
	children: Sort[]
}

import { ElMessage } from 'element-plus'
import { computed, ComputedRef, defineComponent, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { _getModels } from '../../../api/model'
import { _deleteSort, _getSortList, _updateSort } from '../../../api/sort'
import { formatFlat, formatTree } from '../../../utils'
import sortDetail from './components/sortDetail.vue'
export default defineComponent({
	name: 'index',
	components: {
		sortDetail,
	},
	setup() {
		const store = useStore()
		const state = reactive({
			activeName: '1',
			sortList: [] as Sort[],
			originSortList: [] as Sort[],
			addScode: '1',
			models: [] as any[],
			dialogVisible: false,
			isEditSorting: false,
			sortingList: [] as Sort[],
			multipleSelection: [] as Sort[],
		})

		const sortTree: ComputedRef<SortTree[]> = computed(() => {
			const tree: SortTree[] = formatTree(state.sortList, 'scode', '0', 'pcode', 'children')
			return tree
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

		const getSortList = () => {
			_getSortList({ acode: store.state.acode })
				.then(sortList => {
					if(sortList && sortList.length){
						state.sortList = JSON.parse(JSON.stringify(sortList))
						state.originSortList = JSON.parse(JSON.stringify(sortList))
						state.addScode = (
							parseInt(JSON.parse(JSON.stringify(sortList)).reverse()[0].scode) + 1
						).toString()
					state.dialogVisible = false

					}
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		}

		watch(
			() => store.state.acode,
			(n, o) => {
				getSortList()
			}
		)

		getSortList()

		return {
			...toRefs(state),
			sortTree,
			getSortList,
		}
	},
	methods: {
		deleteSort(sort: any) {
			let data
			if (sort.children) {
				data = formatFlat(sort, 'children', true).map((v: any) => {
					return { id: v.id }
				})
			} else {
				data = { id: sort.id }
			}

			_deleteSort(data)
				.then(res => {
					ElMessage.success('删除成功')
					this.getSortList()
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		},
		getModelLabel(mcode: string) {
			const model = this.models.find(v => v.mcode === mcode)
			return model.name
		},
		async openUpdateDialog(sort: Sort) {
			this.dialogVisible = true
			await this.$nextTick()
			//@ts-ignore
			this.$refs.sortDialog.formSort = JSON.parse(JSON.stringify(sort))
			//@ts-ignore
			this.$refs.sortDialog.originFormSort = JSON.parse(JSON.stringify(sort))
		},
		addSortDone() {
			this.activeName = '1'
			this.getSortList()
		},
		changeSorting(sort: Sort) {
			const sorting = Number(sort.sorting)
			const findSort = this.sortingList.find(v => v.id === sort.id)
			if (!findSort) {
				const originSort = this.originSortList.find(v => v.id === sort.id) as Sort
				originSort.sorting = sorting
				this.sortingList.push(originSort)
			} else {
				findSort.sorting = sorting
			}
		},
		updateSorting() {
			const updateData = this.sortingList.map(v => {
				return {
					findOption: {
						id: v.id,
					},
					data: v,
				}
			})
			_updateSort(updateData)
				.then(res => {
					this.getSortList()
					ElMessage.success('修改成功')
					this.isEditSorting = false
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		},
		cancelSorting() {
			this.sortingList.forEach(v => {
				v.sorting = this.originSortList.find(x => x.id === v.id)?.sorting as number
			})
			this.isEditSorting = false
		},
		handleSelectionChange(val: Sort[]) {
			this.multipleSelection = val
			console.log(val)
		},
		deleteSortList() {
			const list: Sort[] = formatFlat(this.multipleSelection, 'children', true)
			if (!list.length) return
			console.log(list);
			const ids = list.map(v => {
				return { id: v.id }
			})
			_deleteSort(ids)
				.then(res => {
					ElMessage.success('删除成功')
					this.getSortList()
				})
				.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
		},
	},
})
</script>

<style lang="scss" scoped></style>
