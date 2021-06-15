<template>
	<div>
		<el-table :data="msgList" style="width: 100%">
			<el-table-column prop="name" label="姓名"> </el-table-column>
			<el-table-column prop="email" label="邮箱" > </el-table-column>
			<el-table-column prop="phone" label="电话" > </el-table-column>
			<el-table-column prop="message" label="留言" > </el-table-column>
			<el-table-column prop="create_time" label="留言时间" >
				<template #default="{ row }">
					<p>{{formatTime(row.create_time)}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作">
						<template #default="{ row }">
							<el-popconfirm title="确定删除吗？" @confirm="deleteMsg(row.id)">
								<template #reference>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { _deleteMsg, _getMsg } from '../../../api/msg'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
export default defineComponent({
	name: 'Message',
	setup() {
		const state = reactive({
			msgList: [],
		})

		const actions = {
			getMsg() {
				_getMsg().then(res => {
					state.msgList = res
				})
			},
			formatTime(time:string){
				return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
			},
			deleteMsg(id:number){
				_deleteMsg(id).then(res => {
					ElMessage.success('删除成功')
					actions.getMsg()
				})
			}
		}

		actions.getMsg()

		return {
			...toRefs(state),
			...actions,
		}
	},
})
</script>

<style lang="scss" scoped></style>
