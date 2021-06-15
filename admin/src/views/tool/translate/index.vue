<template>
	<div>
		<el-tabs tab-position="top" v-model="activeName">
			<el-row :gutter="20">
				<el-col :span="6" :offset="0">
					<el-tab-pane label="数据翻译" name="1">
						<el-form ref="form" label-width="100px">
							<el-form-item label="当前区域">
								<el-select v-model="transForm.fromAcode">
									<el-option
										v-for="item in areaList"
										:key="item.acode"
										:label="item.acode"
										:value="item.acode"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="目标区域">
								<el-select v-model="transForm.toAcode">
									<el-option
										v-for="item in areaList"
										:key="item.acode"
										:label="item.acode"
										:value="item.acode"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="当前语言">
								<el-select v-model="transForm.fromLang">
									<el-option
										v-for="item in langList"
										:key="item.value"
										:label="item.text"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="目标语言">
								<el-select v-model="transForm.toLang">
									<el-option
										v-for="item in langList"
										:key="item.value"
										:label="item.text"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="transDb">翻译数据</el-button>
							</el-form-item>
						</el-form>
					</el-tab-pane>
				</el-col>
				<el-col :span="18" :offset="0">
					<el-alert
						v-show="wsMsg"
						:title="wsMsg"
						type="success">
					</el-alert>
					<div style="height:300px;overflow:scroll">
						<el-alert
							:title="msg"
							type="warning"
							v-for="msg in wsMsgList"
							:key="msg"
							>
						</el-alert>
					</div>
				</el-col>
			</el-row>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { _getArea } from '../../../api/area'
import { _transDb } from '../../../api/other'
import langList from './languageList'
export default defineComponent({
	name: 'index',
	setup() {
		const state = reactive({
			activeName: '1',
			areaList: [],
			transForm: {
				fromAcode: '',
				toAcode: '',
				fromLang: '',
				toLang: '',
			},
			langList: langList,
			wsMsg:'',
			wsMsgList:[] as string[]
		})

		const actions = {
			async getArea() {
				state.areaList = await _getArea()
			},
			async transDb() {
				if (
					state.transForm.fromAcode &&
					state.transForm.toAcode &&
					state.transForm.fromLang &&
					state.transForm.toLang
				){
					await _transDb(state.transForm)
					const ws = new WebSocket(import.meta.env.VITE_WS_URL as string)
					ws.onmessage = (e) => {
						state.wsMsg = e.data
						state.wsMsgList.unshift(e.data)
					}
				}
				else {
					ElMessage.error('请选择区域语言')
				}
			},
		}

		actions.getArea()

		return {
			...toRefs(state),
			...actions,
		}
	},
})
</script>

<style lang="scss" scoped></style>
