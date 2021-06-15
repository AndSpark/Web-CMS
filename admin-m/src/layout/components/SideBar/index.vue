<template>
	<el-menu default-active="1" router>
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
import { defineComponent, reactive, toRefs } from 'vue'
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
					title: '网站列表',
					path: '/sites',
				},
				{
					title: '新增网站',
					path: '/add',
				},
			
			],
			models: [],
		})


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
