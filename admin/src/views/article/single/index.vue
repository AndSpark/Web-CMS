<template>
	<div>
		<el-tabs tab-position="top" v-model="activeName" @tab-click="changeTab">
			<el-tab-pane label="单页内容" name="1">
				<search @search="search" :single="true"></search>
				<el-table :data="contentList" style="width: 100%">
					<el-table-column prop="id" label="ID"> </el-table-column>
					<el-table-column prop="lan" label="栏目"> </el-table-column>
					<el-table-column label="标题">
						<template #default="{ row }">
							{{ row.title }}
							<el-tag type="success" v-if="row.ico">略</el-tag>
							<el-tag type="warning" v-if="row.pics">图</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template #default="{ row }">
							<el-tag type="success" v-if="row.status === '1'">启用</el-tag>
							<el-tag type="warning" v-else>禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="success" size="small">
								<a
									:href="host + '/about/' + row.id + '.html'"
									style="color: white; text-decoration: none"
									target="_blank"
									>查看</a
								>
							</el-button>
							<el-button type="primary" size="small" @click="edit(row.id)">修改</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="修改内容" name="3" :disabled="!isEditContent">
				<edit :single="true" :id="editId" v-if="isEditContent" @posted="posted"></edit>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { content } from '../../../composables/content'
import Search from '../components/Search.vue'
import Edit from '../edit/index.vue'

export default defineComponent({
	name: 'index',
	components: {
		Search,
		Edit,
	},
	setup() {
		const { state, actions } = content()

		return {
			...toRefs(state),
			...actions,
		}
	},
})
</script>

<style lang="scss" scoped></style>
