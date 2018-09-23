// Generated by CoffeeScript 1.9.3
(function() {
  var APIManager, BaseObject, MarkOn, WebVNC, require,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.classes = {};

  window.libraries = {};

  window.myuri = "/";

  window.mobilecheck = function() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    }
    return false;
  };

  window.makeclass = function(n, o) {
    return window.classes[n] = o;
  };


  /* 
  window.require = (lib) ->
      return new Promise (r, e) ->
          return r() if window.libraries[lib]
          $.getScript window.myuri + lib
              .done (d) ->
                  window.libraries[lib] = true
                  r()
              .fail (m, s) ->
                  e(m, s)
   */

  require = function(lib) {
    return new Promise(function(r, e) {
      if (window.libraries[lib]) {
        return r();
      }
      return $.getScript(window.myuri + lib).done(function(d) {
        window.libraries[lib] = true;
        return r();
      }).fail(function(m, s) {
        return e(m, s);
      });
    });
  };

  BaseObject = (function() {
    function BaseObject(name) {
      this.name = name;
    }

    BaseObject.prototype.ready = function() {
      var me;
      me = this;
      return new Promise(function(r, e) {
        return me.resolveDep().then(function() {
          return r();
        })["catch"](function(m, s) {
          return e(m, s);
        });
      });
    };

    BaseObject.prototype.resolveDep = function() {
      var me;
      me = this;
      return new Promise(function(r, e) {
        var dep, fn;
        dep = window.classes[me.name].dependencies;
        if (!dep) {
          r();
        }
        fn = function(l, i) {
          if (i >= dep.length) {
            return r();
          }
          return require(l[i]).then(function() {
            return fn(l, i + 1);
          })["catch"](function(m, s) {
            return e(m, s);
          });
        };
        return fn(dep, 0);
      });
    };

    return BaseObject;

  })();

  makeclass("BaseObject", BaseObject);

  APIManager = (function(superClass) {
    extend(APIManager, superClass);

    function APIManager(args1) {
      this.args = args1;
      APIManager.__super__.constructor.call(this, "APIManager");
    }

    APIManager.prototype.init = function() {
      var cname, me;
      me = this;
      if (!(this.args && this.args.length > 0)) {
        return console.error("No class found");
      }
      cname = (this.args.splice(0, 1))[0].trim();
      return this.ready().then(function() {
        if (mobilecheck()) {
          mobileConsole.init();
        }
        if (!cname || cname === "") {
          return;
        }
        if (!window.classes[cname]) {
          return console.error("Cannot find class ", cname);
        }
        return (new window.classes[cname](me.args)).init();
      })["catch"](function(m, s) {
        return console.error(m, s);
      });
    };

    return APIManager;

  })(window.classes.BaseObject);

  APIManager.dependencies = ["/assets/scripts/mobile_console.js"];

  makeclass("APIManager", APIManager);

  MarkOn = (function(superClass) {
    extend(MarkOn, superClass);

    function MarkOn() {
      MarkOn.__super__.constructor.call(this, "MarkOn");
    }

    MarkOn.prototype.init = function() {
      var me;
      me = this;
      return this.ready().then(function() {
        return me.editor = new SimpleMDE({
          element: $("#editor")[0]
        });
      })["catch"](function(m, s) {
        return console.error(m, s);
      });
    };

    return MarkOn;

  })(window.classes.BaseObject);

  MarkOn.dependencies = ["/rst/gscripts/mde/simplemde.min.js"];

  makeclass("MarkOn", MarkOn);

  WebVNC = (function(superClass) {
    extend(WebVNC, superClass);

    function WebVNC() {
      WebVNC.__super__.constructor.call(this, "WebVNC");
    }

    WebVNC.prototype.init = function() {
      var me;
      me = this;
      return this.ready().then(function() {
        return me.initVNCClient();
      })["catch"](function(m, s) {
        return console.error(m, s);
      });
    };

    WebVNC.prototype.initVNCClient = function() {
      var args, me;
      args = {
        element: 'canvas',
        ws: 'wss://lxsang.me/wvnc',
        worker: '/assets/scripts/decoder.js'
      };
      this.client = new WVNC(args);
      me = this;
      this.client.onpassword = function() {
        return new Promise(function(r, e) {
          return r('demopass');
        });
      };
      this.client.oncredential = function() {
        return new Promise(function(r, e) {
          return r('demo', 'demo');
        });
      };
      this.client.oncopy = function(text) {
        return ($("#clipboard"))[0].value = text;
      };
      return this.client.init().then(function() {
        $("#connect").click(function(e) {
          return me.client.connect("/opt/www/vnc.conf", {
            bbp: 32,
            flag: 3,
            quality: 10
          });
        });
        $("#tbstatus").html("32bbp, compress JPEG & ZLib, JPEG quality 10%");
        $("#stop").click(function(e) {
          return me.client.disconnect();
        });
        return $("#selscale").on('change', function(e) {
          var value;
          value = Number(this.value) / 100;
          return me.client.setScale(value);
        });
      })["catch"](function(m, s) {
        return console.error(m, s);
      });
    };

    return WebVNC;

  })(window.classes.BaseObject);

  WebVNC.dependencies = ["/assets/scripts/wvnc.js"];

  makeclass("WebVNC", WebVNC);

}).call(this);
