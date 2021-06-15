import axios from './axios'

export type SlideForm = {
	id?: number;
	acode:string
	gid: number,
	pic: string,
	link: string,
	title: string
	subtitle: string
	sorting: number
}


function _getSlide(){
	return axios({ url:'slide'})
}

function _addSlide(data:SlideForm) {
	return axios({ url:'slide',method:'post',data})
}

function _deleteSlide(data: {id:number} |  {id:number}[]) {
	return axios({ url:'slide',method:'DELETE',data})
}


function _updateSlide(data: {
	findOption: {
		id:number
	},
	data:SlideForm
}) {
	return axios({ url:'slide',method:'PUT',data})
	
}

export {
	_getSlide,
	_addSlide,
	_deleteSlide,
	_updateSlide
}