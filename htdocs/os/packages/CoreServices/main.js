(function(){var t,i,e,n,s,o=function(t,i){for(var e in i)r.call(i,e)&&(t[e]=i[e]);function n(){this.constructor=t}return n.prototype=i.prototype,t.prototype=new n,t.__super__=i.prototype,t},r={}.hasOwnProperty;t=function(t){function i(t){i.__super__.constructor.call(this,"Calendar",t),this.text="",this.iconclass="fa fa-calendar"}return o(i,t),i.prototype.init=function(){var t;return t=this,this.watch(1e3,function(){var i;return i=new Date,t.text=i.toString(),t.update()})},i.prototype.awake=function(t){return this.openDialog("CalendarDialog",function(t){return console.log(t)},"Calendar")},i.prototype.cleanup=function(t){return console.log("cleanup for quit")},i}(this.OS.GUI.BaseService),this.OS.register("Calendar",t),(i=function(t){function i(t){i.__super__.constructor.call(this,"PushNotification",t),this.iconclass="fa fa-bars",this.onmenuselect=function(t){return console.log(t)},this.cb=void 0,this.pending=[]}return o(i,t),i.prototype.init=function(){return this.view=!1,this._gui.htmlToScheme(i.scheme,this,this.host)},i.prototype.spin=function(t){return t&&"fa fa-bars"===this.iconclass?(this.iconclass="fa fa-spinner fa-spin",this.color="#f90e00",this.update()):t||"fa fa-spinner fa-spin"!==this.iconclass?void 0:(this.iconclass="fa fa-bars",this.color="#414339",this.update())},i.prototype.main=function(){var t;return t=this,this.mlist=this.find("notifylist"),this.mfeed=this.find("notifeed"),this.nzone=this.find("notifyzone"),this.fzone=this.find("feedzone"),this.find("btclear").set("onbtclick",function(i){return t.mlist.set("items",[])}),this.subscribe("notification",function(i){return t.pushout("INFO",i)}),this.subscribe("fail",function(i){return t.pushout("FAIL",i)}),this.subscribe("error",function(i){return t.pushout("ERROR",i)}),this.subscribe("info",function(i){return t.pushout("INFO",i)}),this.subscribe("VFS",function(i){return t.pushout("INFO",i)}),this.subscribe("loading",function(i){return t.pending.push(i.id),t.spin(!0)}),this.subscribe("loaded",function(i){var e;if((e=t.pending.indexOf(i.id))>=0&&t.pending.splice(e,1),0===t.pending.length)return t.spin(!1)}),$(this.nzone).css("right",0).css("top","-3px").css("height","").css("bottom","0").css("z-index",1e6).hide(),$(this.fzone).css("bottom","0").css("height","").hide()},i.prototype.pushout=function(t,i,e){var n;return n={text:"["+t+"] "+i.name+" ("+i.id+"): "+i.data.m,icon:i.data.icon,iconclass:i.data.iconclass,closable:!0},this.mlist.unshift(n,!0),this.notifeed(n)},i.prototype.notifeed=function(t){var i,e;return i=this,this.mfeed.unshift(t,!0),$(this.fzone).show(),e=setTimeout(function(){return i.mfeed.remove(t,!0),clearTimeout(e)},3e3)},i.prototype.awake=function(t){var i;return this.view?$(this.nzone).hide():$(this.nzone).show(),this.view=!this.view,i=this,this.cb||(this.cb=function(t){if(!t.originalEvent.item||void 0===t.originalEvent.item.i)return $(t.target).closest($(i.nzone)).length||$(t.target).closest($(i.holder.root)).length?void 0:($(i.nzone).hide(),$(document).unbind("click",i.cb),i.view=!i.view)}),this.view?$(document).on("click",this.cb):$(document).unbind("click",this.cb)},i.prototype.cleanup=function(t){},i}(this.OS.GUI.BaseService)).scheme='<afx-dummy>\n    <afx-overlay data-id = "notifyzone" width = "250">\n        <afx-button text = "__(Clear all)" data-id = "btclear"></afx-button>\n        <afx-list-view data-id="notifylist"></afx-list-view>\n    </afx-overlay>\n    <afx-overlay data-id = "feedzone" width = "250">\n        <afx-list-view data-id = "notifeed">\n        </afx-list-view>\n    </afx-overlay>\n</afx-dummy>',this.OS.register("PushNotification",i),(n=function(t){function i(){i.__super__.constructor.call(this,"SpotlightDialog")}return o(i,t),i.prototype.init=function(){return this._gui.htmlToScheme(i.scheme,this,this.host)},i.prototype.main=function(){var t;return t=this,this.height=$(this.scheme).css("height"),this.container=this.find("container"),$(this.scheme).css("height","45px"),this.fn=function(i){if(27===i.which)return $(document).unbind("click",t.fn1),$(document).unbind("keyup",t.fn),t.handler&&t.handler(i),t.quit()},$(document).keyup(this.fn),this.fn1=function(i){if(!$(i.target).closest(t.parent.holder.root).length)return $(i.target).closest(t.scheme).length?void 0:($(document).unbind("click",t.fn1),$(document).unbind("keyup",t.fn),t.handler&&t.handler(i),t.quit())},$(document).click(this.fn1),this.searchbox=this.find("searchbox"),$(this.searchbox).focus(),$(this.searchbox).keyup(function(i){return t.search(i)}),this.container.set("onlistdbclick",function(i){if(!i.data.dataid||"header"!==i.data.dataid)return t.handler&&t.handler(i),t._gui.openWith(i.data),$(document).unbind("click",t.fn1),$(document).unbind("keyup",t.fn),t.quit()})},i.prototype.search=function(t){var i,e,n;switch(t.which){case 37:return t.preventDefault();case 38:return this.container.selectPrev(),t.preventDefault();case 39:return t.preventDefault();case 40:return this.container.selectNext(),t.preventDefault();case 13:if(t.preventDefault(),!(e=this.container.get("selected")))return;if(e.dataid&&"header"===e.dataid)return;return this.handler&&this.handler(t),this._gui.openWith(e),$(document).unbind("click",this.fn1),$(document).unbind("keyup",this.fn),this.quit();default:if(n=this.searchbox.value,$(this.scheme).css("height","45px"),!(n.length>=3))return;if(0===(i=this._api.search(n)).length)return;return this.container.set("items",i),$(this.scheme).css("height",this.height)}},i}(this.OS.GUI.BaseDialog)).scheme='<afx-app-window data-id = "spotlight-win" apptitle="" minimizable="false" resizable = "false" width="500" height="300">\n    <afx-vbox>\n        <afx-hbox data-height="45">\n            <div data-id = "searchicon" data-width="45"></div>\n            <input type = "text" data-id="searchbox"/>\n        </afx-hbox>\n        <afx-list-view data-id="container"></afx-list-view>\n    </afx-vbox>\n</afx-app-window>',this.OS.register("SpotlightDialog",n),e=function(t){function i(t){i.__super__.constructor.call(this,"Spotlight",t),this.iconclass="fa fa-search",this.show=!1}return o(i,t),i.prototype.init=function(){var t;return t=this,this._gui.bindKey("CTRL- ",function(i){return t.awake(i)})},i.prototype.main=function(){},i.prototype.awake=function(t){var i;return i=this,this.show?(i.show=!1,this.dialog?this.dialog.quit():void 0):(i.show=!0,this.openDialog("SpotlightDialog",function(t){return i.show=!1,i.dialog=void 0}))},i.prototype.cleanup=function(t){},i}(this.OS.GUI.BaseService),this.OS.register("Spotlight",e),s=function(t){function i(t){i.__super__.constructor.call(this,"UserService",t),this.text=this.systemsetting.user.username,this.iconclass=void 0}return o(i,t),i.prototype.init=function(){var t;return t=this,this.child=[{text:"__(About)",dataid:"user-about",iconclass:"fa fa-user-circle-o"},{text:"__(Logout)",dataid:"sys-logout",iconclass:"fa fa-user-times"}],this.onmenuselect=function(i){return"sys-logout"===i.item.data.dataid?window.OS.exit():t.notify(__("This feature is not implemented yet"))}},i.prototype.awake=function(t){},i.prototype.cleanup=function(t){},i}(this.OS.GUI.BaseService),this.OS.register("UserService",s)}).call(this);