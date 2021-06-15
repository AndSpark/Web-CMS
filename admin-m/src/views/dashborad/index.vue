<template>
	<el-row :gutter="20">
		<el-col :span="24" style="margin-bottom: 40px">
				<el-row type="flex" align="center" justify="space-between">
					<div>
						<h2>网站访问量数据统计</h2>
						<p>管理员您好，现在是 {{ now }}</p>
					</div>
					<div class="flex align-center">
						<el-card shadow="always">
							<div class="flex align-center">
								<div>
									<i class="el-icon-s-data icons"></i>
								</div>
								<div>
									<p>历史总访问量：</p>
									<p style="text-align: center">
										<b>{{ total }}</b>
									</p>
								</div>
							</div>
						</el-card>
					</div>
				</el-row>
		</el-col>
		<el-col :span="24" :offset="0">
			<el-row :gutter="20" type="flex" align="center" justify="space-between">
					<div class="flex">
						<h3 style="margin-left: 20px; margin-top: 5px">当前网站：</h3>
						<el-tag type="primary" style="margin-right:10px" v-for="site in currentStats" :key="site.site">{{site.name}}</el-tag>
					</div>
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						v-model:currentPage="currentPage"
						:page-sizes="[ 4, 8]"
						:page-size="pageSize"
						layout="total, prev, pager, next,sizes"
						:total="sites.length"
					>
					</el-pagination>
			</el-row>
			<div id="lineChart" style="width: 100%; height: 400px"></div>
		</el-col>
	</el-row>
</template>

<script lang="ts">
type Stats = {
	history: {
		date: string
		area: { [propName: string]: number }
	}[]
	total: number
	name: string
}

import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { site, _getSites, _getSiteStats } from '../../api/other'
export default defineComponent({
	name: 'index',
	setup() {
		const state = reactive({
			now: '',
			stats: [] as Stats[],
			sites: [] as site[],
			linexAxis: [] as string[],
			series: [] as any[],
			legend:[] as any,
			pieData: [] as { name: string; value: number }[],
			pieDataName: [] as string[],
			currentPage: 1,
			pageSize: 4,
			currentStats:[] as site[]
		})

		let lineChartDom: HTMLElement, lineChart: echarts.ECharts

		const getters = {
			total:computed(() => state.sites.reduce((p,c)=> {return p + c.visit},0))
		}

		const actions = {
			initChart() {
				lineChartDom = document.getElementById('lineChart') as HTMLElement
				lineChart = echarts.init(lineChartDom, 'light')
			},
			setCurrentStats(size:number){
				const arr: site[] = []
				state.sites.forEach((v, i) => {
					if (
						i >= (state.currentPage - 1) * size &&
						i < state.currentPage * size
					) {
						arr.push(v)
					}
				})
				state.currentStats = arr
			},
			setLineEcharts() {
				const option = {
					title: {
						text: '历史网站访问量',
					},
					xAxis: {
						data: state.linexAxis,
						boundaryGap: false,
						axisTick: {
							show: false,
						},
					},
					dataZoom: [
						{
							// 这个dataZoom组件，默认控制x轴。
							type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
							start: 80, // 左边在 10% 的位置。
							end: 100, // 右边在 60% 的位置。
						},
					],
					grid: {
						left: '3%',
						bottom: '12%',
						containLabel: true,
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
						},
						padding: [5, 10],
					},
					yAxis: {
						axisTick: {
							show: false,
						},
					},
					legend: {
						data:state.legend
					},
					series: state.series,
				}
				lineChart.setOption(option,{notMerge:true})
			},
			setLineData() {
				state.stats.sort(
					(a, b) => new Date(a.history[0].date).getTime() - new Date(b.history[0].date).getTime()
				)
				state.linexAxis = []
				state.series = []
				state.legend = []
				const start = new Date(state.stats[0].history[0].date).getTime()
				const now = new Date().getTime()
				let l = Math.ceil((now - start) / 1000 / 3600 / 24)
				if (l < 30) l = 30
				for (let i = 0; i < l; i++) {
					const day = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
					state.linexAxis.unshift(day)
				}
				state.stats.forEach((stats, i) => {
					const lineData = state.linexAxis.map(v => {
						let day = stats.history.find(x => v === x.date)
						let total = 0
						if (day) {
							total = Object.values(day.area).reduce((p, c) => {
								return p + c
							}, 0)
						}
						return total
					})
					state.series.push({
						name: stats.name,
						smooth: true,
						type: 'line',
						showSymbol: false,
						lineStyle: {
							width: 2,
						},
						data: lineData,
						animationDuration: 2800,
						animationEasing: 'quadraticOut',
					})
					state.legend.push(stats.name)
				})
				actions.setLineEcharts()
			},
			async getStats(sites: site[]) {
				state.stats = []
				await Promise.all(
					sites.map(async v => {
						const res = await _getSiteStats(v.site)
						state.stats.push({ ...res, name: v.name })
					})
				)
			},
			async getSites() {
				const res = await _getSites()
				state.sites = res
			},
			async init() {
				await actions.getSites()
				actions.setCurrentStats(state.pageSize)
				await actions.getStats(state.currentStats)
				actions.initChart()
				actions.setLineData()
			},
			async handleSiteChange() {
				await actions.getStats(state.currentStats)
				actions.setLineData()
			},
			async handleCurrentChange() {
				actions.setCurrentStats(state.pageSize)
				actions.handleSiteChange()
			},
			async handleSizeChange(size:number) {
				actions.setCurrentStats(size)
				actions.handleSiteChange()
			},
		}

		state.now = dayjs().format('YYYY年MM月DD日 HH时mm分ss秒')
		const timer = setInterval(() => {
			state.now = dayjs().format('YYYY年MM月DD日 HH时mm分ss秒')
		}, 1000)

		onMounted(() => {
			actions.init()

		})

		onUnmounted(() => {
			clearInterval(timer)
			lineChart.dispose()
		})

		return {
			...toRefs(state),
			...getters,
			...actions,
		}
	},
})
</script>

<style lang="scss" scoped>
.icons {
	font-size: 48px;
	color: #59d0cd;
	margin-right: 20px;
}
.flex {
	display: flex;
}
.align-center {
	align-items: center;
}
</style>
