<template>
<div class="nav-bar">
	<h2 @click="$router.push('/')">
	网站后台管理系统</h2>

	<div class="breadcrumb"></div>
	<el-button type="text"  @click="logout">退出</el-button>
</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import {ElMessage} from 'element-plus'
import { localRemove } from '../../../utils'
export default defineComponent({ 
	name:'index',
	components:{
	},
	 setup() {

	},
	methods:{
		logout(){
			localRemove('token')
			this.$store.commit('setUser', null)
			this.$router.push('/login')
			ElMessage.success('退出成功')
		},
		changeAcode(area:string){
			this.$store.commit('setAcode',area)
		}
	}
})
</script>

<style lang='scss' scoped>
.nav-bar {
	
	background-color: #569fff;
	color: #fff;
	display: flex;
	align-items: center;
	width:100%;
	border-bottom: 1px solid #ccc;
	h2 {
		width: 400px;
		text-align: center;
		cursor: pointer;
	}
	.breadcrumb {
		flex:1;
		margin-left: 50px;
	}
	.el-button {
		width: 100px;
		color: #fff;
		&:hover {
			color: #98c4ff;
		}
	}
	img {
		height: 80px;
		position: absolute;
		left: -0;
		top: -8px;
	}
}
</style>