import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '../store'
import Layout from '../layout/index.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'Login',
		path: '/login',
		component: () => import('../views/login/index.vue'),
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashborad',
		children: [
			{
				name: 'Dashboard',
				component: () => import('../views/dashborad/index.vue'),
				path: 'dashborad',
			},
			{
				name: 'Label',
				path: 'label',
				component: () => import('../views/global/label/index.vue'),
			},
			{
				name: 'Model',
				path: 'model',
				component: () => import('../views/global/model/index.vue'),
			},
			{
				name: 'ExtField',
				path: 'extfield',
				component: () => import('../views/global/ext-field/index.vue'),
			},
			{
				name: 'Site',
				path: 'site',
				component: () => import('../views/base/site/index.vue'),
			},
			{
				name: 'Company',
				path: 'company',
				component: () => import('../views/base/company/index.vue'),
			},
			{
				name: 'Sort',
				path: 'sort',
				component: () => import('../views/base/sort/index.vue'),
			},
			{
				name: 'Single',
				path: 'single/:mcode',
				component: () => import('../views/article/single/index.vue'),
			},
			{
				name: 'Content',
				path: 'content/:mcode',
				component: () => import('../views/article/content/index.vue'),
			},
			{
				name: 'Area',
				path: 'Area',
				component: () => import('../views/other/area/index.vue'),
			},
			{
				name: 'Message',
				path: 'message',
				component: () => import('../views/other/message/index.vue'),
			},
			{
				name: 'Slide',
				path: 'slide',
				component: () => import('../views/other/slide/index.vue'),
			},
			{
				name: 'Translate',
				path: 'translate',
				component: () => import('../views/tool/translate/index.vue'),
			},
			{
				name: 'Batch',
				path: 'batch',
				component: () => import('../views/tool/batch/index.vue'),
			},
		],
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

router.beforeEach((to, from) => {
	if (to.name !== 'Login' && !store.getters.isLogin) {
		return '/login'
	}
	return true
})

export default router
