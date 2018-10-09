(function(){var t,e={}.hasOwnProperty;t=function(t){function i(t){i.__super__.constructor.call(this,"Files",t)}return function(t,i){for(var r in i)e.call(i,r)&&(t[r]=i[r]);function n(){this.constructor=t}n.prototype=i.prototype,t.prototype=new n,t.__super__=i.prototype}(i,t),i.prototype.main=function(){var t,e,i,r,n;for(r=this,this.scheme.set("apptitle","Files manager"),this.view=this.find("fileview"),this.navinput=this.find("navinput"),this.navbar=this.find("nav-bar"),this.currdir=this.args&&this.args.length>0?this.args[0].asFileHandler():"home://".asFileHandler(),this.favo=this.find("favouri"),this.clipboard=void 0,this.viewType=this._api.switcher("icon","list","tree"),this.viewType.list=!0,this.apps=[],this.view.contextmenuHandler=function(t,e){return e.set("items",[r.mnFile(),r.mnEdit()]),e.set("onmenuselect",function(t){if(t.item.data.app)return r._gui.launch(t.item.data.app,t.item.data.args)}),e.show(t)},this.view.set("onfileopen",function(t){if(t&&"dir"!==t.type)return r._gui.openWith(t)}),this.favo.set("onlistselect",function(t){return r.chdir(t.data.path)}),$(this.find("btback")).click(function(){var t;if(!r.currdir.isRoot())return t=r.currdir.parent(),r.favo.set("selected",-1),r.chdir(t)}),$(this.navinput).keyup(function(t){if(13===t.keyCode)return r.chdir($(r.navinput).val())}),this.view.set("chdir",function(t){return r.chdir(t)}),this.view.set("fetch",function(t,e){if(t.child&&"[..]"!==t.child.filename)return t.child.path.asFileHandler().read(function(i){return i.error?r.error(__("Resource not found {0}",t.child.path)):e(i.result)})}),this.view.set("onfileselect",function(t){var e,i,n,a,s,o;if((e=r.view.get("selectedFile"))&&e.mime){for("dir"===e.type&&(e.mime="dir"),r.apps.length=0,s=[],i=0,n=(a=r._gui.appsByMime(e.mime)).length;i<n;i++)(o=a[i]).args=[e.path],s.push(r.apps.push(o));return s}}),void 0===this.setting.sidebar&&(this.setting.sidebar=!0),void 0===this.setting.nav&&(this.setting.nav=!0),void 0===this.setting.showhidden&&(this.setting.showhidden=!1),this.applyAllSetting(),t=e=0,i=(n=this.systemsetting.VFS.mountpoints).length;e<i;t=++e)n[t].selected=!1;return this.favo.set("items",n),this.setting.view&&this.view.set("view",this.setting.view),this.subscribe("VFS",function(t){if(t.data.file.hash()===r.currdir.hash()||t.data.file.parent().hash()===r.currdir.hash())return r.chdir(null)}),this.bindKey("CTRL-F",function(){return r.actionFile(r.name+"-mkf")}),this.bindKey("CTRL-D",function(){return r.actionFile(r.name+"-mkdir")}),this.bindKey("CTRL-U",function(){return r.actionFile(r.name+"-upload")}),this.bindKey("CTRL-S",function(){return r.actionFile(r.name+"-share")}),this.bindKey("CTRL-I",function(){return r.actionFile(r.name+"-info")}),this.bindKey("CTRL-R",function(){return r.actionEdit(r.name+"-mv")}),this.bindKey("CTRL-M",function(){return r.actionEdit(r.name+"-rm")}),this.bindKey("CTRL-X",function(){return r.actionEdit(r.name+"-cut")}),this.bindKey("CTRL-C",function(){return r.actionEdit(r.name+"-copy")}),this.bindKey("CTRL-P",function(){return r.actionEdit(r.name+"-paste")}),this.find("btgrid").set("onbtclick",function(t){return r.view.set("view","icon"),r.viewType.icon=!0}),this.find("btlist").set("onbtclick",function(t){return r.view.set("view","list"),r.viewType.list=!0}),this.chdir(null)},i.prototype.applySetting=function(t){switch(t){case"showhidden":return this.view.set("showhidden",this.setting.showhidden);case"nav":return this.toggleNav(this.setting.nav);case"sidebar":return this.toggleSidebar(this.setting.sidebar)}},i.prototype.chdir=function(t){var e,i;return i=this,(e=t?t.asFileHandler():i.currdir).read(function(r){return r.error?i.error(__("Resource not found {0}",t)):(i.currdir=e,e.isRoot()||((t=e.parent().asFileHandler()).filename="[..]",t.type="dir",r.result.unshift(t)),$(i.navinput).val(e.path),i.view.set("path",e.path),i.view.set("data",r.result))})},i.prototype.mnFile=function(){var t;return t=this,{text:"__(File)",child:[{text:"__(New file)",dataid:this.name+"-mkf",shortcut:"C-F"},{text:"__(New folder)",dataid:this.name+"-mkdir",shortcut:"C-D"},{text:"__(Open with)",dataid:this.name+"-open",child:this.apps},{text:"__(Upload)",dataid:this.name+"-upload",shortcut:"C-U"},{text:"__(Download)",dataid:this.name+"-download"},{text:"__(Share file)",dataid:this.name+"-share",shortcut:"C-S"},{text:"__(Properties)",dataid:this.name+"-info",shortcut:"C-I"}],onmenuselect:function(e){return t.actionFile(e.item.data.dataid)}}},i.prototype.mnEdit=function(){var t;return t=this,{text:"__(Edit)",child:[{text:"__(Rename)",dataid:this.name+"-mv",shortcut:"C-R"},{text:"__(Delete)",dataid:this.name+"-rm",shortcut:"C-M"},{text:"__(Cut)",dataid:this.name+"-cut",shortcut:"C-X"},{text:"__(Copy)",dataid:this.name+"-copy",shortcut:"C-C"},{text:"__(Paste)",dataid:this.name+"-paste",shortcut:"C-P"}],onmenuselect:function(e){return t.actionEdit(e.item.data.dataid)}}},i.prototype.menu=function(){var t;return t=this,[this.mnFile(),this.mnEdit(),{text:"__(View)",child:[{text:"__(Refresh)",dataid:this.name+"-refresh"},{text:"__(Sidebar)",switch:!0,checked:this.setting.sidebar,dataid:this.name+"-side"},{text:"__(Navigation bar)",switch:!0,checked:this.setting.nav,dataid:this.name+"-nav"},{text:"__(Hidden files)",switch:!0,checked:this.setting.showhidden,dataid:this.name+"-hidden"},{text:"__(Type)",child:[{text:"__(Icon view)",radio:!0,checked:function(){return t.viewType.icon},dataid:this.name+"-icon",type:"icon"},{text:"__(List view)",radio:!0,checked:function(){return t.viewType.list},dataid:this.name+"-list",type:"list"},{text:"__(Tree view)",radio:!0,checked:function(){return t.viewType.tree},dataid:this.name+"-tree",type:"tree"}],onmenuselect:function(e){return t.view.set("view",e.item.data.type),t.viewType[e.item.data.type]=!0}}],onmenuselect:function(e){return t.actionView(e)}}]},i.prototype.toggleSidebar=function(t){return t?$(this.favo).show():$(this.favo).hide(),this.trigger("resize")},i.prototype.toggleNav=function(t){return t?$(this.navbar).show():$(this.navbar).hide(),this.trigger("resize")},i.prototype.actionView=function(t){switch(t.item.data.dataid){case this.name+"-hidden":return this.registry("showhidden",t.item.data.checked);case this.name+"-refresh":return this.chdir(null);case this.name+"-side":return this.registry("sidebar",t.item.data.checked);case this.name+"-nav":return this.registry("nav",t.item.data.checked)}},i.prototype.actionEdit=function(t){var e,i;switch(i=this,e=this.view.get("selectedFile"),t){case this.name+"-mv":if(!e)return;return this.openDialog("PromptDialog",function(t){if(t!==e.filename)return e.path.asFileHandler().move(i.currdir.path+"/"+t,function(e){if(e.error)return i.error(__("Fail to rename to {0}: {1}",t,e.error))})},"__(Rename)",{label:"__(File name)",value:e.filename});case this.name+"-rm":if(!e)return;return this.openDialog("YesNoDialog",function(t){if(t)return e.path.asFileHandler().remove(function(t){if(t.error)return i.error(__("Fail to delete {0}: {1}",e.filename,t.error))})},"__(Delete)",{iconclass:"fa fa-question-circle",text:__("Do you really want to delete: {0}?",e.filename)});case this.name+"-cut":if(!e)return;return this.clipboard={cut:!0,file:e.path.asFileHandler()},this.notify(__("File {0} cut",e.filename));case this.name+"-copy":if(!e&&"dir"!==e.type)return;return this.clipboard={cut:!1,file:e.path.asFileHandler()},this.notify(__("File {0} copied",e.filename));case this.name+"-paste":if(i=this,!this.clipboard)return;return this.clipboard.cut?this.clipboard.file.move(i.currdir.path+"/"+this.clipboard.file.basename,function(t){if(i.clipboard=void 0,t.error)return i.error(__("Fail to paste: {0}",t.error))}):this.clipboard.file.read(function(t){var e,r;return e=new Blob([t],{type:i.clipboard.file.info.mime}),(r=(i.currdir.path+"/"+i.clipboard.file.basename).asFileHandler()).cache=e,r.write(i.clipboard.file.info.mime,function(t){if(i.clipboard=void 0,t.error)return i.error(__("Fail to paste: {0}",t.error))})},"binary");default:return this._api.handler.setting()}},i.prototype.actionFile=function(t){var e,i;switch(i=this,e=this.view.get("selectedFile"),t){case this.name+"-mkdir":return this.openDialog("PromptDialog",function(t){return i.currdir.mk(t,function(e){if(e.error)return i.error(__("Fail to create {0}: {1}",t,e.error))})},"__(New folder)",{label:"__(Folder name)"});case this.name+"-mkf":return this.openDialog("PromptDialog",function(t){return(i.currdir.path+"/"+t).asFileHandler().write("text/plain",function(e){if(e.error)return i.error(__("Fail to create {0}: {1}",t,e.error))})},"__(New file)",{label:"__(File name)"});case this.name+"-info":if(!e)return;return this.openDialog("InfoDialog",null,e.filename,e);case this.name+"-upload":return i=this,this.currdir.upload(function(t){if(t.error)return i.error(__("Fail to upload to {0}: {1}",i.currdir.path,t.error))});case this.name+"-share":if(i=this,!e||"file"!==e.type)return;return e.path.asFileHandler().publish(function(t){return t.error?i.error(__("Cannot share file: {0}",t.error)):i.notify(__("Shared url: {0}",t.result))});case this.name+"-download":if(!e)return;return e.path.asFileHandler().download(function(){});default:return console.log(t)}},i}(this.OS.GUI.BaseApplication),this.OS.register("Files",t)}).call(this);