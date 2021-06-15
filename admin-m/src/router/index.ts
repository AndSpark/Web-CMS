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
				name: 'Sites',
				component: () => import('../views/sites/index.vue'),
				path: 'sites',
			},
			{
				name: 'Add',
				component: () => import('../views/add/index.vue'),
				path: 'add',
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
