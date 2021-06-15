import { ComponentCustomProperties,  Ref } from 'vue'
import { Store } from 'vuex'
import loadingBar from './components/loading-bar.vue'

interface User {
	username: string;
	realname: string;
	status: string;
}



declare module '@vue/runtime-core' {
  // 声明自己的 store state
  interface State {
		user: User | null
		acode:string
  }

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
		$store: Store<State>
		$loadingBar: {
			start: Function
			end:Function
		}
  }
}