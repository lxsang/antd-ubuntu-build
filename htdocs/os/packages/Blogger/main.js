(function(){var t,e,n=function(t,e){for(var n in e)i.call(e,n)&&(t[n]=e[n]);function r(){this.constructor=t}return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},i={}.hasOwnProperty;e=function(t){function e(){e.__super__.constructor.call(this,"BloggerCategoryDialog",{tags:[{tag:"afx-label",att:"data-height = '20', text = 'Pick a parent:'"},{tag:"afx-tree-view"},{tag:"afx-label",att:"data-height = '20', text = 'Category name:'"},{tag:"input",att:"type = 'text' data-height = '20'"}],width:200,height:300,resizable:!0,buttons:[{label:"0k",onclick:function(t){var e,n;return(e=t.find("content1").get("selectedItem"))?""!==(n=t.find("content3").value)||t.data.selonly?t.data.cat&&t.data.cat.id===e.id?t.notify("Parent can not be the category itself"):(t.handler&&t.handler({p:e,value:n}),t.quit()):t.notify("Please enter category name"):t.notify("Please select a parent category")}},{label:"Cancel",onclick:function(t){return t.quit()}}],filldata:function(t){var e,n;if(t.data)return n=t.find("content1"),t.data.tree&&n.set("data",t.data.tree),t.data.cat?(e=n.find("id",t.data.cat.pid)[0],n.set("selectedItem",e),t.find("content3").value=t.data.cat.name):void 0},xtra:function(t){return $(t.find("content3")).keyup(function(e){if(13===e.which)return t.find("bt0").trigger()})}})}return n(e,t),e}(this.OS.GUI.BasicDialog),this.OS.register("BloggerCategoryDialog",e),t=function(t){function e(){e.__super__.constructor.call(this,"BloggerCVSectionDiaglog")}return n(e,t),e.prototype.init=function(){return this.render(this.path()+"/cvsection.html")},e.prototype.main=function(){var t,e,n,i,r;if(i=this,this.scheme.set("apptitle",this.title),this.editor=new SimpleMDE({element:this.find("contentarea"),status:!1,toolbar:!1}),$(this.select('[class = "CodeMirror-scroll"]')[0]).css("min-height","50px"),$(this.select('[class="CodeMirror cm-s-paper CodeMirror-wrap"]')[0]).css("min-height","50px"),this.on("vboxchange",function(){return i.resizeContent(),console.log("resize content")}),e=i.select("[input-class='user-input']"),i.data)for(t=0,n=e.length;t<n;t++)r=e[t],$(r).val(i.data[r.name]);return i.data&&i.data.content&&this.editor.value(i.data.content),this.find("bt-cv-sec-save").set("onbtclick",function(t){var n,o,s;for(n={},console.log(e),o=0,s=e.length;o<s;o++)n[(r=e[o]).name]=$(r).val();return n.content=i.editor.value(),""===n.title&&""===n.content?i.notify("Title or content must not be blank"):(i.data&&i.data.id&&(n.id=i.data.id),i.handler&&i.handler(n),i.quit())}),i.resizeContent()},e.prototype.resizeContent=function(){var t,e,n;return n=this.find("editor-container"),e=$(n).children(),t=$(n).height()-30,$(e[1]).css("height",t+"px")},e}(this.OS.GUI.BaseDialog),this.OS.register("BloggerCVSectionDiaglog",t)}).call(this),function(){var t,e={}.hasOwnProperty;(t=function(t){function n(t){n.__super__.constructor.call(this,"Blogger",t)}return function(t,n){for(var i in n)e.call(n,i)&&(t[i]=n[i]);function r(){this.constructor=t}r.prototype=n.prototype,t.prototype=new r,t.__super__=n.prototype}(n,t),n.prototype.main=function(){var t;return t=this,this.tabbar=this.find("tabbar"),this.containers=[this.find("user-container"),this.find("cv-container"),this.find("blog-container")],this.user={},this.cvlist=this.find("cv-list"),this.cvlist.set("ontreeselect",function(e){return t.CVSectionByCID(Number(e.id))}),this.inputtags=this.find("input-tags"),this.bloglist=this.find("blog-list"),this.userdb=new this._api.DB("user"),this.cvcatdb=new this._api.DB("cv_cat"),this.cvsecdb=new this._api.DB("cv_sections"),this.blogdb=new this._api.DB("blogs"),this.tabbar.set("onlistselect",function(e){var n,i,r,o;for(i=0,r=(o=t.containers).length;i<r;i++)n=o[i],$(n).hide();return t.fetchData(e.idx),$(t.containers[e.idx]).show(),t.trigger("calibrate")}),this.tabbar.set("items",[{iconclass:"fa fa-user-circle",selected:!0},{iconclass:"fa fa-info-circle"},{iconclass:"fa fa-book"}]),this.find("bt-user-save").set("onbtclick",function(e){return t.saveUser()}),this.find("cv-cat-add").set("onbtclick",function(e){return t.openDialog("BloggerCategoryDialog",function(e){var n;return n={name:e.value,pid:e.p.id,publish:1},t.cvcatdb.save(n,function(e){return e.error&&t.error("Cannot add new category"),t.refreshCVCat()})},"Add category",{tree:t.cvlist.get("data")})}),this.find("cv-cat-edit").set("onbtclick",function(e){var n;if(n=t.cvlist.get("selectedItem"))return t.openDialog("BloggerCategoryDialog",function(e){var i;return i={id:n.id,publish:n.publish,pid:e.p.id,name:e.value},t.cvcatdb.save(i,function(e){return e.error?t.error("Cannot Edit category"):t.refreshCVCat()})},"Edit category",{tree:t.cvlist.get("data"),cat:n})}),this.find("cv-cat-del").set("onbtclick",function(e){var n;if(n=t.cvlist.get("selectedItem"))return t.openDialog("YesNoDialog",function(e){if(e)return t.deleteCVCat(n)},"Delete cagegory",{iconclass:"fa fa-question-circle",text:"Do you really want to delete: "+n.name+" ?"})}),this.find("cv-sec-add").set("onbtclick",function(e){var n;return(n=t.cvlist.get("selectedItem"))&&0!==n.id?t.openDialog("BloggerCVSectionDiaglog",function(e){return e.cid=Number(n.id),e.start=Number(e.start),e.end=Number(e.end),e.publish=1,t.cvsecdb.save(e,function(e){return e.error?t.error("Cannot save section: "+e.error):t.CVSectionByCID(Number(n.id))})},"New section entry for "+n.name,null):t.notify("Please select a category")}),this.find("cv-sec-move").set("onbtclick",function(e){var n;return(n=t.find("cv-sec-list").get("selected"))?t.openDialog("BloggerCategoryDialog",function(e){var i;return i={id:n.id,cid:e.p.id},t.cvsecdb.save(i,function(e){return e.error?t.error("Cannot move section"):(t.CVSectionByCID(n.cid),t.find("cv-sec-list").set("selected",-1))})},"Move to",{tree:t.cvlist.get("data"),selonly:!0}):t.notify("Please select a section to move")}),this.find("cv-sec-edit").set("onbtclick",function(e){var n;return(n=t.find("cv-sec-list").get("selected"))?t.openDialog("BloggerCVSectionDiaglog",function(e){return e.cid=Number(n.cid),e.start=Number(e.start),e.end=Number(e.end),e.publish=Number(n.publish),t.cvsecdb.save(e,function(e){return e.error?t.error("Cannot save section: "+e.error):t.CVSectionByCID(Number(n.cid))})},"Modify section entry",n):t.notify("Please select a section to edit")}),this.editor=new SimpleMDE({element:t.find("markarea"),autofocus:!0,tabSize:4,indentWithTabs:!0,toolbar:[{name:"new",className:"fa fa-file",action:function(e){return t.bloglist.set("selected",-1),t.clearEditor()}},{name:"save",className:"fa fa-save",action:function(e){return t.saveBlog()}},"|","bold","italic","heading","|","quote","code","unordered-list","ordered-list","|","link","image","table","horizontal-rule",{name:"image",className:"fa fa-file-image-o",action:function(e){return t.openDialog("FileDiaLog",function(e,n,i){return i.asFileHandler().publish(function(e){return e.error?t.error("Cannot export file for embeding to text"):t.editor.codemirror.getDoc().replaceSelection("![]("+t._api.handler.shared+"/"+e.result+")")})},"Select image file",{mimes:["image/.*"]})}},"|",{name:"preview",className:"fa fa-eye no-disable",action:function(e){return t.previewOn=!t.previewOn,SimpleMDE.togglePreview(e)}}]}),this.bloglist.set("onlistselect",function(e){var n;if(n=t.bloglist.get("selected"))return t.editor.value(atob(n.content)),t.inputtags.value=n.tags,t.find("blog-publish").set("swon",!!n.publish)}),this.bloglist.set("onitemclose",function(e){return t.openDialog("YesNoDialog",function(n){if(n)return t.blogdb.delete(e.item.item.id,function(n){return n.error?t.error("Cannot delete: "+n.error):(t.bloglist.remove(e.item.item,!0),t.bloglist.set("selected",-1),t.clearEditor())})},"Delete a post",{iconclass:"fa fa-question-circle",text:"Do you really want to delete this post ?"}),!1}),this.on("vboxchange",function(){return t.resizeContent()})},n.prototype.fetchData=function(t){var e;switch(e=this,t){case 0:return this.userdb.get(null,function(t){var n,i,r,o,s;if(t.error)return e.error("Cannot fetch user data");for(e.user=t.result[0],o=[],n=0,r=(i=e.select("[input-class='user-input']")).length;n<r;n++)s=i[n],o.push($(s).val(e.user[s.name]));return o});case 1:return this.refreshCVCat();default:return this.loadBlogs()}},n.prototype.saveUser=function(){var t,e,n,i,r;for(i=this,t=0,n=(e=this.select("[input-class='user-input']")).length;t<n;t++)r=e[t],this.user[r.name]=$(r).val();return this.user.fullname&&""!==this.user.fullname?this.userdb.save(this.user,function(t){return t.error?i.error("Cannot save user data"):i.notify("User data updated")}):this.notify("Full name must be entered")},n.prototype.refreshCVCat=function(){var t,e,n;return n=this,e={name:"Porfolio",id:0,nodes:[]},t={order:{name:"ASC"}},this.cvcatdb.find(t,function(t){return t.error?(n.cvlist.set("data",e),n.notify("Cannot fetch CV categories")):(n.fetchCVCat(t.result,e,"0"),n.cvlist.set("data",e))})},n.prototype.fetchCVCat=function(t,e,n){var i,r,o,s,a;if(0===(o=function(){var e,i,r;for(r=[],e=0,i=t.length;e<i;e++)(a=t[e]).pid===n&&r.push(a);return r}()).length)return e.nodes=null;for(s=[],i=0,r=o.length;i<r;i++)(a=o[i]).nodes=[],this.fetchCVCat(t,a,a.id),s.push(e.nodes.push(a));return s},n.prototype.deleteCVCat=function(t){var e,n,i,r,o;return r=this,i=[],(n=function(t){var e,r,o,s,a;if(i.push(t.id),t.nodes){for(s=[],e=0,r=(o=t.nodes).length;e<r;e++)a=o[e],s.push(n(a));return s}})(t),e=function(){var t,e,n;for(n=[],t=0,e=i.length;t<e;t++)o=i[t],n.push({"=":{cid:o}});return n}(),this.cvsecdb.delete({or:e},function(n){return n.error?r.error("Cannot delete all content of: "+t.name+" ["+n.error+"]"):(e=function(){var t,e,n;for(n=[],t=0,e=i.length;t<e;t++)o=i[t],n.push({"=":{id:o}});return n}(),r.cvcatdb.delete({or:e},function(e){return e.error?r.error("Cannot delete the category: "+t.name+" ["+e.error+"]"):r.refreshCVCat()}))})},n.prototype.CVSectionByCID=function(t){var e,n;return n=this,e={exp:{"=":{cid:t}},order:{start:"DESC"}},this.cvsecdb.find(e,function(t){var e,i,r,o,s,a,c,l,u;if(t.error)return n.notify("Section list is empty, please add one");for(i=0,s=(c=t.result).length;i<s;i++)(u=c[i]).text=u.title;for(r=[],$(n.find("cv-sec-status")).html("Found "+t.result.length+" sections"),o=0,a=(l=t.result).length;o<a;o++)(u=l[o]).text=u.title,u.complex=!0,u.start=Number(u.start),u.end=Number(u.end),u.detail=[],""!==u.subtitle&&u.detail.push({text:u.subtitle,class:"cv-subtitle"}),0!==u.start&&0!==u.end?u.detail.push({text:u.start+" - "+u.end,class:"cv-period"}):u.detail.push({text:"",class:"cv-period"}),""!==u.location&&u.detail.push({text:u.location,class:"cv-loc"}),u.closable=!0,u.detail.push({text:u.content,class:"cv-content"}),r.push(u);return(e=n.find("cv-sec-list")).set("onitemclose",function(t){return n.openDialog("YesNoDialog",function(i){if(i)return n.cvsecdb.delete(t.item.item.id,function(i){return i.error?n.error("Cannot delete the section: "+i.error):e.remove(t.item.item,!0)})},"Delete section",{iconclass:"fa fa-question-circle",text:"Do you really want to delete: "+t.item.item.text+" ?"}),!1}),e.set("items",r)})},n.prototype.saveBlog=function(){var t,e,n,i,r,o,s;return i=this,r=this.bloglist.get("selected"),o=this.inputtags.value,t=this.editor.value(),(s=new RegExp("^#+(.*)\n","g").exec(t))&&2===s.length?""===o?this.notify("Please enter tags"):(e=new Date,n={content:t.asBase64(),title:s[1].trim(),tags:o,ctime:r?r.ctime:e.timestamp(),ctimestr:r?r.ctimestr:e.toString(),utime:e.timestamp(),utimestr:e.toString(),rendered:i.editor.options.previewRender(t).asBase64(),publish:this.find("blog-publish").get("swon")?1:0},r&&(n.id=r.id),this.blogdb.save(n,function(t){return t.error?i.error("Cannot save blog: "+t.error):i.loadBlogs()})):this.notify("Please insert a title in the text: beginning with heading")},n.prototype.clearEditor=function(){return this.editor.value(""),this.inputtags.value="",this.find("blog-publish").set("swon",!1)},n.prototype.loadBlogs=function(){var t,e,n;return e=this,n=this.bloglist.get("selidx"),t={order:{ctime:"DESC"}},this.blogdb.find(t,function(t){var i,r,o,s;if(t.error)return e.notify("No post found: "+t.error);for(i=0,r=(o=t.result).length;i<r;i++)(s=o[i]).text=s.title,s.complex=!0,s.closable=!0,s.content=s.content.unescape(),s.detail=[{text:"Created: "+s.ctimestr,class:"blog-dates"},{text:"Updated: "+s.utimestr,class:"blog-dates"}];return e.bloglist.set("items",t.result),-1!==n?e.bloglist.set("selected",n):(e.clearEditor(),e.bloglist.set("selected",-1))})},n.prototype.resizeContent=function(){var t,e,n,i,r,o;return n=this.find("editor-container"),e=$(n).children(),r=$(this.scheme).find(".afx-window-top")[0],o=e[1],i=e[4],t=$(this.scheme).height()-$(r).height()-$(o).height()-$(i).height()-90,$(e[2]).css("height",t+"px")},n}(this.OS.GUI.BaseApplication)).singleton=!0,t.dependencies=["mde/simplemde.min"],this.OS.register("Blogger",t)}.call(this);