var e=Object.defineProperty,a=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable,o=(a,l,t)=>l in a?e(a,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[l]=t,r=(e,r)=>{for(var u in r||(r={}))l.call(r,u)&&o(e,u,r[u]);if(a)for(var u of a(r))t.call(r,u)&&o(e,u,r[u]);return e};import{d as u,e as s,t as n,f as d,r as m,o as v,c as f,a as i,C as c,F as p,j as b,x,y as g,k as y}from"./vendor.a308f217.js";import{o as w,p as L}from"./index.9c2b56da.js";var _=[{text:"中文",value:"zh"},{text:"英语",value:"en"},{text:"日语",value:"jp"},{text:"韩语",value:"kor"},{text:"法语",value:"fra"},{text:"西班牙语",value:"spa"},{text:"泰语",value:"th"},{text:"阿拉伯语",value:"ara"},{text:"俄语",value:"ru"},{text:"德语",value:"de"},{text:"意大利语",value:"it"},{text:"希腊语",value:"el"},{text:"荷兰语",value:"nl"},{text:"波兰语",value:"pl"},{text:"保加利亚语",value:"bul"},{text:"爱沙尼亚语",value:"est"},{text:"丹麦语",value:"dan"},{text:"芬兰语",value:"fin"},{text:"捷克语\t",value:"cs"},{text:"罗马尼亚语",value:"rom"},{text:"斯洛文尼亚语",value:"slo"},{text:"瑞典语",value:"swe"},{text:"匈牙利语",value:"hu"},{text:"繁体中文",value:"cht"},{text:"越南语",value:"vie"}],F=u({name:"index",setup(){const e=s({activeName:"1",areaList:[],transForm:{fromAcode:"",toAcode:"",fromLang:"",toLang:""},langList:_,wsMsg:"",wsMsgList:[]}),a={async getArea(){e.areaList=await w()},async transDb(){if(e.transForm.fromAcode&&e.transForm.toAcode&&e.transForm.fromLang&&e.transForm.toLang){await L(e.transForm);new WebSocket("ws://abc.le-so.cn:8085").onmessage=a=>{e.wsMsg=a.data,e.wsMsgList.unshift(a.data)}}else d.error("请选择区域语言")}};return a.getArea(),r(r({},n(e)),a)}});const V=y("翻译数据"),k={style:{height:"300px",overflow:"scroll"}};F.render=function(e,a,l,t,o,r){const u=m("el-option"),s=m("el-select"),n=m("el-form-item"),d=m("el-button"),y=m("el-form"),w=m("el-tab-pane"),L=m("el-col"),_=m("el-alert"),F=m("el-row"),A=m("el-tabs");return v(),f("div",null,[i(A,{"tab-position":"top",modelValue:e.activeName,"onUpdate:modelValue":a[5]||(a[5]=a=>e.activeName=a)},{default:c((()=>[i(F,{gutter:20},{default:c((()=>[i(L,{span:6,offset:0},{default:c((()=>[i(w,{label:"数据翻译",name:"1"},{default:c((()=>[i(y,{ref:"form","label-width":"100px"},{default:c((()=>[i(n,{label:"当前区域"},{default:c((()=>[i(s,{modelValue:e.transForm.fromAcode,"onUpdate:modelValue":a[1]||(a[1]=a=>e.transForm.fromAcode=a)},{default:c((()=>[(v(!0),f(p,null,b(e.areaList,(e=>(v(),f(u,{key:e.acode,label:e.acode,value:e.acode},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])),_:1}),i(n,{label:"目标区域"},{default:c((()=>[i(s,{modelValue:e.transForm.toAcode,"onUpdate:modelValue":a[2]||(a[2]=a=>e.transForm.toAcode=a)},{default:c((()=>[(v(!0),f(p,null,b(e.areaList,(e=>(v(),f(u,{key:e.acode,label:e.acode,value:e.acode},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])),_:1}),i(n,{label:"当前语言"},{default:c((()=>[i(s,{modelValue:e.transForm.fromLang,"onUpdate:modelValue":a[3]||(a[3]=a=>e.transForm.fromLang=a)},{default:c((()=>[(v(!0),f(p,null,b(e.langList,(e=>(v(),f(u,{key:e.value,label:e.text,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])),_:1}),i(n,{label:"目标语言"},{default:c((()=>[i(s,{modelValue:e.transForm.toLang,"onUpdate:modelValue":a[4]||(a[4]=a=>e.transForm.toLang=a)},{default:c((()=>[(v(!0),f(p,null,b(e.langList,(e=>(v(),f(u,{key:e.value,label:e.text,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])),_:1}),i(n,null,{default:c((()=>[i(d,{type:"primary",onClick:e.transDb},{default:c((()=>[V])),_:1},8,["onClick"])])),_:1})])),_:1},512)])),_:1})])),_:1}),i(L,{span:18,offset:0},{default:c((()=>[x(i(_,{title:e.wsMsg,type:"success"},null,8,["title"]),[[g,e.wsMsg]]),i("div",k,[(v(!0),f(p,null,b(e.wsMsgList,(e=>(v(),f(_,{title:e,type:"warning",key:e},null,8,["title"])))),128))])])),_:1})])),_:1})])),_:1},8,["modelValue"])])};export default F;
