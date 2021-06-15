<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="batch ? 24 : 10" :offset="0">
				<h3>基本选项</h3>
				<el-divider></el-divider>
				<el-form ref="form" :rules="rules" :model="formSort" label-width="100px">
					<el-form-item label="父栏目" prop="pcode">
						<el-cascader
							:options="formatTree"
							v-model="formSort.pcode"
							:show-all-levels="false"
							:props="{
								expandTrigger: 'hover',
								checkStrictly: true,
								value: 'scode',
								label: 'name',
								emitPath: false,
							}"
						>
						</el-cascader>
					</el-form-item>
					<el-form-item label="栏目名称" :prop="batch ? '': 'name'">
						<el-input v-if="!batch" v-model="formSort.name"></el-input>
						<div v-else>
							<el-tag
								:key="name"
								v-for="name in batchName"
								closable
								:disable-transitions="false"
								@close="handleClose(name)"
							>
								{{ name }}
							</el-tag>
							<el-input
								class="input-new-tag"
								v-if="inputVisible"
								v-model="inputValue"
								ref="saveTagInput"
								size="small"
								@keyup.enter="handleInputConfirm"
								@blur="handleInputConfirm"
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput"
								>+ 新栏目</el-button
							>
						</div>
					</el-form-item>

					<el-form-item v-if="!batch" label="栏目副名称">
						<el-input v-model="formSort.subname"></el-input>
					</el-form-item>
					<el-form-item label="内容模型" prop="mcode">
						<el-select v-model="formSort.mcode" @change="changeMcode">
							<el-option
								v-for="model in models"
								:key="model.id"
								:label="model.name"
								:value="model.mcode"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="列表页模板" prop="listtpl">
						<el-input v-model="formSort.listtpl"></el-input>
					</el-form-item>
					<el-form-item label="内容页模板" prop="contenttpl">
						<el-input v-model="formSort.contenttpl"></el-input>
					</el-form-item>
					<el-form-item label="状态">
						<el-radio-group v-model="formSort.status">
							<el-radio label="1">显示</el-radio>
							<el-radio label="0">隐藏</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col v-if="!batch" :span="14" :offset="0">
				<h3>高级选项</h3>
				<el-divider></el-divider>
				<el-form ref="form2" :model="formSort" label-width="100px">
					<el-form-item label="自定义路径名">
						<el-select v-model="formSort.filename" >
							<el-option
								v-for="item in options"
								:key="item"
								:label="item"
								:value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="跳转链接">
						<el-input v-model="formSort.outlink"></el-input>
					</el-form-item>
					<el-form-item label="栏目略缩图">
						<upload v-model="formSort.ico"></upload>
					</el-form-item>
					<el-form-item label="栏目大图">
						<upload v-model="formSort.pic"></upload>
					</el-form-item>
					<el-form-item label="SEO标题">
						<el-input v-model="formSort.title"></el-input>
					</el-form-item>
					<el-form-item label="SEO关键字">
						<el-input v-model="formSort.keywords"></el-input>
					</el-form-item>
					<el-form-item label="SEO描述">
						<el-input type="textarea" v-model="formSort.description"></el-input>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-button type="primary" @click="addOrUpdateSort">立即提交</el-button>
		<el-button type="warning" v-if="update" @click="reset">重置</el-button>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { _getModels } from '../../../../api/model'
import { _addSort, _updateSort } from '../../../../api/sort'
import { SortTree } from '../index.vue'
import Upload from '../../../../components/Upload/index.vue'
interface FormSort {
	id: number
	acode: string
	mcode: string
	pcode: string
	scode: string
	name: string
	listtpl: string
	contenttpl: string
	status: string
	outlink: string
	subname: string
	ico: string
	pic: string
	title: string
	keywords: string
	description: string
	filename: string
	sorting: number
}


