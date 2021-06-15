<template>
	<div>
		<el-table :data="sites" style="width: 100%">
			<el-table-column prop="site" label="英文ID"> </el-table-column>
			<el-table-column prop="name" label="网站名称">
				<template #default="{ row }">
					<el-input v-model="siteForm.name" v-if="isEditSite && isEditSite === row.site"></el-input>
					<p v-else>{{ row.name }}</p>
				</template>
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间"></el-table-column>
			<el-table-column prop="hosts" label="域名" width="250">
				<template #default="{ row }">
					<el-input
						type="textarea"
						v-model="siteForm.hosts"
						v-if="isEditSite && isEditSite === row.site"
					></el-input>
					<div v-else>
						<p v-for="host in row.hosts" :key="host">
							<a :href="'http://' + host" target="_blank" style="color: #333">{{ host }}</a>
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态">
				<template #default="{ row }">
					<el-switch
						v-model="row.status"
						:active-value="1"
						:inactive-value="0"
						@click="changeStatus(row)"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column prop="visit" label="访问量"></el-table-column>
			<el-table-column label="操作" width="250">
				<template #default="{ row }">
					<div v-if="!isEditSite.length">
						<el-button type="success" size="small" @click="upload(row)" v-if="ISPRODUCT === '0'"
							>上传</el-button
						>
						<el-button type="primary" size="small" @click="updateSite(row)">修改</el-button>
						<el-popconfirm title="确定删除吗？" @confirm="deleteSite(row)">
							<template #reference>
								<el-button type="danger" size="small">删除</el-button>
							</template>
						</el-popconfirm>
					</div>
					<div v-else>
						<el-button type="success" size="small" @click="update">完成</el-button>
						<el-button type="warning" size="small" @click="cancel">取消</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog
			title="文件上传"
			v-model="dialogVisible"
			width="600px"
			:before-close="() => (dialogVisible = false)"
		>
			<div>
				<el-progress type="dashboard" :percentage="percentage"></el-progress>
				<el-alert :title="uploadMsg.txt" :closable="false" :type="uploadMsg.status"></el-alert>
				<el-collapse>
				<el-collapse-item title="历史信息" name="1">
					<el-alert
						v-for="msg in uploadMsgHistory"
						:key="msg.txt"
						:title="msg.txt"
						:type="msg.status"
						:closable="false"
					></el-alert>
				</el-collapse-item>
				</el-collapse>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import {
	_getSites,
	site,
	_deleteSite,
	_updateSite,
	_updatesiteStatus,
	_addServerSite,
	_uploadServerSite,
} from '../../api/other'
export default defineComponent({
	name: 'index',
	setup() {
		const state = reactive({
			sites: [] as site[],
			isEditSite: '',
			siteForm: {
				site: '',
				name: '',
				hosts: '',
			},
			siteStatus: '',
			ISPRODUCT: false as any,
			dialogVisible: false,
			percentage: 0,
			uploadMsg: {} as {
				txt: string
				status: string
			},
			uploadMsgHistory: [] as {
				txt: string
				status: string
			}[],
		})

		state.ISPRODUCT = import.meta.env.VITE_IS_PRODUCT
		const actions = {
			async getSites() {
				state.sites = await _getSites()
			},
			async deleteSite(site: site) {
				try {
					await _deleteSite(site.site)
					ElMessage.success('删除成功')
					actions.getSites()
				} catch (error) {
					ElMessage.error(error.message)
				}
			},
			async updateSite(row: site) {
				state.siteForm.site = row.site
				state.siteForm.name = row.name
				state.siteForm.hosts = row.hosts.join(',')
				state.isEditSite = row.site
			},
			async update() {
				state.siteForm.hosts = state.siteForm.hosts.replace(/\s/g, ',').replace(/,+/, ',')
				try {
					await _updateSite(state.siteForm)
					ElMessage.success('修改成功')
				} catch (error) {
					ElMessage.error(error.message)
				}
				state.isEditSite = ''
				actions.getSites()
			},
			async changeStatus(row: site) {
				try {
					await _updatesiteStatus(row.site)
					ElMessage.success('修改成功')
				} catch (error) {
					ElMessage.error(error.message)
				}
			},
			async upload(site: site) {
				try {
					state.dialogVisible = true
					actions.addMsg({
						txt: '开始创建更新站点文件夹',
						status: 'success',
					})
					await _addServerSite({
						name: site.name,
						site: site.site,
						hosts: site.hosts.join(','),
						isRemote: true,
					})
					actions.addMsg({
						txt: '站点文件夹创建更新完毕,准备请求上传',
						status: 'success',
					})
					await _uploadServerSite(site.site)
					actions.addMsg({
						txt: '请求完毕，开始上传',
						status: 'success',
					})
					const socket = new WebSocket(import.meta.env.VITE_WS_URL as string)

					socket.onmessage = e => {
						const data = JSON.parse(e.data)
						if (data.status === 'uploading') {
							actions.addMsg({
								txt: `开始上传${data.filename}，当前为第${data.transferredFileCount}个，总共${data.totalFilesCount}个`,
								status: 'warning',
							})
						}
						if (data.status === 'uploaded') {
							actions.addMsg({
								txt: `${data.filename}上传完毕，当前为第${data.transferredFileCount}个，总共${data.totalFilesCount}个`,
								status: 'success',
							})
							state.percentage = Number(((data.transferredFileCount / data.totalFilesCount) * 100).toFixed(2))
						}
						if (data.status === 'error') {
							actions.addMsg({
								txt: `${data.filename}上传失败，当前为第${data.transferredFileCount}个，总共${data.totalFilesCount}个`,
								status: 'error',
							})
						}
						if(data.status === 'success'){
							actions.addMsg({
								txt:'网站上传完毕',
								status:'success'
							})
						}
					}
				} catch (error) {}
			},
			cancel() {
				state.siteForm = {
					site: '',
					name: '',
					hosts: '',
				}
				state.isEditSite = ''
			},
			addMsg(msg: { txt: string; status: string }) {
				state.uploadMsg = msg
				state.uploadMsgHistory.unshift(msg)
			},
		}

		actions.getSites()

		return {
			...toRefs(state),
			...actions,
		}
	},
})
</script>

<style lang="scss" scoped>

.el-collapse-item__content:deep {
	height: 300px;
	overflow: scroll;
}
</style>
