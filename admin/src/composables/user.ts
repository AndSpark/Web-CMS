import { _getUser, _login, _updateUser } from '../api/auth'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

function user() {
	const store = useStore()
	const router = useRouter()
	const state = reactive({
		form: {
			username: '',
			password: '',
		},
		userInfo: null,
		isUpdate:false,
		updateForm: {
			username: '',
			originPassword: '',
			password: '',
			confirmPassword: '',
		},
		rules: {
			username:[{ required: true, message: '请输入用户名', trigger: 'blur' }],
			originPassword:[{ required: true, message: '请输入原密码', trigger: 'blur' }],
			password:[{ required: true, message: '请输入新密码', trigger: 'blur' }],
			confirmPassword:[{ required: true, message: '请输入重复新密码', trigger: 'blur' }],
		},
		form2: null,
	})

	const getters = {
		userInfo: computed(() => store.state.user),
		isLoggedIn: computed(() => store.getters.isLogin),
	}

	const actions = {
		async login() {

			try {
				await _login(state.form)
				await actions.getUser()
				router.push('/')
				ElMessage.success('登录成功')
			} catch (error) {
				if (error.statusCode === 401) {
					ElMessage.error('账号密码错误')
				} else {
					ElMessage.error('网络错误')
				}
			}
		},
		getUser() {
			return new Promise(async (resolve, reject) => {
				try {
					const user = await _getUser()
					store.commit('setUser', user)
					resolve('')
				} catch (error) {
					console.log(error);
					reject(error)
				}
			})
		},
		update() {
			//@ts-ignore
			state.form2.validate((valid) => {
				if (!valid) {
					return false
				}
				if (state.updateForm.password !== state.updateForm.confirmPassword) {
					return ElMessage.error('两次新密码输入不一致')
				}
				_updateUser(state.updateForm).then(res => {
					ElMessage.success('修改成功')
					state.isUpdate = false
					state.updateForm = {
						username: '',
						originPassword: '',
						password: '',
						confirmPassword: '',
					}
				}).catch(err => ElMessage.error(err.message))
			})
		}
	}

	


	return {
		store,
		router,
		...toRefs(state),
		...getters,
		...actions,
	}
}

export { user }
