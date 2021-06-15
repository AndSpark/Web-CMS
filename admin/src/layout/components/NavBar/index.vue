<template>
<div class="nav-bar">
	<h2 @click="$router.push('/')">
	网站后台管理系统</h2>
	<p>区域选择：</p>
	<el-select v-model="currentArea" @change="changeAcode">
		<el-option
			v-for="item in areas"
			:key="item.id"
			:label="item.name + item.acode"
			:value="item.acode">
		</el-option>
	</el-select>
	<div class="breadcrumb"></div>
	<el-button type="text">
		<a :href="origin" target="_blank" style="text-decoration:none;color:white">网站首页</a>
	</el-button>
	<el-button type="text"  @click="clearCache">清除缓存</el-button>
	<el-button type="text"  @click="logout">退出</el-button>
</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref,watch } from 'vue'
import {ElMessage} from 'element-plus'
import { localRemove } from '../../../utils'
import {  getAreaFunc } from '../../../composables/area'
import { _clearCache } from '../../../api/other'
import { useStore } from 'vuex'
export default defineComponent({ 
	name:'index',
	components:{
	},
	 setup() {
		 const store = useStore()
		let {getArea,areas,currentArea} = getAreaFunc()
		let origin = ref('')
		getArea(true)
		onMounted(() => {
			origin.value = location.origin
		})

		return {
			getArea,areas,currentArea,origin,store
		}
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
		},
		clearCache(){
			_clearCache().then(res => ElMessage.success('清除成功'))
			.catch(err => ElMessage.error(err.message + ' | 清除失败'))
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