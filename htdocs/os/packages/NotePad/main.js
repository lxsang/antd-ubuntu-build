(function(){var e,t={}.hasOwnProperty;(e=function(e){function i(e){i.__super__.constructor.call(this,"NotePad",e)}return function(e,i){for(var r in i)t.call(i,r)&&(e[r]=i[r]);function n(){this.constructor=e}n.prototype=i.prototype,e.prototype=new n,e.__super__=i.prototype}(i,e),i.prototype.main=function(){var e,t,i,r,n,a,s,o,c,l,u,h,d,f,p;for(c=this,this.scheme.set("apptitle","NotePad"),this.sidebar=this.find("sidebar"),this.location=this.find("location"),this.fileview=this.find("fileview"),e=this.find("datarea"),ace.require("ace/ext/language_tools"),this.currfile=this.args&&this.args.length>0?this.args[0].asFileHandler():"Untitled".asFileHandler(),this.editor=ace.edit(e),this.editor.setOptions({enableBasicAutocompletion:!0,enableSnippets:!0,enableLiveAutocompletion:!0,fontSize:"9pt"}),this.editor.completers.push({getCompletions:function(e,t,i,r,n){}}),this.editor.getSession().setUseWrapMode(!0),this.fileview.contextmenuHandler=function(e,t){return t.set("items",c.contextMenu()),t.set("onmenuselect",function(e){return c.contextAction(e)}),t.show(e)},this.mlist=this.find("modelist"),this.modes=ace.require("ace/ext/modelist"),a=[],t=function(e,t){return a.push({text:e.name,mode:e.mode,selected:"ace/mode/text"===e.mode}),e.idx=t},l=this.modes.modes,i=r=0,s=l.length;r<s;i=++r)t(o=l[i],i);for(n in this.mlist.set("items",a),this.mlist.set("onlistselect",function(e){return c.editor.session.setMode(e.data.mode)}),f=this.find("themelist"),p=ace.require("ace/ext/themelist"),a=[],u=p.themesByName)o=u[n],a.push({text:o.caption,mode:o.theme,selected:"ace/theme/monokai"===o.theme});return f.set("onlistselect",function(e){return c.editor.setTheme(e.data.mode)}),f.set("items",a),h=this.find("editorstat"),(d=function(e){var t,i;return t=c.editor.session.selection.getCursor(),i=c.editor.session.getLength(),$(h).html("Row "+t.row+", col "+t.column+", lines: "+i)})(),this.editor.getSession().selection.on("changeCursor",function(e){return d()}),this.editormux=!1,this.editor.on("input",function(){return c.editormux?(c.editormux=!1,!1):c.currfile.dirty?void 0:(c.currfile.dirty=!0,c.currfile.text+="*",c.tabarea.update())}),this.on("resize",function(){return c.editor.resize()}),this.on("focus",function(){return c.editor.focus()}),this.fileview.set("chdir",function(e){return c.chdir(e)}),this.fileview.set("fetch",function(e,t){if(e.child&&"[..]"!==e.child.filename)return e.child.path.asFileHandler().read(function(i){return i.error?c.error("Resource not found "+e.child.path):t(i.result)})}),this.fileview.set("onfileopen",function(e){if("dir"!==e.type)return c.open(e.path.asFileHandler())}),this.subscribe("VFS",function(e){var t;if(t=c.fileview.get("path").asFileHandler(),e.data.file.hash()===t.hash()||e.data.file.parent().hash()===t.hash())return c.chdir(t.path)}),this.location.set("onlistselect",function(e){return c.chdir(e.data.path)}),this.location.set("items",function(){var e,t,r,n;for(n=[],t=0,e=(r=this.systemsetting.VFS.mountpoints).length;t<e;t++)"app"!==(i=r[t]).type&&n.push(i);return n}.call(this)),this.location.get("selected")||this.location.set("selected",0),this.tabarea=this.find("tabarea"),this.tabarea.set("ontabselect",function(e){return c.selecteTab(e.idx)}),this.tabarea.set("onitemclose",function(e){var t;return!!(t=e.item.item)&&(t.dirty?(c.openDialog("YesNoDialog",function(e){return e?c.closeTab(t):c.editor.focus()},"Close tab",{text:"Close without saving ?"}),!1):c.closeTab(t))}),this.bindKey("ALT-N",function(){return c.actionFile(c.name+"-New")}),this.bindKey("ALT-O",function(){return c.actionFile(c.name+"-Open")}),this.bindKey("CTRL-S",function(){return c.actionFile(c.name+"-Save")}),this.bindKey("ALT-W",function(){return c.actionFile(c.name+"-Saveas")}),this.open(this.currfile)},i.prototype.open=function(e){var t,i;return t=this.findTabByFile(e),this.fileview.set("preventUpdate",!0),-1!==t?this.tabarea.set("selected",t):"Untitled"===e.path.toString()?this.newtab(e):(i=this,e.read(function(t){return e.cache=t||"",i.newtab(e)}))},i.prototype.contextMenu=function(){return[{text:"New file",dataid:this.name+"-mkf"},{text:"New folder",dataid:this.name+"-mkd"},{text:"Delete",dataid:this.name+"-rm"},{text:"Refresh",dataid:this.name+"-refresh"}]},i.prototype.contextAction=function(e){var t,i,r;switch(r=this,i=this.fileview.get("selectedFile"),t=i?i.path.asFileHandler():this.fileview.get("path").asFileHandler(),i&&"dir"!==i.type&&(t=t.parent().asFileHandler()),e.item.data.dataid){case this.name+"-mkd":return this.openDialog("PromptDialog",function(e){return t.mk(e,function(t){if(t.error)return r.error("Fail to create "+e+": "+t.error)})},"New folder");case this.name+"-mkf":return this.openDialog("PromptDialog",function(e){return(t.path+"/"+e).asFileHandler().write("",function(t){if(t.error)return r.error("Fail to create "+e+": "+t.error)})},"New file");case this.name+"-rm":if(!i)return;return this.openDialog("YesNoDialog",function(e){if(e)return i.path.asFileHandler().remove(function(e){if(e.error)return r.error("Fail to delete "+i.filename+": "+e.error)})},"Delete",{iconclass:"fa fa-question-circle",text:"Do you really want to delete: "+i.filename+" ?"});case this.name+"-refresh":return this.chdir(this.fileview.get("path"))}},i.prototype.save=function(e){var t;return t=this,e.write("text/plain",function(i){return i.error?t.error("Error saving file "+e.basename):(e.dirty=!1,e.text=e.basename,t.tabarea.update())})},i.prototype.findTabByFile=function(e){var t,i,r;return r=this.tabarea.get("items"),0===(i=function(){var i,n,a;for(a=[],t=i=0,n=r.length;i<n;t=++i)r[t].hash()===e.hash()&&a.push(t);return a}()).length?-1:i[0]},i.prototype.closeTab=function(e){var t;return this.tabarea.remove(e,!1),0===(t=this.tabarea.get("count"))?(this.open("Untitled".asFileHandler()),!1):(this.tabarea.set("selected",t-1),!1)},i.prototype.newtab=function(e){return e.text=e.basename?e.basename:e.path,e.cache||(e.cache=""),e.um=new ace.UndoManager,this.currfile.selected=!1,e.selected=!0,this.tabarea.push(e,!0)},i.prototype.selecteTab=function(e){var t,i;if(t=this.tabarea.get("items")[e])return this.scheme.set("apptitle",t.text.toString()),this.currfile!==t&&(this.currfile.cache=this.editor.getValue(),this.currfile.cursor=this.editor.selection.getCursor(),this.currfile=t),i="ace/mode/text","Untitled"!==t.path.toString()&&(i=this.modes.getModeForPath(t.path)),this.mlist.set("selected",i.idx),this.editormux=!0,this.editor.setValue(t.cache,-1),this.editor.session.setMode(i.mode),this.editor.session.setUndoManager(t.um),t.cursor&&(this.editor.renderer.scrollCursorIntoView({row:t.cursor.row,column:t.cursor.column},.5),this.editor.selection.moveTo(t.cursor.row,t.cursor.column)),this.editor.focus()},i.prototype.chdir=function(e){var t,i;if(e)return i=this,(t=e.asFileHandler()).read(function(r){var n;return r.error?i.error("Resource not found "+n):(t.isRoot()||((n=t.parent().asFileHandler()).filename="[..]",n.type="dir",r.result.unshift(n)),$(i.navinput).val(t.path),i.fileview.set("path",e),i.fileview.set("data",r.result))})},i.prototype.menu=function(){var e;return e=this,[{text:"File",child:[{text:"New",dataid:this.name+"-New",shortcut:"A-N"},{text:"Open",dataid:this.name+"-Open",shortcut:"A-O"},{text:"Save",dataid:this.name+"-Save",shortcut:"C-S"},{text:"Save as",dataid:this.name+"-Saveas",shortcut:"A-W"}],onmenuselect:function(t){return e.actionFile(t.item.data.dataid)}}]},i.prototype.actionFile=function(e){var t,i;switch(t=this,i=function(){return t.openDialog("FileDiaLog",function(e,i){var r;return(r=(e+"/"+i).asFileHandler()).cache=t.currfile.cache,r.dirty=t.currfile.dirty,r.um=t.currfile.um,r.cursor=t.currfile.cursor,r.selected=t.currfile.selected,r.text=t.currfile.text,t.tabarea.replaceItem(t.currfile,r,!1),t.currfile=r,t.save(t.currfile)},"Save as",{file:t.currfile})},e){case this.name+"-Open":return this.openDialog("FileDiaLog",function(e,i){return t.open((e+"/"+i).asFileHandler())},"Open file");case this.name+"-Save":return this.currfile.cache=this.editor.getValue(),this.currfile.basename?this.save(this.currfile):i();case this.name+"-Saveas":return this.currfile.cache=this.editor.getValue(),i();case this.name+"-New":return this.open("Untitled".asFileHandler())}},i.prototype.cleanup=function(e){var t,i,r;if(0!==(t=function(){var e,t,i,n;for(n=[],e=0,t=(i=this.tabarea.get("items")).length;e<t;e++)(r=i[e]).dirty&&n.push(r);return n}.call(this)).length)return i=this,e.preventDefault(),this.openDialog("YesNoDialog",function(e){var n,a;if(e){for(n=0,a=t.length;n<a;n++)(r=t[n]).dirty=!1;return i.quit()}},"Quit",{text:"Ignore all "+t.length+" unsaved files ?"})},i}(this.OS.GUI.BaseApplication)).singleton=!1,e.dependencies=["ace/ace","ace/ext-language_tools","ace/ext-modelist","ace/ext-themelist"],this.OS.register("NotePad",e)}).call(this);