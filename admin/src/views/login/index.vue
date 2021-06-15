<template>
	<div v-show="show">
		<el-row type="flex" justify="center" align="middle" style="height: 100vh;overflow:hidden">
			<el-col :span="12" :offset="0" style="height: 100%">
				<div class="center relative">
					<h1>
						<img src="../../assets/logo.png" />
						乐搜网络后台管理系统</h1>
					<div class="circle"></div>
					<login-svg style="width: 80%; margin-bottom: -20%; margin-left: 20%"></login-svg>
				</div>
			</el-col>
			<el-col :span="12" :offset="0" style="height: 100%">
				<div class="relative center" style="height: 100%;overflow: hidden">
					<div class="circle2"></div>
					<div style="width: 500px; margin: auto">
					<el-card shadow="always" :body-style="{ padding: '20px' }">
						<template #header>
							<h2 style="text-align: center">用户登录</h2>
						</template>
						<el-form ref="loginForm" :model="form" label-width="60px">
							<el-form-item label="用户名" prop="username">
								<el-input v-model="form.username" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="密码" prop="password">
								<el-input v-model="form.password" @keyup.enter="login" autocomplete="off" show-password></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="login">立即登录</el-button>
								<el-button type="primary" @click="isUpdate = true" >修改密码</el-button>
							</el-form-item>
						</el-form>
					</el-card>
				</div>
				</div>
			</el-col>
		</el-row>
		<el-dialog
			title="密码修改"
			v-model="isUpdate"
			width="600px"
			:before-close="()=> isUpdate = false"
			>
			<el-form ref="form2" :rules="rules" :model="updateForm" label-width="100px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="updateForm.username"></el-input>
				</el-form-item>
				<el-form-item label="原密码" prop="originPassword">
					<el-input v-model="updateForm.originPassword" show-password></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input v-model="updateForm.password" show-password></el-input>
				</el-form-item>
				<el-form-item label="重复新密码" prop="confirmPassword">
					<el-input v-model="updateForm.confirmPassword" show-password></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="update">立即修改</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { _getUser, _login } from '../../api/auth'
import { user } from '../../composables/user'
import LoginSvg from './svg/login.vue'
export default defineComponent({
	name: 'Login',
	components: {
		LoginSvg,
	},
	setup() {
		const show = ref(false)
		return { ...user(), show }
	},
	beforeRouteEnter(to, from, next) {
		next(async (vm: any) => {
			try {
				await vm.getUser()
				vm.$router.push('/')
			} catch (error) {
				vm.show = true
				return true
			}
		})
	},
})
</script>

<style lang="scss" scoped>
#mycanvas {
	float: right;
	margin-left: 15px;
}
.center {
	display: grid;
	place-items: center;
	height: 100%;
}
.relative {
	position: relative;
}
.circle {
	position: absolute;
	top: -110%;
	left: -100%;
  background: linear-gradient(to right, #56ccf2, #2f80ed); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	padding: 105%;
	border-radius: 50%;
	z-index: -1;
}
.circle2 {
	position: absolute;
	right: -50%;
	bottom: -50%;
  background: linear-gradient(to right, #56ccf2, #2f80ed); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */




	padding: 50%;
	border-radius: 50%;
	z-index: -1;
}
h1 {
	position: absolute;
	top: 10%;
	left: 30%;
	font-size: 40px;
	color: #fff;
	letter-spacing: 0.2rem;

	img {
		width: 120px;
		position: absolute;
		left: -120px;
		top: -40px;
	}
}
</style>
