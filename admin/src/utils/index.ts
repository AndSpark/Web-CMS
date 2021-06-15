const localGet = (key:string) => {
	const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(localStorage.getItem(key) as string)
  } catch (error) {
    return value
  } 
}

const localSet = (key: string, value: string) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const localRemove = (key: string) => {
  window.localStorage.removeItem(key)
}


// 将扁平化数组转换为树状数组， array为原数组，parentKey为 父级对象属性，childKey为 子对象属性，两者关系为 父级对象属性的值为子对象属性的值， 父级子数组的属性名为childArrKey，判断为顶级是childKey === topKeyValue

const formatTree = (array: any[],parentKey: string,topKeyValue: any,childKey: string, childArrKey: string) => {
	const arr:any[] = JSON.parse(JSON.stringify(array))
	const top: any[] = []
	let isTree = false
	const rest = arr.filter((v) => {
		if (v[childKey] && v[childKey] === topKeyValue) {
			top.push({
				...v,
				[childArrKey]:[]
			})
			isTree = true
			return false
		}
		return true
	})

	if (!isTree) {
		return array
	}

	format(rest,top,parentKey,childKey,childArrKey)

	top.forEach(v => {
		if (!v[childArrKey].length) {
			delete v[childArrKey]
		}
	})

	return top

	function format(rest: any[], parent: any[], parentKey: string, childKey: string, childArrKey: string) {
		
		let parent2:any[] = []
		rest = rest.filter((v) => {
			let remove = false
			parent.forEach(x => {
				if (x[parentKey] && x[parentKey] === v[childKey]) {
					remove = true
					if (!x[childArrKey]) {
						x[childArrKey] = []
						x[childArrKey].push(v)
					} else {
						x[childArrKey].push(v)
						parent2.push(v)
					}
				}

			})
			return !remove
		})
		if (rest.length) {

		format(rest,parent2,parentKey,childKey,childArrKey)
			
		}
		
	}
}

// 将对象及子数组扁平化
const formatFlat = (obj: any, childArrKey: string, isRemoveChildArrKey?: boolean) => {
	const obj2 = JSON.parse(JSON.stringify(obj))
	if (Array.isArray(obj2)) {
		return obj2.reduce((p,v) => {
			return p.concat(format(v,childArrKey,isRemoveChildArrKey))
		},[])
	} else {
		return format(obj,childArrKey,isRemoveChildArrKey)
	}

	function format(obj: any, childArrKey: string,isRemoveChildArrKey?:boolean) {
		const obj2 = JSON.parse(JSON.stringify(obj))
		if (obj2[childArrKey] && obj2[childArrKey].length) {
			const obj3 = JSON.parse(JSON.stringify(obj))
			if (isRemoveChildArrKey) {
				delete obj3[childArrKey]
			}
			return obj2[childArrKey].reduce((pre:any, cur:any) => {
				if (cur[childArrKey] && cur[childArrKey].length) {
					return pre.concat( formatFlat(cur,childArrKey,true) )
				} else {
					let cur2 = JSON.parse(JSON.stringify(cur))
					if (isRemoveChildArrKey) {
						delete cur2[childArrKey]
					}
					return pre.concat(cur2)
				}
			}, [obj3])
		}
		return obj2
	}

}


function htmlEncode(str:string) {
	var s = ''
	if (str.length == 0) return ''
	s = str.replace(/&/g, '&amp;')
	s = s.replace(/</g, '&lt;')
	s = s.replace(/>/g, '&gt;')
	// s = s.replace(/ /g, '&nbsp;')
	s = s.replace(/\'/g, '&#39;')
	s = s.replace(/\"/g, '&quot;')
	return s
}

function htmlDecode(str:string) {
	var s = ''
	if (!str || str.length == 0) return ''
	s = str.replace(/&amp;/g, '&')
	s = s.replace(/&lt;/g, '<')
	s = s.replace(/&gt;/g, '>')
	s = s.replace(/&nbsp;/g, ' ')
	s = s.replace(/&#39;/g, "'")
	s = s.replace(/&quot;/g, '"')
	return s
}

function produceCode(options: { txt: string }){
	var code="";
	var random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	
	for(var i=0;i<4;i++){
		var index=Math.floor(Math.random()*62);
		code+=random[index];
	}
	options.txt=code;
}

var options={
	canvasId:'mycanvas',
	width:200,
	height:50,
	txt:'' 
}
//产生随机数字
function randomNum(min: number,max: number){
	return Math.floor(Math.random()*(max-min)+min);
}
//产生随机颜色
function randomColor(min: number,max: number){
	var r=randomNum(min,max);
	var g=randomNum(min,max);
	var b=randomNum(min,max);
	return "rgb("+r+","+g+","+b+")";
}
//生产验证码背景
function code(options: { canvasId: string; width: number; height: number; txt: string }) {
	
	produceCode(options);
	var canvas=document.getElementById(options.canvasId) as any;
	canvas.width=options.width||300;//画布的宽
	canvas.height=options.height||150;//画布的高
	var ctx=canvas.getContext("2d");//创建一个canvas对象
	ctx.textBaseline="middle";
	ctx.fillStyle=randomColor(60,255);
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for(var i=0;i<options.txt.length;i++){
		var txt=options.txt.charAt(i);
		ctx.font='50px SimHei';
		ctx.fillStyle = randomColor(60, 180); /**随机生成字体颜色*/
		ctx.shadowOffsetY = randomNum(-3, 3);
		ctx.shadowBlur = randomNum(-3, 3);
		ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
		var x = options.width / (options.txt.length+1) * (i+1);
		var y = options.height / 2;
		var deg = randomNum(-30, 30);
		/**设置旋转角度和坐标原点*/
		ctx.translate(x, y);
		ctx.rotate(deg * Math.PI / 180);
		ctx.fillText(txt, 0, 0);
		/**恢复旋转角度和坐标原点*/
		ctx.rotate(-deg * Math.PI / 180);
		ctx.translate(-x, -y);
	}
	
	/**1~4条随机干扰线随机出现*/
	for (var i = 0; i < randomNum(1,4); i++) {
		ctx.strokeStyle = randomColor(40, 180);
		ctx.beginPath();
		ctx.moveTo(randomNum(0, options.width), randomNum(0, options.height));
		ctx.lineTo(randomNum(0, options.width), randomNum(0, options.height));
		ctx.stroke();
	}
	/**绘制干扰点*/
	for (var i = 0; i < options.width / 6; i++) {
		ctx.fillStyle = randomColor(0, 255);
		ctx.beginPath();
		ctx.arc(randomNum(0, options.width), randomNum(0, options.height), 1, 0, 2 * Math.PI);
		ctx.fill();
	}
}


export {
	localGet,
	localSet,
	localRemove,
	formatTree,
	formatFlat,
	htmlEncode,
	htmlDecode,
	code
}