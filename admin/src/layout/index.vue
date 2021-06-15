<template>
	<div>
		<el-container direction="vertical">
			<el-header style="padding: 0" height="70">
				<nav-bar></nav-bar>
			</el-header>
			<el-container direction="horizontal">
				<el-aside width="200px">
					<Sidebar />
				</el-aside>
				<el-container direction="vertical" class="relative2">
					<el-main>
						<el-card shadow="always" :body-style="{ padding: '20px' }">
							<router-view :key="$route.path + $store.state.acode"></router-view>
						</el-card>
					</el-main>
					<div class="circle2"></div>

				</el-container>

			</el-container>
		</el-container>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar/index.vue'
import Sidebar from './components/SideBar/index.vue'
export default defineComponent({
	name: 'index',
	components: {
		NavBar,
		Sidebar,
	},
})
</script>

<style lang="scss" scoped>
.relative2 {
	position:relative;
	overflow: hidden;
	height: calc(100vh - 70px);
}
.el-main {
	position: relative;

  background: linear-gradient(to right, rgb(251, 254, 255), #f2fcfe); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	overflow-y: auto;
	overflow-x: hidden;
	height: calc(100vh - 70px);
	::-webkit-scrollbar {
		width: 8px;
		z-index: 9;
	}
}

::-webkit-scrollbar {
	width: 6px;
	height: 8px;
	background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(196, 196, 196, 0.3);
	border-radius: 10px;
	background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	background-color: rgb(177, 174, 174);
}

.el-aside {
	border-right:1px solid #ccc;
}
.circle {
	position: absolute;
	top: 10%;
	left: 0;
  background: linear-gradient(to right, #56ccf2, #2f80ed); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	padding: 105%;
	border-radius: 50%;
	z-index: 1;
}
.el-card {
	position: relative;
	z-index:2;
}
.circle2 {
	position: absolute;
	right: -30%;
	bottom: -90%;
  background: linear-gradient(to right, #56ccf2, #2f80ed); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	width: 100vh;
	height: 100vh;
	border-radius: 50%;
	z-index: 0;
}
</style>
