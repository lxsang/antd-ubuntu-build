(function(){var t,i={}.hasOwnProperty;t=function(t){function n(t){n.__super__.constructor.call(this,"Calendar",t),this.text="",this.iconclass="fa fa-calendar"}return function(t,n){for(var e in n)i.call(n,e)&&(t[e]=n[e]);function o(){this.constructor=t}o.prototype=n.prototype,t.prototype=new o,t.__super__=n.prototype}(n,t),n.prototype.init=function(){var t;return t=this,this.watch(1e3,function(){var i;return i=new Date,t.text=i.toString(),t.update()})},n.prototype.awake=function(t){return this.openDialog("CalendarDialog",function(t){return console.log(t)},"Calendar")},n.prototype.cleanup=function(t){return console.log("cleanup for quit")},n}(this.OS.GUI.BaseService),this.OS.register("Calendar",t)}).call(this),function(){var t,i={}.hasOwnProperty;t=function(t){function n(t){n.__super__.constructor.call(this,"PushNotification",t),this.iconclass="fa fa-bars",this.onmenuselect=function(t){return console.log(t)},this.cb=void 0,this.pending=[]}return function(t,n){for(var e in n)i.call(n,e)&&(t[e]=n[e]);function o(){this.constructor=t}o.prototype=n.prototype,t.prototype=new o,t.__super__=n.prototype}(n,t),n.prototype.init=function(){var t;return this.view=!1,t=t=this.meta().path+"/notifications.html",this.render(t)},n.prototype.spin=function(t){return t&&"fa fa-bars"===this.iconclass?(this.iconclass="fa fa-spinner fa-spin",this.color="#f90e00",this.update()):t||"fa fa-spinner fa-spin"!==this.iconclass?void 0:(this.iconclass="fa fa-bars",this.color="#414339",this.update())},n.prototype.main=function(){var t;return t=this,this.mlist=this.find("notifylist"),this.mfeed=this.find("notifeed"),this.nzone=this.find("notifyzone"),this.fzone=this.find("feedzone"),this.find("btclear").set("onbtclick",function(i){return t.mlist.set("items",[])}),this.subscribe("notification",function(i){return t.pushout("INFO",i)}),this.subscribe("fail",function(i){return t.pushout("FAIL",i)}),this.subscribe("error",function(i){return t.pushout("ERROR",i)}),this.subscribe("info",function(i){return t.pushout("INFO",i)}),this.subscribe("VFS",function(i){return t.pushout("INFO",i)}),this.subscribe("loading",function(i){return t.pending.push(i.id),t.spin(!0)}),this.subscribe("loaded",function(i){var n;if((n=t.pending.indexOf(i.id))>=0&&t.pending.splice(n,1),0===t.pending.length)return t.spin(!1)}),$(this.nzone).css("right",0).css("top","-3px").css("height","").css("bottom","0").css("z-index",1e6).hide(),$(this.fzone).css("bottom","0").css("height","").hide()},n.prototype.pushout=function(t,i,n){var e;return e={text:"["+t+"] "+i.name+" ("+i.id+"): "+i.data.m,icon:i.data.icon,iconclass:i.data.iconclass,closable:!0},console.log(i.data.s),console.log(i.data.e),this.mlist.unshift(e,!0),this.notifeed(e)},n.prototype.notifeed=function(t){var i,n;return i=this,this.mfeed.unshift(t,!0),$(this.fzone).show(),n=setTimeout(function(){return i.mfeed.remove(t,!0),clearTimeout(n)},3e3)},n.prototype.awake=function(t){var i;return this.view?$(this.nzone).hide():$(this.nzone).show(),this.view=!this.view,i=this,this.cb||(this.cb=function(t){if(!t.originalEvent.item||void 0===t.originalEvent.item.i)return $(t.target).closest($(i.nzone)).length||$(t.target).closest($(i.holder.root)).length?void 0:($(i.nzone).hide(),$(document).unbind("click",i.cb),i.view=!i.view)}),this.view?$(document).on("click",this.cb):$(document).unbind("click",this.cb)},n.prototype.cleanup=function(t){},n}(this.OS.GUI.BaseService),this.OS.register("PushNotification",t)}.call(this),function(){var t,i,n=function(t,i){for(var n in i)e.call(i,n)&&(t[n]=i[n]);function o(){this.constructor=t}return o.prototype=i.prototype,t.prototype=new o,t.__super__=i.prototype,t},e={}.hasOwnProperty;i=function(t){function i(){i.__super__.constructor.call(this,"SpotlightDialog")}return n(i,t),i.prototype.init=function(){return this.render(this.path()+"/spotlight.html")},i.prototype.main=function(){var t;return t=this,this.height=$(this.scheme).css("height"),this.container=this.find("container"),$(this.scheme).css("height","45px"),this.fn=function(i){if(27===i.which)return $(document).unbind("click",t.fn1),$(document).unbind("keyup",t.fn),t.handler&&t.handler(i),t.quit()},$(document).keyup(this.fn),this.fn1=function(i){if(!$(i.target).closest(t.scheme).length)return $(document).unbind("click",t.fn1),$(document).unbind("keyup",t.fn),t.handler&&t.handler(i),t.quit()},$(document).click(this.fn1),this.searchbox=this.find("searchbox"),$(this.searchbox).focus(),$(this.searchbox).keyup(function(i){return t.search(i)}),this.container.set("onlistdbclick",function(i){if(!i.data.dataid||"header"!==i.data.dataid)return t.handler&&t.handler(i),t._gui.openWith(i.data),$(document).unbind("click",t.fn1),$(document).unbind("keyup",t.fn),t.quit()})},i.prototype.search=function(t){var i,n,e;switch(t.which){case 37:return t.preventDefault();case 38:return this.container.selectPrev(),t.preventDefault();case 39:return t.preventDefault();case 40:return this.container.selectNext(),t.preventDefault();case 13:if(t.preventDefault(),!(n=this.container.get("selected")))return;if(n.dataid&&"header"===n.dataid)return;return this.handler&&this.handler(t),this._gui.openWith(n),$(document).unbind("click",this.fn1),$(document).unbind("keyup",this.fn),this.quit();default:if(e=this.searchbox.value,$(this.scheme).css("height","45px"),!(e.length>=3))return;if(0===(i=this._api.search(e)).length)return;return this.container.set("items",i),$(this.scheme).css("height",this.height)}},i}(this.OS.GUI.BaseDialog),this.OS.register("SpotlightDialog",i),t=function(t){function i(t){i.__super__.constructor.call(this,"Spotlight",t),this.iconclass="fa fa-search",this.show=!1}return n(i,t),i.prototype.init=function(){},i.prototype.main=function(){},i.prototype.awake=function(t){var i;return i=this,this.show?(i.show=!1,this.dialog?this.dialog.quit():void 0):(i.show=!0,this.openDialog("SpotlightDialog",function(t){return i.show=!1,i.dialog=void 0}))},i.prototype.cleanup=function(t){},i}(this.OS.GUI.BaseService),this.OS.register("Spotlight",t)}.call(this),function(){var t,i={}.hasOwnProperty;t=function(t){function n(t){n.__super__.constructor.call(this,"UserService",t),this.text=this.systemsetting.user.username,this.iconclass=void 0}return function(t,n){for(var e in n)i.call(n,e)&&(t[e]=n[e]);function o(){this.constructor=t}o.prototype=n.prototype,t.prototype=new o,t.__super__=n.prototype}(n,t),n.prototype.init=function(){var t;return t=this,this.child=[{text:"About",dataid:"user-about",iconclass:"fa fa-user-circle-o"},{text:"Logout",dataid:"sys-logout",iconclass:"fa fa-user-times"}],this.onmenuselect=function(i){return"sys-logout"===i.item.data.dataid?t._api.handler.logout():t.notify("This feature is not implemented yet")}},n.prototype.awake=function(t){},n.prototype.cleanup=function(t){},n}(this.OS.GUI.BaseService),this.OS.register("UserService",t)}.call(this);