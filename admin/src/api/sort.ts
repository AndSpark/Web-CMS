import axios from './axios'

interface Sort {
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

interface SortWithId extends Sort {
	id:number
}
interface UpdateData {
		findOption: {
			id:number
		},
		data:SortWithId
}

function _getSortList(params?:{mcode?:string,acode?:string}){
	return axios({ url:'sort',params})
}

function _addSort(data:Sort | Sort[]) {
	return axios({ url:'sort',method:'POST',data})
}

function _deleteSort(data: {id:number} |  {id:number}[]) {
	return axios({ url:'sort',method:'DELETE',data})
}


function _updateSort(data: UpdateData | UpdateData[]) {
	return axios({url:'sort',method:'PUT',data})
}

export {
	_getSortList,
	_addSort,
	_deleteSort,
	_updateSort
}