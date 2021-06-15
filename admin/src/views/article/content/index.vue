<template>
	<div>
		<el-tabs tab-position="top" v-model="activeName" @tab-click="changeTab">
			<el-tab-pane label="内容列表" name="1">
				<search
					:single="false"
					@scode-change="scodeChange"
					@search="search"
				></search>
				<el-table
					:data="contentList"
					style="width: 100%"
					row-key="id"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="50"> </el-table-column>
					<el-table-column prop="id" label="ID" width="50"> </el-table-column>
					<el-table-column prop="lan" label="栏目" width="200"> </el-table-column>
					<el-table-column label="标题">
						<template #default="{ row }">
							{{ row.title }}
							<el-popover v-if="row.ico" placement="top-start" :width="200" trigger="hover">
								<template #reference>
									<el-tag type="success" size="mini">略</el-tag>
								</template>
								<el-image v-for="pic in pics(row.ico)" :key="pic.url" :src="pic.url" />
							</el-popover>

							<el-popover v-if="row.pics" placement="top-start" :width="300" trigger="hover">
								<template #reference>
									<el-tag type="warning" size="mini">图</el-tag>
								</template>
								<el-row :gutter="20">
									<el-col :span="8" :offset="0" v-for="pic in pics(row.pics)" :key="pic.url">
										<el-image :src="pic.url" />
									</el-col>
								</el-row>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="sorting" label="排序" width="80">
						<template #default="{ row }">
							<p v-if="!isEditSorting">{{ row.sorting }}</p>
							<el-input v-model="row.sorting" v-else @input="changeSorting(row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="80">
						<template #default="{ row }">
							<el-tag type="success" v-if="row.status === '1'">启用</el-tag>
							<el-tag type="warning" v-else>禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="220px">
						<template #default="{ row }">
							<el-button type="success" size="small">
								<a :href="host + '/list/'+ row.id + '.html'" style="color:white;text-decoration:none" target="_blank">查看</a>
							</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="deleteContent(row)">
								<template #reference>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
							<el-button type="primary" size="small" @click="edit(row.id)">修改</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row type="flex" justify="center" style="margin-top: 20px">
					<el-pagination
						layout="prev, pager, next"
						:total="count"
						:page-size="contentForm.take"
						v-model:current-page="currentPage"
						@current-change="pageChange"
					>
					</el-pagination>
				</el-row>

				<el-row type="flex" style="margin: 20px">
					<el-popconfirm title="确定删除吗？" @confirm="deleleList">
						<template #reference>
							<el-button type="danger">批量删除</el-button>
						</template>
					</el-popconfirm>
					<el-button type="primary" v-if="!isEditSorting" @click="isEditSorting = true"
						>修改排序</el-button
					>
					<div v-else style="margin-left: 16px">
						<el-button type="primary" @click="updateSorting">保存排序</el-button>
						<el-button type="primary" @click="cancelSorting">取消</el-button>
					</div>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="新增内容" name="2">
				<edit :single="false" :addMode="true" :key="$route.path" @posted="posted"></edit>
			</el-tab-pane>
			<el-tab-pane label="修改内容" name="3" :disabled="!isEditContent">
				<edit :single="false" :id="editId" v-if="isEditContent" @posted="posted" ></edit>
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

<style lang="scss" scoped>
:deep(.el-table td) {
	padding: 0;
}
</style>
