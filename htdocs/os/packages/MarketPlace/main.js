(function(){var t,i={}.hasOwnProperty;t=function(t){function s(){s.__super__.constructor.call(this,"RepositoryDialog")}return function(t,s){for(var e in s)i.call(s,e)&&(t[e]=s[e]);function n(){this.constructor=t}n.prototype=s.prototype,t.prototype=new n,t.__super__=s.prototype}(s,t),s.prototype.init=function(){return this.render(this.meta().path+"/repositorydia.html")},s.prototype.main=function(){var t,i,s;return i=this,this.list=this.find("repo-list"),t=function(){var t,i,e,n;for(n=[],t=0,i=(e=this.systemsetting.system.repositories).length;t<i;t++)s=e[t],n.push({text:s.name,iconclass:"fa fa-link",url:s.url});return n}.call(this),this.url=this.find("repo-url"),this.list.set("onlistselect",function(t){return $(i.url).html(t.data.url)}),this.list.set("items",t)},s}(this.OS.GUI.BaseDialog),this.OS.register("RepositoryDialog",t)}).call(this),function(){var t,i={}.hasOwnProperty;t=function(t){function s(t){s.__super__.constructor.call(this,"MarketPlace",t)}return function(t,s){for(var e in s)i.call(s,e)&&(t[e]=s[e]);function n(){this.constructor=t}n.prototype=s.prototype,t.prototype=new n,t.__super__=s.prototype}(s,t),s.prototype.main=function(){var t;return t=this,0===this.systemsetting.system.repositories.length&&this.systemsetting.system.repositories.push({text:"Antos repository",url:"http://127.0.0.1:9191/repo/packages.json",name:"Antos repository",selected:!0}),this.repo=this.find("repo"),this.repo.set("onlistselect",function(i){if(i.data)return t.fetchApps(i.data.url)}),this.repo.set("items",this.systemsetting.system.repositories),this.applist=this.find("applist"),this.applist.set("onlistselect",function(i){if(i.data)return t.appDetail(i.data)}),this.container=this.find("container"),this.appname=this.find("appname"),this.appdesc=this.find("app-desc"),this.appdetail=this.find("app-detail"),this.btinstall=this.find("bt-install"),this.btremove=this.find("bt-remove"),this.btexec=this.find("bt-exec"),$(this.container).css("visibility","hidden"),this.btexec.set("onbtclick",function(i){var s;if(s=t.applist.get("selected"))return s.className?t._gui.launch(s.className):void 0}),this.btinstall.set("onbtclick",function(i){return t.openDialog("RepositoryDialog")})},s.prototype.fetchApps=function(t){var i;return i=this,this._api.get(t,function(t){var s,e,n;for(s=0,e=t.length;s<e;s++)(n=t[s]).text=n.name,n.iconclass="fa fa-adn";return i.applist.set("items",t)},function(s,e){return i.error("Fail to fetch packages list from: "+t)})},s.prototype.appDetail=function(t){var i,s,e;for(i in $(this.container).css("visibility","visible"),$(this.appname).html(t.name),t.description&&$(this.appdesc).html(t.description),this.systemsetting.system.packages[t.className]?($(this.btinstall).hide(),$(this.btremove).show(),$(this.btexec).show()):($(this.btinstall).show(),$(this.btremove).hide(),$(this.btexec).hide()),$(this.appdetail).empty(),s=[],t)e=t[i],"name"!==i&&"description"!==i&&s.push($(this.appdetail).append($("<li>").append($("<span class= 'info-header'>").html(i)).append($("<span>").html(e))));return s},s}(this.OS.GUI.BaseApplication),this.OS.register("MarketPlace",t)}.call(this);