<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="4" :offset="0" v-if="!single">
				<el-cascader
					:options="sortTree"
					v-model="currentScode"
					:show-all-levels="false"
					:props="{
						expandTrigger: 'hover',
						value: 'scode',
						label: 'name',
						emitPath: false,
					}"
					@change="$emit('scode-change', currentScode)"
				>
				</el-cascader>
			</el-col>
			<el-col :span="6" :offset="0">
				<el-input v-model="keywords" placeholder="请输入关键字"></el-input>
			</el-col>
			<el-col :span="6" :offset="0">
				<el-button type="primary" @click="$emit('search', keywords)">搜索</el-button>
				<el-button type="info" @click="clearSearch">清除搜索</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { _getSortList } from '../../../api/sort'
import { formatTree } from '../../../utils'

export default defineComponent({
	name: 'Search',
	props: {
		single: {
			type: Boolean,
			required: true,
		}
	},
	setup(props, { emit }) {
		const route = useRoute()
		const store = useStore()
		const state = reactive({
			sortList: [],
			currentScode: '',
			keywords: '',
		})

		const sortTree = computed(() => {
			let tree = formatTree(state.sortList, 'scode', '0', 'pcode', 'children')
			if (tree.length === 1 && tree[0].children) {
				const list = tree[0].children
				delete tree[0].children
				tree[0].scode = null
				return [tree[0],...list]
			}
			return tree
		})

		const actions = {
			getSortList() {
				_getSortList({ mcode: route.params.mcode as string, acode: store.state.acode })
					.then(sorts => {
						state.sortList = sorts;
					})
					.catch(err => ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）'))
			},
			clearSearch() {
				state.keywords = ''
				emit('search', '')
			},
		}

		actions.getSortList()

		return {
			route,
			...toRefs(state),
			sortTree,
			...actions,
		}
	},
})
</script>

<style lang="scss" scoped></style>
