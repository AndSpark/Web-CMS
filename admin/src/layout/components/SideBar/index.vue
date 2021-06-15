<template>
	<el-menu default-active="1" router unique-opened	>
		<template v-for="route in routeList" :key="route.title">
			<el-submenu :index="route.title" v-if="route.children">
				<template #title>{{ route.title }}</template>
				<el-menu-item
					:index="routeChild.path"
					v-for="routeChild in route.children"
					:key="routeChild.title"
					>{{ routeChild.title }}
				</el-menu-item>
			</el-submenu>
			<el-menu-item :index="route.path" v-else>{{ route.title }}</el-menu-item>
		</template>
	</el-menu>
	<div class="svg-block">
		<wire-framing style="width: 200%"></wire-framing>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { _getModels } from '../../../api/model'
import WireFraming from '../../../components/icons/WireFraming.vue'
export default defineComponent({
	name: 'index',
	components: {
		WireFraming,
	},
	setup() {
		const state = reactive({
			routeList: [
				{
					title: '首页统计',
					path: '/',
				},
				{
					title: '全局配置',
					children: [
						{
							title: '定制标签',
							path: '/label',
						},
						{
							title: '模型管理',
							path: '/model',
						},
						{
							title: '模型字段',
							path: '/extfield',
						},
					],
				},
				{
					title: '基础内容',
					children: [
						{
							title: '站点信息',
							path: '/site',
						},
						{
							title: '公司信息',
							path: '/company',
						},
						{
							title: '内容栏目',
							path: '/sort',
						},
					],
				},
				{
					title: '文章内容',
					children: [],
				},
				{
					title: '其他选项',
					children: [
						{
							title: '区域配置',
							path: '/area',
						},
						{
							title: '留言信息',
							path: '/message',
						},
						{
							title: '轮播图片',
							path: '/slide',
						},
					],
				},
				
			],
			models: [],
		})

		if(import.meta.env.VITE_DEV === '1'){
					state.routeList.push({
					title:'辅助工具',
					children:[
						{
							title:'数据翻译',
							path:'/translate'
						},
						{
							title:'批量上传',
							path:'/batch'
						}
					]
				})
		}


		const getModels = () => {
			_getModels()
				.then(res => {
					state.routeList[3].children = res.map((v: any) => {
						return {
							title: v.name + '内容',
							path: v.type === '1' ? `/single/${v.mcode}` : `/content/${v.mcode}`,
						}
					})
				})
				.catch(err => {
					ElMessage.error('获取模型失败')
				})
		}
		getModels()

		return {
			...toRefs(state),
		}
	},
})
</script>

<style lang="scss" scoped>
.el-menu {
	border-right: 0;
	overflow: hidden;
}
.svg-block {
	overflow: hidden;
	position: absolute;
	width: 200px;
	bottom: 0px;
	z-index: -1;
	opacity: 0.8;
	svg {
		margin-bottom: -200px;
	}
}
</style>