export default defineComponent({
	name: 'sortDetail',
	props: {
		sortTree: {
			type: Array as unknown as PropType<SortTree>,
			default:()=>[],
		},
		addScode: {
			type: String,
			default: '',
		},
		models: {
			type: Array as unknown as PropType<any[]>,
			default:()=>[],
		},
		update: {
			type: Boolean,
			default: false,
		},
		batch: {
			type: Boolean,
			default: false,
		},
	},
	components:{
		Upload
	},
	setup(props) {

		const {batch} = toRefs(props)
		const store = useStore()
		const state = reactive({
			formSort: {
				acode: store.state.acode,
				mcode: '',
				pcode: '',
				scode: '',
				name: '',
				listtpl: '',
				contenttpl: '',
				status: '1',
				outlink: '',
				subname: '',
				ico: '',
				pic: '',
				title: '',
				keywords: '',
				description: '',
				filename: '',
				sorting: 255,
			} as FormSort,
			emptySort: {} as FormSort,
			rules: {
				pcode: [
					{
						required: true,
						message: '请选择父栏目',
						trigger: 'change',
					},
				],
				name: [
					{
						required: true,
						message: '请输入模型名称',
						trigger: 'blur',
					},
				],
				mcode: [
					{
						required: true,
						message: '请选择模型类型',
						trigger: 'change',
					},
				],
				listtpl: [
					{
						required: true,
						message: '请输入列表页模板',
						trigger: 'blur',
					},
				],
				contenttpl: [
					{
						required: true,
						message: '请输入内容页模板',
						trigger: 'blur',
					},
				],
			},
			originFormSort: {} as FormSort,
			batchName:[] as string[],
			inputVisible: false,
      inputValue: '',
			options:[
				'product',
				'download',
				'news',
				'honor',
				'plant',
				'contact',
				'culture',
				'company',
				'about',
				'message',
				''
			]
		})

		state.emptySort = JSON.parse(JSON.stringify(state.formSort))
		if(batch){

		}
		watch(
			() => store.state.acode,
			(n, o) => {
				state.formSort.acode = n
			}
		)

		return {
			...toRefs(state),
		}
	},
	computed: {
		formatTree() {
			const sortTree = JSON.parse(JSON.stringify(this.sortTree))
			sortTree.unshift({
				name: '顶级栏目',
				scode: '0',
			})
			return sortTree
		},
	},
	methods: {
		changeMcode(mcode: string) {
			const model = this.models.find(v => v.mcode == mcode)
			this.formSort.contenttpl = model.contenttpl
			this.formSort.listtpl = model.listtpl
		},
		addOrUpdateSort() {
			//@ts-ignore
			this.$refs.form.validate(vali => {
				if (!vali) {
					return
				}
				if (this.update) {
					_updateSort({
						findOption: {
							id: this.formSort.id,
						},
						data: this.formSort,
					})
						.then(sort => {
							ElMessage.success('更新成功')
							this.$emit('update-sort')
						})
						.catch(err => {
							ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
						})
				} else {
					let formSort;
					if(this.batch){
						formSort = this.batchName.map((v,i) => {
							return {
								...this.formSort,
								name:v,
								scode:(parseInt(this.addScode) + i).toString()
							}
						})
					}else {
						this.formSort.scode = this.addScode
						formSort = this.formSort
					}
					
					_addSort(formSort)
						.then(sort => {
							ElMessage.success('添加成功')
							this.formSort = JSON.parse(JSON.stringify(this.emptySort))
							this.$emit('update-sort')
						})
						.catch(err => {
							ElMessage.error(err.message + '| 出错了，请过会儿再试（半分钟左右）')
						})

				}
			})
		},
		reset() {
			this.formSort = JSON.parse(JSON.stringify(this.originFormSort))
		},
		handleInputConfirm(){
			let inputValue = this.inputValue;
			if (inputValue) {
				this.batchName.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
					//@ts-ignore
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
			 handleClose(name:string) {
        this.batchName.splice(this.batchName.indexOf(name), 1);
      },
	},
})
</script>

<style lang="scss" scoped>
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
