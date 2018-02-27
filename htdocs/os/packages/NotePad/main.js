// Generated by CoffeeScript 1.9.3
(function() {
  var NotePad,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NotePad = (function(superClass) {
    extend(NotePad, superClass);

    function NotePad(args) {
      NotePad.__super__.constructor.call(this, "NotePad", args);
    }

    NotePad.prototype.main = function() {
      var div, f, i, j, k, ldata, len, m, me, ref, ref1, stat, stup, themelist, themes;
      me = this;
      this.scheme.set("apptitle", "NotePad");
      this.sidebar = this.find("sidebar");
      this.location = this.find("location");
      this.fileview = this.find("fileview");
      div = this.find("datarea");
      ace.require("ace/ext/language_tools");
      this.currfile = this.args && this.args.length > 0 ? this.args[0].asFileHandler() : "Untitled".asFileHandler();
      this.editor = ace.edit(div);
      this.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "9pt"
      });
      this.editor.completers.push({
        getCompletions: function(editor, session, pos, prefix, callback) {}
      });
      this.editor.getSession().setUseWrapMode(true);
      this.fileview.contextmenuHandler = function(e, m) {
        m.set("items", me.contextMenu());
        m.set("onmenuselect", function(evt) {
          return me.contextAction(evt);
        });
        return m.show(e);
      };
      this.mlist = this.find("modelist");
      this.modes = ace.require("ace/ext/modelist");
      ldata = [];
      f = function(m, i) {
        ldata.push({
          text: m.name,
          mode: m.mode,
          selected: m.mode === 'ace/mode/text' ? true : false
        });
        return m.idx = i;
      };
      ref = this.modes.modes;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        m = ref[i];
        f(m, i);
      }
      this.mlist.set("items", ldata);
      this.mlist.set("onlistselect", function(e) {
        return me.editor.session.setMode(e.data.mode);
      });
      themelist = this.find("themelist");
      themes = ace.require("ace/ext/themelist");
      ldata = [];
      ref1 = themes.themesByName;
      for (k in ref1) {
        m = ref1[k];
        ldata.push({
          text: m.caption,
          mode: m.theme,
          selected: m.theme === "ace/theme/monokai" ? true : false
        });
      }
      themelist.set("onlistselect", function(e) {
        return me.editor.setTheme(e.data.mode);
      });
      themelist.set("items", ldata);
      stat = this.find("editorstat");
      stup = function(e) {
        var c, l;
        c = me.editor.session.selection.getCursor();
        l = me.editor.session.getLength();
        return $(stat).html("Row " + c.row + ", col " + c.column + ", lines: " + l);
      };
      stup(0);
      this.editor.getSession().selection.on("changeCursor", function(e) {
        return stup(e);
      });
      this.editormux = false;
      this.editor.on("input", function() {
        if (me.editormux) {
          me.editormux = false;
          return false;
        }
        if (!me.currfile.dirty) {
          me.currfile.dirty = true;
          me.currfile.text += "*";
          return me.tabarea.update();
        }
      });
      this.on("resize", function() {
        return me.editor.resize();
      });
      this.on("focus", function() {
        return me.editor.focus();
      });
      this.fileview.set("chdir", function(d) {
        return me.chdir(d);
      });
      this.fileview.set("fetch", function(e, f) {
        if (!e.child) {
          return;
        }
        if (e.child.filename === "[..]") {
          return;
        }
        return e.child.path.asFileHandler().read(function(d) {
          if (d.error) {
            return me.error("Resource not found " + e.child.path);
          }
          return f(d.result);
        });
      });
      this.fileview.set("onfileopen", function(e) {
        if (e.type === "dir") {
          return;
        }
        return me.open(e.path.asFileHandler());
      });
      this.subscribe("VFS", function(d) {
        var p;
        p = (me.fileview.get("path")).asFileHandler();
        if (d.data.file.hash() === p.hash() || d.data.file.parent().hash() === p.hash()) {
          return me.chdir(p.path);
        }
      });
      this.location.set("onlistselect", function(e) {
        return me.chdir(e.data.path);
      });
      this.location.set("items", (function() {
        var len1, o, ref2, results;
        ref2 = this.systemsetting.VFS.mountpoints;
        results = [];
        for (o = 0, len1 = ref2.length; o < len1; o++) {
          i = ref2[o];
          if (i.type !== "app") {
            results.push(i);
          }
        }
        return results;
      }).call(this));
      if (!this.location.get("selected")) {
        this.location.set("selected", 0);
      }
      this.tabarea = this.find("tabarea");
      this.tabarea.set("ontabselect", function(e) {
        return me.selecteTab(e.idx);
      });
      this.tabarea.set("onitemclose", function(e) {
        var it;
        it = e.item.item;
        if (!it) {
          return false;
        }
        if (!it.dirty) {
          return me.closeTab(it);
        }
        me.openDialog("YesNoDialog", function(d) {
          if (d) {
            return me.closeTab(it);
          }
          return me.editor.focus();
        }, "Close tab", {
          text: "Close without saving ?"
        });
        return false;
      });
      this.bindKey("ALT-O", function() {
        return me.actionFile(me.name + "-Open");
      });
      this.bindKey("CTRL-S", function() {
        return me.actionFile(me.name + "-Save");
      });
      this.bindKey("META-S", function() {
        return me.actionFile(me.name + "-Saveas");
      });
      return this.open(this.currfile);
    };

    NotePad.prototype.open = function(file) {
      var i, me;
      i = this.findTabByFile(file);
      if (i !== -1) {
        return this.tabarea.set("selected", i);
      }
      if (file.path.toString() === "Untitled") {
        return this.newtab(file);
      }
      me = this;
      return file.read(function(d) {
        file.cache = d || "";
        return me.newtab(file);
      });
    };

    NotePad.prototype.contextMenu = function() {
      return [
        {
          text: "New file",
          dataid: this.name + "-mkf"
        }, {
          text: "New folder",
          dataid: this.name + "-mkd"
        }, {
          text: "Delete",
          dataid: this.name + "-rm"
        }, {
          text: "Refresh",
          dataid: this.name + "-refresh"
        }
      ];
    };

    NotePad.prototype.contextAction = function(e) {
      var dir, file, me;
      me = this;
      file = this.fileview.get("selectedFile");
      dir = file ? file.path.asFileHandler() : (this.fileview.get("path")).asFileHandler();
      if (file && file.type !== "dir") {
        dir = dir.parent().asFileHandler();
      }
      switch (e.item.data.dataid) {
        case this.name + "-mkd":
          return this.openDialog("PromptDialog", function(d) {
            return dir.mk(d, function(r) {
              if (r.error) {
                return me.error("Fail to create " + d + ": " + r.error);
              }
            });
          }, "New folder");
        case this.name + "-mkf":
          return this.openDialog("PromptDialog", function(d) {
            var fp;
            fp = (dir.path + "/" + d).asFileHandler();
            return fp.write("", function(r) {
              if (r.error) {
                return me.error("Fail to create " + d + ": " + r.error);
              }
            });
          }, "New file");
        case this.name + "-rm":
          if (!file) {
            return;
          }
          return this.openDialog("YesNoDialog", function(d) {
            if (!d) {
              return;
            }
            return file.path.asFileHandler().remove(function(r) {
              if (r.error) {
                return me.error("Fail to delete " + file.filename + ": " + r.error);
              }
            });
          }, "Delete", {
            iconclass: "fa fa-question-circle",
            text: "Do you really want to delete: " + file.filename + " ?"
          });
        case this.name + "-refresh":
          return this.chdir(this.fileview.get("path"));
      }
    };

    NotePad.prototype.save = function(file) {
      var me;
      me = this;
      return file.write(file.getb64("text/plain"), function(d) {
        if (d.error) {
          return me.error("Error saving file " + file.basename);
        }
        file.dirty = false;
        file.text = file.basename;
        return me.tabarea.update();
      });
    };

    NotePad.prototype.findTabByFile = function(file) {
      var d, i, its, lst;
      lst = this.tabarea.get("items");
      its = (function() {
        var j, len, results;
        results = [];
        for (i = j = 0, len = lst.length; j < len; i = ++j) {
          d = lst[i];
          if (d.hash() === file.hash()) {
            results.push(i);
          }
        }
        return results;
      })();
      if (its.length === 0) {
        return -1;
      }
      return its[0];
    };

    NotePad.prototype.closeTab = function(it) {
      var cnt;
      this.tabarea.remove(it, false);
      cnt = this.tabarea.get("count");
      if (cnt === 0) {
        this.open("Untitled".asFileHandler());
        return false;
      }
      this.tabarea.set("selected", cnt - 1);
      return false;
    };

    NotePad.prototype.newtab = function(file) {
      file.text = file.basename ? file.basename : file.path;
      if (!file.cache) {
        file.cache = "";
      }
      file.um = new ace.UndoManager();
      this.currfile.selected = false;
      file.selected = true;
      this.fileview.set("preventUpdate", true);
      return this.tabarea.push(file, true);
    };

    NotePad.prototype.selecteTab = function(i) {
      var file, m;
      file = (this.tabarea.get("items"))[i];
      if (!file) {
        return;
      }
      this.scheme.set("apptitle", file.text.toString());
      if (this.currfile !== file) {
        this.currfile.cache = this.editor.getValue();
        this.currfile.cursor = this.editor.selection.getCursor();
        this.currfile = file;
      }
      m = "ace/mode/text";
      if (file.path.toString() !== "Untitled") {
        m = this.modes.getModeForPath(file.path);
      }
      this.mlist.set("selected", m.idx);
      this.editormux = true;
      this.editor.setValue(file.cache, -1);
      this.editor.session.setMode(m.mode);
      this.editor.session.setUndoManager(file.um);
      if (file.cursor) {
        this.editor.renderer.scrollCursorIntoView({
          row: file.cursor.row,
          column: file.cursor.column
        }, 0.5);
        this.editor.selection.moveTo(file.cursor.row, file.cursor.column);
      }
      return this.editor.focus();
    };

    NotePad.prototype.chdir = function(pth) {
      var dir, me;
      if (!pth) {
        return;
      }
      me = this;
      dir = pth.asFileHandler();
      return dir.read(function(d) {
        var p;
        if (d.error) {
          return me.error("Resource not found " + p);
        }
        if (!dir.isRoot()) {
          p = dir.parent().asFileHandler();
          p.filename = "[..]";
          p.type = "dir";
          d.result.unshift(p);
        }
        ($(me.navinput)).val(dir.path);
        me.fileview.set("path", pth);
        return me.fileview.set("data", d.result);
      });
    };

    NotePad.prototype.menu = function() {
      var me, menu;
      me = this;
      menu = [
        {
          text: "File",
          child: [
            {
              text: "Open",
              dataid: this.name + "-Open",
              shortcut: "A-O"
            }, {
              text: "Save",
              dataid: this.name + "-Save",
              shortcut: "C-S"
            }, {
              text: "Save as",
              dataid: this.name + "-Saveas",
              shortcut: "M-S"
            }
          ],
          onmenuselect: function(e) {
            return me.actionFile(e.item.data.dataid);
          }
        }
      ];
      return menu;
    };

    NotePad.prototype.actionFile = function(e) {
      var me, saveas;
      me = this;
      saveas = function() {
        return me.openDialog("FileDiaLog", function(d, n) {
          me.currfile.setPath(d + "/" + n);
          return me.save(me.currfile);
        }, "Save as", {
          file: me.currfile
        });
      };
      switch (e) {
        case this.name + "-Open":
          return this.openDialog("FileDiaLog", function(d, f) {
            return me.open((d + "/" + f).asFileHandler());
          }, "Open file");
        case this.name + "-Save":
          this.currfile.cache = this.editor.getValue();
          if (this.currfile.basename) {
            return this.save(this.currfile);
          }
          return saveas();
        case this.name + "-Saveas":
          this.currfile.cache = this.editor.getValue();
          return saveas();
      }
    };

    NotePad.prototype.cleanup = function(evt) {
      var dirties, me, v;
      dirties = (function() {
        var j, len, ref, results;
        ref = this.tabarea.get("items");
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          v = ref[j];
          if (v.dirty) {
            results.push(v);
          }
        }
        return results;
      }).call(this);
      if (dirties.length === 0) {
        return;
      }
      me = this;
      evt.preventDefault();
      return this.openDialog("YesNoDialog", function(d) {
        var j, len;
        if (d) {
          for (j = 0, len = dirties.length; j < len; j++) {
            v = dirties[j];
            v.dirty = false;
          }
          return me.quit();
        }
      }, "Quit", {
        text: "Ignore all " + dirties.length + " unsaved files ?"
      });
    };

    return NotePad;

  })(this.OS.GUI.BaseApplication);

  NotePad.singleton = false;

  NotePad.dependencies = ["ace/ace", "ace/ext-language_tools", "ace/ext-modelist", "ace/ext-themelist"];

  this.OS.register("NotePad", NotePad);

}).call(this);

