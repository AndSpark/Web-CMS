var e=Object.defineProperty,a=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable,r=(a,l,t)=>l in a?e(a,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[l]=t;import{d as o,e as s,f as n,t as d,p as i,i as m,r as u,o as c,c as p,a as b,F as f,j as h,k as y,l as v,w as V}from"./vendor.a308f217.js";import{a as F}from"./index.9c2b56da.js";var _=o({name:"Label",setup(){const e=s({activeName:"first",labels:[],labelForm:{name:"",type:"3",description:""},rules:{name:[{required:!0,message:"请输入标签名称",triger:"blur"},{validator(e,a,l){/[\w]+/.test(a)?l():l(new Error("只能含有字母、数字、下划线"))}}],type:{required:!0,message:"必须选择类型",triger:"change"}}});return F({url:"label"}).then((a=>{e.labels=a})).catch((e=>{n.error(e.message+"| 出错了，请过会儿再试（半分钟左右）")})),((e,o)=>{for(var s in o||(o={}))l.call(o,s)&&r(e,s,o[s]);if(a)for(var s of a(o))t.call(o,s)&&r(e,s,o[s]);return e})({},d(e))},methods:{addLabel(){this.$refs.form.validate((async e=>{if(!e)return!1;try{const e=await(a=this.labelForm.name,l=this.labelForm.type,t=this.labelForm.description,F({url:"label",method:"POST",data:{name:a,type:l,description:t}}));this.labels.push(e),n.success("添加成功"),this.activeName="first",this.labelForm.name="",this.labelForm.description=""}catch(r){n.error(r.message+"| 出错了，请过会儿再试（半分钟左右）")}var a,l,t}))},async deleteLabel(e){try{await function(e){return F({method:"DELETE",url:"label",data:{name:e}})}(e),n.success("删除成功"),this.labels=this.labels.filter((a=>a.name!==e))}catch(a){n.error(a.message+"| 出错了，请过会儿再试（半分钟左右）")}},async updateLabels(){try{await Promise.all(this.labels.map((async e=>{return await(a=e.name,l=e.value,F({method:"PUT",url:"label",data:{findOption:{name:a},data:{value:l}}}));var a,l}))),n.success("更新成功"),this.$router.replace(this.$route.path)}catch(e){n.error(e.message+"| 出错了，请过会儿再试（半分钟左右）")}}}});const g=V();i("data-v-2cf4ac8e");const w=y("立即提交"),k=y("提交");m();const L=g(((e,a,l,t,r,o)=>{const s=u("el-input"),n=u("el-button"),d=u("el-tab-pane"),i=u("el-form-item"),m=u("el-option"),V=u("el-select"),F=u("el-form"),_=u("el-tabs");return c(),p("div",null,[b(_,{modelValue:e.activeName,"onUpdate:modelValue":a[4]||(a[4]=a=>e.activeName=a),"tab-position":"top"},{default:g((()=>[b(d,{label:"标签管理",name:"first"},{default:g((()=>[(c(!0),p(f,null,h(e.labels,(a=>(c(),p("div",{class:"input-lan",key:a.id},[b(s,{modelValue:a.value,"onUpdate:modelValue":e=>a.value=e},{prepend:g((()=>[y(v(a.name),1)])),_:2},1032,["modelValue","onUpdate:modelValue"]),b(n,{type:"danger",icon:"el-icon-delete",onClick:l=>e.deleteLabel(a.name)},null,8,["onClick"])])))),128)),b(n,{type:"primary",style:{margin:"20px 0"},onClick:e.updateLabels},{default:g((()=>[w])),_:1},8,["onClick"])])),_:1}),b(d,{label:"新增标签",name:"thire"},{default:g((()=>[b(F,{ref:"form",model:e.labelForm,rules:e.rules,"label-width":"80px"},{default:g((()=>[b(i,{label:"标签名称",prop:"name"},{default:g((()=>[b(s,{modelValue:e.labelForm.name,"onUpdate:modelValue":a[1]||(a[1]=a=>e.labelForm.name=a)},null,8,["modelValue"])])),_:1}),b(i,{label:"标签描述"},{default:g((()=>[b(s,{modelValue:e.labelForm.description,"onUpdate:modelValue":a[2]||(a[2]=a=>e.labelForm.description=a)},null,8,["modelValue"])])),_:1}),b(i,{label:"标签描述",prop:"type"},{default:g((()=>[b(V,{modelValue:e.labelForm.type,"onUpdate:modelValue":a[3]||(a[3]=a=>e.labelForm.type=a),placeholder:"请选择"},{default:g((()=>[b(m,{label:"单行文本",value:"1"}),b(m,{label:"多行文本",value:"2"}),b(m,{label:"编辑器",value:"8"})])),_:1},8,["modelValue"])])),_:1}),b(i,null,{default:g((()=>[b(n,{type:"primary",onClick:e.addLabel},{default:g((()=>[k])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model","rules"])])),_:1})])),_:1},8,["modelValue"])])}));_.render=L,_.__scopeId="data-v-2cf4ac8e";export default _;
