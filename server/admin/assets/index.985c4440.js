var e=Object.defineProperty,t=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,l=(t,a,r)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r,s=(e,s)=>{for(var o in s||(s={}))a.call(s,o)&&l(e,o,s[o]);if(t)for(var o of t(s))r.call(s,o)&&l(e,o,s[o]);return e};import{a as o}from"./index.9c2b56da.js";import{d as n,e as m,t as i,A as p,f,r as d,o as u,c,a as b,C as g,l as y,k as M}from"./vendor.a308f217.js";var v=n({name:"Message",setup(){const e=m({msgList:[]}),t={getMsg(){o({url:"msg"}).then((t=>{e.msgList=t}))},formatTime:e=>p(e).format("YYYY-MM-DD HH:mm:ss"),deleteMsg(e){(function(e){return o({method:"delete",url:"msg",data:{id:e}})})(e).then((e=>{f.success("删除成功"),t.getMsg()}))}};return t.getMsg(),s(s({},i(e)),t)}});const _=M("删除");v.render=function(e,t,a,r,l,s){const o=d("el-table-column"),n=d("el-button"),m=d("el-popconfirm"),i=d("el-table");return u(),c("div",null,[b(i,{data:e.msgList,style:{width:"100%"}},{default:g((()=>[b(o,{prop:"name",label:"姓名"}),b(o,{prop:"email",label:"邮箱"}),b(o,{prop:"phone",label:"电话"}),b(o,{prop:"message",label:"留言"}),b(o,{prop:"create_time",label:"留言时间"},{default:g((({row:t})=>[b("p",null,y(e.formatTime(t.create_time)),1)])),_:1}),b(o,{label:"操作"},{default:g((({row:t})=>[b(m,{title:"确定删除吗？",onConfirm:a=>e.deleteMsg(t.id)},{reference:g((()=>[b(n,{type:"danger",size:"small"},{default:g((()=>[_])),_:1})])),_:2},1032,["onConfirm"])])),_:1})])),_:1},8,["data"])])};export default v;