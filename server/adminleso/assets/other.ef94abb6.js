import{a as t}from"./axios.8390ffce.js";let e="http://abc.le-so.cn:8082";function a(a){return t({baseURL:e,url:`/Sites/${a}/data/stats.json`})}function s(){return t({baseURL:e,url:"/Sites/sites.json"})}function u(e){return t({baseURL:"http://site.le-so.cn:8082",method:"POST",url:"/api/site/add",data:e})}function n(e){return t({method:"PUT",url:"/site/upload",data:{site:e}})}function r(e){return t({method:"POST",url:"/site/add",data:e})}function i(e){return t({method:"put",url:"/site/update",data:e})}function o(e){return t({method:"put",url:"/site/status",data:{site:e}})}function d(e){return t({method:"DELETE",url:"/site/delete",data:{site:e}})}export{a as _,s as a,d as b,i as c,o as d,u as e,n as f,r as g};
