import store from '../store'
import {ElMessage} from 'element-plus'
import { localRemove } from '../utils'
import {useRouter} from 'vue-router'
import { User } from '../vuex'
import { reactive, ref, toRefs } from 'vue'
import { _getArea } from '../api/area'
import { useStore } from 'vuex'

export type Area = {
	id: number;
  acode: string;
  pcode: string;
  name: string;
  domain: string;
  is_default: string;
}

function getAreaFunc() {
	const store = useStore()
	let state = reactive({
		areas: [] as Area[],
		currentArea:''
	})

	const getArea = (update?:boolean) => {
		_getArea().then((areas:Area[]) => {
			state.areas = areas
			state.currentArea = areas.find(v => v.is_default === '1')?.acode as string
			if(update)	store.commit('setAcode',state.currentArea)
		}).catch(err=> ElMessage.error('获取区域失败'))
	}

	return {
		...toRefs(state),
		getArea
	}
}

export {
	getAreaFunc
}