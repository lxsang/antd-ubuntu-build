var api,onmessage,resolution,wasm_update;importScripts("wvnc_asm.js"),api={},resolution=void 0,Module.onRuntimeInitialized=function(){return api={createBuffer:Module.cwrap("create_buffer","number",["number","number"]),destroyBuffer:Module.cwrap("destroy_buffer","",["number"]),updateBuffer:Module.cwrap("update","number",["number","number","number","number","number","number"]),decodeBuffer:Module.cwrap("decode","number",["number","number","number","number"])}},wasm_update=function(e){var r,u,n,t,a,o,d,f,i,s,m;if(s=(r=new Uint8Array(e))[1]|r[2]<<8,m=r[3]|r[4]<<8,i=r[5]|r[6]<<8,t=r[7]|r[8]<<8,n=r[9],a=api.createBuffer(r.length),Module.HEAP8.set(r,a),d=i*t*4,o=api.decodeBuffer(a,r.length,resolution.depth,d),u=new Uint8Array(Module.HEAP8.buffer,o,d),e={},(f=new Uint8Array(d)).set(u,0),e.pixels=f.buffer,e.x=s,e.y=m,e.w=i,e.h=t,postMessage(e,[e.pixels]),api.destroyBuffer(a),0!==n||32!==resolution.depth)return api.destroyBuffer(o)},onmessage=function(e){return e.data.depth?resolution=e.data:wasm_update(e.data)};