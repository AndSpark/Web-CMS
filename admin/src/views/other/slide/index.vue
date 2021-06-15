<template>
	<div>
		<el-tabs v-model="activeName" tab-position="top">
			<el-tab-pane label="幻灯片列表" name="1">
				<el-table :data="slides" style="width: 100%">
					<el-table-column prop="gid" label="分组（gid）" width="100">
						<template #default="{ row }">
							<el-input v-model="row.gid" v-if="isEditId === row.id"></el-input>
							<p v-else>分组{{ row.gid }}</p>
						</template>
					</el-table-column>
					<el-table-column prop="pic" label="图片" width="300">
						<template #default="{ row }">
							<upload v-model="row.pic" v-if="isEditId === row.id"></upload>
							<div v-else>
								<el-image v-for="pic in pics(row.pic)" :key="pic.url" :src="pic.url" />
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="link" label="链接">
						<template #default="{ row }">
							<el-input v-model="row.link" v-if="isEditId === row.id"></el-input>
							<p v-else>{{ row.link }}</p>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="标题">
						<template #default="{ row }">
							<el-input v-model="row.title" v-if="isEditId === row.id"></el-input>
							<p v-else>{{ row.title }}</p>
						</template>
					</el-table-column>
					<el-table-column prop="subtitle" label="副标题">
						<template #default="{ row }">
							<el-input v-model="row.subtitle" v-if="isEditId === row.id"></el-input>
							<p v-else>{{ row.subtitle }}</p>
						</template>
					</el-table-column>
					<el-table-column prop="sorting" label="排序" width="80">
						<template #default="{ row }">
							<el-input v-model="row.sorting" v-if="isEditId === row.id"></el-input>
							<p v-else>{{ row.sorting }}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<div v-if="isEditId !== row.id">
								<el-button type="primary" size="small" @click="edit(row)">修改</el-button>

								<el-popconfirm title="确定删除吗？" @confirm="deleteSlide(row.id)">
									<template #reference>
										<el-button type="danger" size="small">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-else>
								<el-button type="success" size="small" @click="update(row)">完成</el-button>
								<el-button type="warning" size="small" @click="cancel">取消</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="幻灯片新增" name="2">
				<el-form ref="form" :model="slideForm" label-width="120px">
					<el-form-item label="分组">
						<el-input v-model="slideForm.gid"></el-input>
					</el-form-item>
					<el-form-item label="图片">
						<upload v-model="slideForm.pic"></upload>
					</el-form-item>
					<el-form-item label="链接">
						<el-input v-model="slideForm.link"></el-input>
					</el-form-item>
					<el-form-item label="标题">
						<el-input v-model="slideForm.title"></el-input>
					</el-form-item>
					<el-form-item label="副标题">
						<el-input v-model="slideForm.subtitle"></el-input>
					</el-form-item>
					<el-form-item label="排序">
						<el-input v-model="slideForm.sorting"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addSlide">立即提交</el-button>
						<el-button type="warning" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { SlideForm, _addSlide, _deleteSlide, _getSlide, _updateSlide } from '../../../api/slide'
import Upload from '../../../components/Upload/index.vue'
export default defineComponent({
	name: 'Slide',
	components: {
		Upload,
	},
	setup() {
		const store = useStore()
		const state = reactive({
			slides: [] as SlideForm[],
			slideForm: {
				acode: store.state.acode,
				gid: 1,
				pic: '',
				link: '',
				title: '',
				subtitle: '',
				sorting: 255,
			} as SlideForm,
			originSlideForm: {} as SlideForm,
			activeName: '1',
			isEditId: 0,
			editOriginSlide: {} as SlideForm,
		})
		state.originSlideForm = JSON.parse(JSON.stringify(state.slideForm))
		const actions = {
			getSlides() {
				_getSlide()
					.then(res => {
						state.slides = res
					})
					.catch(err => ElMessage.error(err.message + '| 出错了，请过会几分钟再试'))
			},
			pics(urls: string) {
				return urls
					.split(',')
					.map(v => {
						return {
							url: location.protocol + '//' + location.hostname + v,
							origin: v,
							show: v ? true : false,
						}
					})
					.filter(v => v.show)
			},
			addSlide() {
				_addSlide(state.slideForm)
					.then(res => {
						ElMessage.success('添加成功')
						state.activeName = '1'
						state.slideForm = state.originSlideForm
						actions.getSlides()
					})
					.catch(err => ElMessage.error(err.message + '| 出错了，请过会几分钟再试'))
			},
			deleteSlide(id: number) {
				_deleteSlide({ id })
					.then(res => {
						ElMessage.success('删除完成')
						actions.getSlides()
					})
					.catch(err => ElMessage.error(err.message + '| 出错了，请过会几分钟再试'))
			},
			reset() {
				state.slideForm = state.originSlideForm
			},
			edit(row: SlideForm) {
				state.isEditId = row.id as number
				state.editOriginSlide = JSON.parse(JSON.stringify(row))
			},
			update(slideForm: SlideForm) {
				_updateSlide({
					findOption: { id: slideForm.id as number },
					data: slideForm,
				})
					.then(res => {
						ElMessage.success('更新成功')
						state.isEditId = 0
					})
					.catch(err => ElMessage.error(err.message + '| 出错了，请过会几分钟再试'))
			},
			cancel() {
				state.slides.forEach(v => {
					if (v.id === state.isEditId) {
						Object.keys(v).forEach(x => {
							//@ts-ignore
							v[x] = state.editOriginSlide[x]
						})
					}
				})
				state.isEditId = 0
			},
		}

		actions.getSlides()

		return {
			...actions,
			...toRefs(state),
		}
	},
})
</script>

<style lang="scss" scoped></style>
