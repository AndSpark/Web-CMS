<template>
	<el-row :gutter="20">
		<el-col :span="24" style="margin-bottom: 40px;padding-left:30px">
			<el-row type="flex" align="center" justify="space-between">
				<div>
					<h2>网站访问量数据统计</h2>
					<p>管理员您好，现在是 {{ now }}</p>
				</div>
				<div class="flex align-center">
					<el-card shadow="always" style="margin-right: 20px">
						<div class="flex align-center">
							<div>
								<i class="el-icon-user-solid icons"></i>
							</div>
							<div>
								<p>今日访问新增：</p>
								<p style="text-align: center">
									<b>{{todayCount}}</b>
								</p>
							</div>
						</div>
					</el-card>
					<el-card shadow="always">
						<div class="flex align-center">
							<div>
								<i class="el-icon-s-data icons"></i>
							</div>
							<div>
								<p>历史总访问量：</p>
								<p style="text-align: center">
									<b>{{ stats.total }}</b>
								</p>
							</div>
						</div>
					</el-card>
				</div>
			</el-row>
		</el-col>
		<el-col :span="12" :offset="0">
			<div id="lineChart" style="width: 100%; height: 400px"></div>
		</el-col>
		<el-col :span="12" :offset="0">
			<div id="pieChart" style="width: 100%; height: 400px"></div>
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
}

import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { _getSiteStats } from '../../api/other'

export default defineComponent({
	name: 'index',
	setup() {
		const state = reactive({
			now: '',
			stats: {} as Stats,
			linexAxis: [] as string[],
			lineData: [] as number[],
			pieData: [] as { name: string; value: number }[],
			pieDataName: [] as string[],
		})

		const getters = {
			todayCount:computed(() => JSON.parse(JSON.stringify(state.lineData)).reverse()[0])
		}

		const actions = {
			initLineEcharts() {
				let lineChart = document.getElementById('lineChart') as HTMLElement
				let chart = echarts.init(lineChart, 'light')
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
						data: ['访问量'],
					},
					series: [
						{
							name: '访问量',
							smooth: true,
							type: 'line',
							showSymbol: false,
							lineStyle: {
								color: '#3888fa',
								width: 2,
							},
							areaStyle: {
								color: '#f3f8ff',
							},
							data: state.lineData,
							animationDuration: 2800,
							animationEasing: 'quadraticOut',
						},
					],
				}
				chart.setOption(option)
			},
			initPieEcharts() {
				let dom = document.getElementById('pieChart') as HTMLElement
				let chart = echarts.init(dom, 'light')
				const option = {
					title: {
						text: '主要访问区域分布',
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)',
					},
					legend: {
						left: 'center',
						bottom: '10',
						data: state.pieDataName,
					},
					series: [
						{
							name: '近一个月该区域访问量',
							type: 'pie',
							roseType: 'radius',
							radius: [15, 95],
							center: ['50%', '38%'],
							data: state.pieData,
							animationEasing: 'cubicInOut',
							animationDuration: 2600,
						},
					],
				}
				chart.setOption(option)
			},
			setData() {
				const start = new Date(state.stats.history[0].date).getTime()
				const now = new Date().getTime()
				let l = Math.ceil((now - start) / 1000 / 3600 / 24)
				if(l < 30) l = 30
				for (let i = 0; i < l; i++) {
					const day = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
					state.linexAxis.unshift(day)
				}
				state.lineData = state.linexAxis.map(v => {
					let day = state.stats.history.find(x => v === x.date)
					let total = 0
					if (day) {
						total = Object.values(day.area).reduce((p, c) => {
							return p + c
						}, 0)
					}
					return total
				})
				state.pieData = state.stats.history
					.reduce((p: { name: string; value: number }[], c) => {
						Object.keys(c.area).forEach(k => {
							let area = p.find(v => v.name === k)
							if (area) {
								area.value += c.area[k]
							} else {
								area = {
									name: k,
									value: c.area[k],
								}
								p.push(area)
								state.pieDataName.push(k)
							}
						})
						return p
					}, [])
					.sort((a, b) => b.value - a.value)
				if (state.pieData.length > 5) {
					
					let otherIndex = state.pieData.findIndex(v => v.name === '其他')
					let otherCount = 0
					if (otherIndex !== -1) {
						otherCount = state.pieData[otherIndex].value
						state.pieData.splice(otherIndex, 1)
					}

					let otherValue = state.pieData.reduce((p, c, i) => {
						if (i >= 5) {
							return p + c.value
						}
						return p
					}, otherCount)

					state.pieData = state.pieData.splice(0, 5)
					state.pieData.push({
						name: '其他',
						value: otherValue,
					})
				}
				state.pieDataName = state.pieData.map(v => v.name)
			},
			async getStats() {
				const res = await _getSiteStats()
				state.stats = res
			},
			async init() {
				await actions.getStats()
				actions.setData()
				actions.initLineEcharts()
				actions.initPieEcharts()
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
