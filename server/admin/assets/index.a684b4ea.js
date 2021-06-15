var e=Object.defineProperty,l=Object.getOwnPropertySymbols,d=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,i=(l,d,a)=>d in l?e(l,d,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[d]=a,t=(e,t)=>{for(var o in t||(t={}))d.call(t,o)&&i(e,o,t[o]);if(l)for(var o of l(t))a.call(t,o)&&i(e,o,t[o]);return e};import{d as o,u as r,e as s,t as n,f as u,r as m,o as p,c,a as f,C as V,l as b,F as g,j as k,k as y}from"./vendor.a308f217.js";import{a as _}from"./index.9c2b56da.js";import{_ as F}from"./index.5a424b2b.js";var h=o({name:"Slide",components:{Upload:F},setup(){const e=r(),l=s({slides:[],slideForm:{acode:e.state.acode,gid:1,pic:"",link:"",title:"",subtitle:"",sorting:255},originSlideForm:{},activeName:"1",isEditId:0,editOriginSlide:{}});l.originSlideForm=JSON.parse(JSON.stringify(l.slideForm));const d={getSlides(){_({url:"slide"}).then((e=>{l.slides=e})).catch((e=>u.error(e.message+"| 出错了，请过会几分钟再试")))},pics:e=>e.split(",").map((e=>({url:location.protocol+"//"+location.hostname+e,origin:e,show:!!e}))).filter((e=>e.show)),addSlide(){var e;(e=l.slideForm,_({url:"slide",method:"post",data:e})).then((e=>{u.success("添加成功"),l.activeName="1",l.slideForm=l.originSlideForm,d.getSlides()})).catch((e=>u.error(e.message+"| 出错了，请过会几分钟再试")))},deleteSlide(e){var l;(l={id:e},_({url:"slide",method:"DELETE",data:l})).then((e=>{u.success("删除完成"),d.getSlides()})).catch((e=>u.error(e.message+"| 出错了，请过会几分钟再试")))},reset(){l.slideForm=l.originSlideForm},edit(e){l.isEditId=e.id,l.editOriginSlide=JSON.parse(JSON.stringify(e))},update(e){var d;(d={findOption:{id:e.id},data:e},_({url:"slide",method:"PUT",data:d})).then((e=>{u.success("更新成功"),l.isEditId=0})).catch((e=>u.error(e.message+"| 出错了，请过会几分钟再试")))},cancel(){l.slides.forEach((e=>{e.id===l.isEditId&&Object.keys(e).forEach((d=>{e[d]=l.editOriginSlide[d]}))})),l.isEditId=0}};return d.getSlides(),t(t({},d),n(l))}});const S={key:1},U={key:1},w={key:1},E={key:1},v={key:1},O={key:1},C={key:0},I=y("修改"),j=y("删除"),N={key:1},x=y("完成"),z=y("取消"),J=y("立即提交"),P=y("重置");h.render=function(e,l,d,a,i,t){const o=m("el-input"),r=m("el-table-column"),s=m("upload"),n=m("el-image"),u=m("el-button"),y=m("el-popconfirm"),_=m("el-table"),F=m("el-tab-pane"),h=m("el-form-item"),T=m("el-form"),D=m("el-tabs");return p(),c("div",null,[f(D,{modelValue:e.activeName,"onUpdate:modelValue":l[7]||(l[7]=l=>e.activeName=l),"tab-position":"top"},{default:V((()=>[f(F,{label:"幻灯片列表",name:"1"},{default:V((()=>[f(_,{data:e.slides,style:{width:"100%"}},{default:V((()=>[f(r,{prop:"gid",label:"分组（gid）",width:"100"},{default:V((({row:l})=>[e.isEditId===l.id?(p(),c(o,{key:0,modelValue:l.gid,"onUpdate:modelValue":e=>l.gid=e},null,8,["modelValue","onUpdate:modelValue"])):(p(),c("p",S,"分组"+b(l.gid),1))])),_:1}),f(r,{prop:"pic",label:"图片",width:"300"},{default:V((({row:l})=>[e.isEditId===l.id?(p(),c(s,{key:0,modelValue:l.pic,"onUpdate:modelValue":e=>l.pic=e},null,8,["modelValue","onUpdate:modelValue"])):(p(),c("div",U,[(p(!0),c(g,null,k(e.pics(l.pic),(e=>(p(),c(n,{key:e.url,src:e.url},null,8,["src"])))),128))]))])),_:1}),f(r,{prop:"link",label:"链接"},{default:V((({row:l})=>[e.isEditId===l.id?(p(),c(o,{key:0,modelValue:l.link,"onUpdate:modelValue":e=>l.link=e},null,8,["modelValue","onUpdate:modelValue"])):(p(),c("p",w,b(l.link),1))])),_:1}),f(r,{prop:"title",label:"标题"},{default:V((({row:l})=>[e.isEditId===l.id?(p(),c(o,{key:0,modelValue:l.title,"onUpdate:modelValue":e=>l.title=e},null,8,["modelValue","onUpdate:modelValue"])):(p(),c("p",E,b(l.title),1))])),_:1}),f(r,{prop:"subtitle",label:"副标题"},{default:V((({row:l})=>[e.isEditId===l.id?(p(),c(o,{key:0,modelValue:l.subtitle,"onUpdate:modelValue":e=>l.subtitle=e},null,8,["modelValue","onUpdate:modelValue"])):(p(),c("p",v,b(l.subtitle),1))])),_:1}),f(r,{prop:"sorting",label:"排序",width:"80"},{default:V((({row:l})=>[e.isEditId===l.id?(p(),c(o,{key:0,modelValue:l.sorting,"onUpdate:modelValue":e=>l.sorting=e},null,8,["modelValue","onUpdate:modelValue"])):(p(),c("p",O,b(l.sorting),1))])),_:1}),f(r,{label:"操作"},{default:V((({row:l})=>[e.isEditId!==l.id?(p(),c("div",C,[f(u,{type:"primary",size:"small",onClick:d=>e.edit(l)},{default:V((()=>[I])),_:2},1032,["onClick"]),f(y,{title:"确定删除吗？",onConfirm:d=>e.deleteSlide(l.id)},{reference:V((()=>[f(u,{type:"danger",size:"small"},{default:V((()=>[j])),_:1})])),_:2},1032,["onConfirm"])])):(p(),c("div",N,[f(u,{type:"success",size:"small",onClick:d=>e.update(l)},{default:V((()=>[x])),_:2},1032,["onClick"]),f(u,{type:"warning",size:"small",onClick:e.cancel},{default:V((()=>[z])),_:1},8,["onClick"])]))])),_:1})])),_:1},8,["data"])])),_:1}),f(F,{label:"幻灯片新增",name:"2"},{default:V((()=>[f(T,{ref:"form",model:e.slideForm,"label-width":"120px"},{default:V((()=>[f(h,{label:"分组"},{default:V((()=>[f(o,{modelValue:e.slideForm.gid,"onUpdate:modelValue":l[1]||(l[1]=l=>e.slideForm.gid=l)},null,8,["modelValue"])])),_:1}),f(h,{label:"图片"},{default:V((()=>[f(s,{modelValue:e.slideForm.pic,"onUpdate:modelValue":l[2]||(l[2]=l=>e.slideForm.pic=l)},null,8,["modelValue"])])),_:1}),f(h,{label:"链接"},{default:V((()=>[f(o,{modelValue:e.slideForm.link,"onUpdate:modelValue":l[3]||(l[3]=l=>e.slideForm.link=l)},null,8,["modelValue"])])),_:1}),f(h,{label:"标题"},{default:V((()=>[f(o,{modelValue:e.slideForm.title,"onUpdate:modelValue":l[4]||(l[4]=l=>e.slideForm.title=l)},null,8,["modelValue"])])),_:1}),f(h,{label:"副标题"},{default:V((()=>[f(o,{modelValue:e.slideForm.subtitle,"onUpdate:modelValue":l[5]||(l[5]=l=>e.slideForm.subtitle=l)},null,8,["modelValue"])])),_:1}),f(h,{label:"排序"},{default:V((()=>[f(o,{modelValue:e.slideForm.sorting,"onUpdate:modelValue":l[6]||(l[6]=l=>e.slideForm.sorting=l)},null,8,["modelValue"])])),_:1}),f(h,null,{default:V((()=>[f(u,{type:"primary",onClick:e.addSlide},{default:V((()=>[J])),_:1},8,["onClick"]),f(u,{type:"warning",onClick:e.reset},{default:V((()=>[P])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"])])),_:1})])),_:1},8,["modelValue"])])};export default h;