<template>
<div>
	<el-breadcrumb separator="/">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item v-for="route in breadcrumbs" :key="route.name" :to="route.path">{{route.name}}</el-breadcrumb-item>
	</el-breadcrumb>
</div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({ 
	name:'index',
	setup(){
		const route = useRoute()
		let breadcrumbs:any[]  = reactive([])
		
		const getBreadcrumb = () => {
			breadcrumbs = [
				route
			]
		}
		getBreadcrumb()
		return {
			breadcrumbs
		}
	}
})
</script>

<style lang='scss' scoped>

</style>