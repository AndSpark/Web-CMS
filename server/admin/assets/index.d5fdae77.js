var e=Object.defineProperty,a=Object.defineProperties,o=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,d=(a,o,t)=>o in a?e(a,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[o]=t,n=(e,a)=>{for(var o in a||(a={}))r.call(a,o)&&d(e,o,a[o]);if(t)for(var o of t(a))l.call(a,o)&&d(e,o,a[o]);return e},s=(e,t)=>a(e,o(t));import{d as p,u as i,e as c,v as u,t as f,f as b,p as h,i as m,r as g,H as y,x as O,o as v,c as j,a as w,w as _,k as S}from"./vendor.a308f217.js";import{l as x}from"./index.9c2b56da.js";var P=p({name:"index",setup(){const e=i(),a=c({uploadUrl:"http://abc.le-so.cn:8082/api/upload/batch",data:{info:{acode:e.state.acode,pcode:""}},uploading:!1}),o=u((()=>({info:JSON.stringify(a.data.info)}))),t=u((()=>{let e=x("token")||"";if(e)return{Authorization:e}})),r={onSuccess(){b.success("上传完成"),a.uploading=!1},handleError(){b.error("上传失败"),a.uploading=!1},handleBeforeUpload(){a.uploading=!0}};return s(n(s(n({},f(a)),{headers:t}),r),{dataJSON:o})}});const U=_();h("data-v-41774fb1");const z={"element-loading-text":"拼命上传中"},E=S("点击上传");m();const J=U(((e,a,o,t,r,l)=>{const d=g("el-alert"),n=g("el-divider"),s=g("el-input"),p=g("el-col"),i=g("el-button"),c=g("el-upload"),u=g("el-row"),f=y("loading");return O((v(),j("div",z,[w(d,{title:"1. 图片命名为产品名称  2.图片放到产品分类目录下面  3.产品目录放到product文件夹下面  4.将product文件夹压缩后上传",type:"warning"}),w(n),w(u,{gutter:20},{default:U((()=>[w(p,{span:12,offset:0},{default:U((()=>[w(s,{modelValue:e.data.info.pcode,"onUpdate:modelValue":a[1]||(a[1]=a=>e.data.info.pcode=a),placeholder:"请输入产品栏目编码"},null,8,["modelValue"])])),_:1}),w(p,{span:12,offset:0},{default:U((()=>[w(c,{headers:e.headers,action:e.uploadUrl,"on-success":e.onSuccess,"on-error":e.handleError,"show-file-list":!1,"before-upload":e.handleBeforeUpload,data:e.dataJSON,accept:".zip"},{default:U((()=>[w(i,{size:"small",type:"primary"},{default:U((()=>[E])),_:1})])),_:1},8,["headers","action","on-success","on-error","before-upload","data"])])),_:1})])),_:1})],512)),[[f,e.uploading]])}));P.render=J,P.__scopeId="data-v-41774fb1";export default P;