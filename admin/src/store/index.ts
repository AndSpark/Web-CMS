import { createStore } from 'vuex'

const store = createStore({
	state: {
		user: null,
		acode:'',
	},
	mutations: {
		setUser(state, user) {
			state.user = user
		},
		setAcode(state, acode) {
			state.acode = acode
		}
	},
	getters: {
		isLogin(state) {
			if (state.user) {
				return true
			}
			return false
		}
	}
})

export default store