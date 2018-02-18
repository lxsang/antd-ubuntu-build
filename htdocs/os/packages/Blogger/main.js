// Generated by CoffeeScript 1.9.3
(function() {
  var BloggerCVSectionDiaglog, BloggerCategoryDialog,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BloggerCategoryDialog = (function(superClass) {
    extend(BloggerCategoryDialog, superClass);

    function BloggerCategoryDialog() {
      BloggerCategoryDialog.__super__.constructor.call(this, "BloggerCategoryDialog", {
        tags: [
          {
            tag: "afx-label",
            att: "data-height = '20', text = 'Pick a parent:'"
          }, {
            tag: "afx-tree-view"
          }, {
            tag: "afx-label",
            att: "data-height = '20', text = 'Category name:'"
          }, {
            tag: "input",
            att: "type = 'text' data-height = '20'"
          }
        ],
        width: 200,
        height: 300,
        resizable: true,
        buttons: [
          {
            label: "0k",
            onclick: function(d) {
              var sel, val;
              sel = (d.find("content1")).get("selectedItem");
              if (!sel) {
                return d.notify("Please select a parent category");
              }
              val = (d.find("content3")).value;
              if (val === "") {
                return d.notify("Please enter category name");
              }
              if (d.data.cat && d.data.cat.id === sel.id) {
                return d.notify("Parent can not be the category itself");
              }
              if (d.handler) {
                d.handler({
                  p: sel,
                  value: val
                });
              }
              return d.quit();
            }
          }, {
            label: "Cancel",
            onclick: function(d) {
              return d.quit();
            }
          }
        ],
        filldata: function(d) {
          var it, tree;
          if (!d.data) {
            return;
          }
          tree = d.find("content1");
          if (d.data.tree) {
            tree.set("data", d.data.tree);
          }
          if (d.data.cat) {
            it = (tree.find("id", d.data.cat.pid))[0];
            tree.set("selectedItem", it);
            return (d.find("content3")).value = d.data.cat.name;
          }
        },
        xtra: function(d) {
          return $(d.find("content3")).keyup(function(e) {
            if (e.which === 13) {
              return (d.find("bt0")).trigger();
            }
          });
        }
      });
    }

    return BloggerCategoryDialog;

  })(this.OS.GUI.BasicDialog);

  this.OS.register("BloggerCategoryDialog", BloggerCategoryDialog);

  BloggerCVSectionDiaglog = (function(superClass) {
    extend(BloggerCVSectionDiaglog, superClass);

    function BloggerCVSectionDiaglog() {
      BloggerCVSectionDiaglog.__super__.constructor.call(this, "BloggerCVSectionDiaglog");
    }

    BloggerCVSectionDiaglog.prototype.init = function() {
      return this.render((this.path()) + "/cvsection.html");
    };

    BloggerCVSectionDiaglog.prototype.main = function() {
      var i, inputs, len, me, v;
      me = this;
      this.scheme.set("apptitle", this.title);
      inputs = me.select("[input-class='user-input']");
      if (me.data) {
        for (i = 0, len = inputs.length; i < len; i++) {
          v = inputs[i];
          ($(v)).val(me.data[v.name]);
        }
      }
      return (this.find("bt-cv-sec-save")).set("onbtclick", function(e) {
        var data, j, len1;
        data = {};
        console.log(inputs);
        for (j = 0, len1 = inputs.length; j < len1; j++) {
          v = inputs[j];
          data[v.name] = ($(v)).val();
        }
        if (data.title === "") {
          return me.notify("Title must not be blank");
        }
        if (data.content === "") {
          return me.notify("Content must not be blank");
        }
        if (me.data && me.data.id) {
          data.id = me.data.id;
        }
        if (me.handler) {
          me.handler(data);
        }
        return me.quit();
      });
    };

    return BloggerCVSectionDiaglog;

  })(this.OS.GUI.BaseDialog);

  this.OS.register("BloggerCVSectionDiaglog", BloggerCVSectionDiaglog);

}).call(this);

// Generated by CoffeeScript 1.9.3
(function() {
  var Blogger,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Blogger = (function(superClass) {
    extend(Blogger, superClass);

    function Blogger(args) {
      Blogger.__super__.constructor.call(this, "Blogger", args);
    }

    Blogger.prototype.main = function() {
      var me;
      me = this;
      this.tabbar = this.find("tabbar");
      this.containers = [this.find("user-container"), this.find("cv-container"), this.find("blog-container")];
      this.user = {};
      this.cvlist = this.find("cv-list");
      this.cvlist.set("ontreeselect", function(d) {
        return me.CVSectionByCID(Number(d.id));
      });
      this.inputtags = this.find("input-tags");
      this.bloglist = this.find("blog-list");
      this.userdb = new this._api.DB("user");
      this.cvcatdb = new this._api.DB("cv_cat");
      this.cvsecdb = new this._api.DB("cv_sections");
      this.blogdb = new this._api.DB("blogs");
      this.tabbar.set("onlistselect", function(e) {
        var el, i, len, ref;
        ref = me.containers;
        for (i = 0, len = ref.length; i < len; i++) {
          el = ref[i];
          ($(el)).hide();
        }
        me.fetchData(e.idx);
        ($(me.containers[e.idx])).show();
        return me.trigger("calibrate");
      });
      this.tabbar.set("items", [
        {
          iconclass: "fa fa-user-circle",
          selected: true
        }, {
          iconclass: "fa fa-info-circle"
        }, {
          iconclass: "fa fa-book"
        }
      ]);
      (this.find("bt-user-save")).set("onbtclick", function(e) {
        return me.saveUser();
      });
      (this.find("cv-cat-add")).set("onbtclick", function(e) {
        return me.openDialog("BloggerCategoryDialog", function(d) {
          var c;
          c = {
            name: d.value,
            pid: d.p.id,
            publish: 1
          };
          return me.cvcatdb.save(c, function(r) {
            if (r.error) {
              me.error("Cannot add new category");
            }
            return me.refreshCVCat();
          });
        }, "Add category", {
          tree: me.cvlist.get("data")
        });
      });
      (this.find("cv-cat-edit")).set("onbtclick", function(e) {
        var cat;
        cat = me.cvlist.get("selectedItem");
        if (!cat) {
          return;
        }
        return me.openDialog("BloggerCategoryDialog", function(d) {
          var c;
          c = {
            id: cat.id,
            publish: cat.publish,
            pid: d.p.id,
            name: d.value
          };
          return me.cvcatdb.save(c, function(r) {
            if (r.error) {
              return me.error("Cannot Edit category");
            }
            return me.refreshCVCat();
          });
        }, "Edit category", {
          tree: me.cvlist.get("data"),
          cat: cat
        });
      });
      (this.find("cv-cat-del")).set("onbtclick", function(e) {
        var cat;
        cat = me.cvlist.get("selectedItem");
        if (!cat) {
          return;
        }
        return me.openDialog("YesNoDialog", function(d) {
          if (!d) {
            return;
          }
          return console.log("delete all child + theirs content");
        }, "Delete cagegory", {
          iconclass: "fa fa-question-circle",
          text: "Do you really want to delete: " + cat.name + " ?"
        });
      });
      (this.find("cv-sec-add")).set("onbtclick", function(e) {
        var cat;
        cat = me.cvlist.get("selectedItem");
        if (!(cat && cat.id !== 0)) {
          return me.notify("Please select a category");
        }
        return me.openDialog("BloggerCVSectionDiaglog", function(d) {
          d.cid = Number(cat.id);
          d.start = Number(d.start);
          d.end = Number(d.end);
          d.publish = 1;
          return me.cvsecdb.save(d, function(r) {
            if (r.error) {
              return me.error("Cannot save section: " + r.error);
            }
            return me.CVSectionByCID(Number(cat.id));
          });
        }, "New section entry for " + cat.name, null);
      });
      (this.find("cv-sec-edit")).set("onbtclick", function(e) {
        var sec;
        sec = (me.find("cv-sec-list")).get("selected");
        if (!sec) {
          return me.notify("Please select a section to edit");
        }
        return me.openDialog("BloggerCVSectionDiaglog", function(d) {
          d.cid = Number(sec.cid);
          d.start = Number(d.start);
          d.end = Number(d.end);
          d.publish = Number(sec.publish);
          return me.cvsecdb.save(d, function(r) {
            if (r.error) {
              return me.error("Cannot save section: " + r.error);
            }
            console.log(d.cid);
            return me.CVSectionByCID(Number(sec.cid));
          });
        }, "Modify section entry", sec);
      });
      this.editor = new SimpleMDE({
        element: me.find("markarea"),
        autofocus: true,
        tabSize: 4,
        indentWithTabs: true,
        toolbar: [
          {
            name: "new",
            className: "fa fa-file",
            action: function(e) {
              me.bloglist.set("selected", -1);
              me.editor.value("");
              return me.inputtags.value = "";
            }
          }, {
            name: "save",
            className: "fa fa-save",
            action: function(e) {
              return me.saveBlog();
            }
          }, "|", "bold", "italic", "heading", "|", "quote", "code", "unordered-list", "ordered-list", "|", "link", "image", "table", "horizontal-rule", {
            name: "image",
            className: "fa fa-file-image-o",
            action: function(e) {
              return me.openDialog("FileDiaLog", function(d, n) {
                var doc;
                doc = me.editor.codemirror.getDoc();
                return doc.replaceSelection("![](" + me._api.handler.get + "/" + d + "/" + n + ")");
              }, "Select image file", {
                mimes: ["image/.*"]
              });
            }
          }, "|", {
            name: "preview",
            className: "fa fa-eye no-disable",
            action: function(e) {
              me.previewOn = !me.previewOn;
              return SimpleMDE.togglePreview(e);
            }
          }
        ]
      });
      this.bloglist.set("onlistselect", function(e) {
        var sel;
        sel = me.bloglist.get("selected");
        if (!sel) {
          return;
        }
        me.editor.value(sel.content);
        return me.inputtags.value = sel.tags;
      });
      return this.on("vboxchange", function() {
        return me.resizeContent();
      });
    };

    Blogger.prototype.fetchData = function(idx) {
      var me;
      me = this;
      switch (idx) {
        case 0:
          return this.userdb.get(null, function(d) {
            var i, inputs, len, results, v;
            if (d.error) {
              return me.error("Cannot fetch user data");
            }
            me.user = d.result[0];
            inputs = me.select("[input-class='user-input']");
            results = [];
            for (i = 0, len = inputs.length; i < len; i++) {
              v = inputs[i];
              results.push(($(v)).val(me.user[v.name]));
            }
            return results;
          });
        case 1:
          return this.refreshCVCat();
        default:
          return this.loadBlogs();
      }
    };

    Blogger.prototype.saveUser = function() {
      var i, inputs, len, me, v;
      me = this;
      inputs = this.select("[input-class='user-input']");
      for (i = 0, len = inputs.length; i < len; i++) {
        v = inputs[i];
        this.user[v.name] = ($(v)).val();
      }
      if (!this.user.fullname || this.user.fullname === "") {
        return this.notify("Full name must be entered");
      }
      return this.userdb.save(this.user, function(r) {
        if (r.error) {
          return me.error("Cannot save user data");
        }
        return me.notify("User data updated");
      });
    };

    Blogger.prototype.refreshCVCat = function() {
      var data, me;
      me = this;
      data = {
        name: "Porfolio",
        id: 0,
        nodes: []
      };
      return this.cvcatdb.get(null, function(d) {
        if (d.error) {
          me.cvlist.set("data", data);
          return me.notify("Cannot fetch CV categories");
        }
        me.fetchCVCat(d.result, data, "0");
        return me.cvlist.set("data", data);
      });
    };

    Blogger.prototype.fetchCVCat = function(table, data, id) {
      var i, len, result, results, v;
      result = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = table.length; i < len; i++) {
          v = table[i];
          if (v.pid === id) {
            results.push(v);
          }
        }
        return results;
      })();
      if (result.length === 0) {
        return data.nodes = null;
      }
      results = [];
      for (i = 0, len = result.length; i < len; i++) {
        v = result[i];
        v.nodes = [];
        this.fetchCVCat(table, v, v.id);
        results.push(data.nodes.push(v));
      }
      return results;
    };

    Blogger.prototype.CVSectionByCID = function(cid) {
      var cond, me;
      me = this;
      cond = {
        exp: {
          "=": {
            cid: cid
          }
        },
        order: {
          start: "DESC"
        }
      };
      return this.cvsecdb.find(cond, function(d) {
        var el, i, items, j, len, len1, ref, ref1, v;
        if (d.error) {
          return me.notify("Section list is empty, please add one");
        }
        ref = d.result;
        for (i = 0, len = ref.length; i < len; i++) {
          v = ref[i];
          v.text = v.title;
        }
        items = [];
        $(me.find("cv-sec-status")).html("Found " + d.result.length + " sections");
        ref1 = d.result;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          v = ref1[j];
          v.text = v.title;
          v.complex = true;
          v.start = Number(v.start);
          v.end = Number(v.end);
          v.detail = [];
          if (v.subtitle !== "") {
            v.detail.push({
              text: v.subtitle,
              "class": "cv-subtitle"
            });
          }
          if (v.start !== 0 && v.end !== 0) {
            v.detail.push({
              text: v.start + " - " + v.end,
              "class": "cv-period"
            });
          }
          if (v.location !== "") {
            v.detail.push({
              text: v.location,
              "class": "cv-loc"
            });
          }
          v.closable = true;
          v.detail.push({
            text: v.content,
            "class": "cv-content"
          });
          items.push(v);
        }
        el = me.find("cv-sec-list");
        el.set("onitemclose", function(e) {
          me.openDialog("YesNoDialog", function(b) {
            if (!b) {
              return;
            }
            return me.cvsecdb["delete"](e.item.item.id, function(r) {
              if (r.error) {
                return me.error("Cannot delete the section: " + r.error);
              }
              return el.remove(e.item.item, true);
            });
          }, "Delete section", {
            iconclass: "fa fa-question-circle",
            text: "Do you really want to delete: " + e.item.item.text + " ?"
          });
          return false;
        });
        return el.set("items", items);
      });
    };

    Blogger.prototype.saveBlog = function() {
      var content, d, data, me, sel, tags, title;
      me = this;
      sel = this.bloglist.get("selected");
      tags = this.inputtags.value;
      content = this.editor.value();
      title = (new RegExp("^#+(.*)\n", "g")).exec(content);
      if (!(title && title.length === 2)) {
        return this.notify("Please insert a title in the text: beginning with heading");
      }
      if (tags === "") {
        return this.notify("Please enter tags");
      }
      d = new Date();
      data = {
        content: content,
        title: title[1].trim(),
        tags: tags,
        ctime: sel ? sel.ctime : d.timestamp(),
        ctimestr: sel ? sel.ctimestr : d.toString(),
        utime: d.timestamp(),
        utimestr: d.toString()
      };
      if (sel) {
        data.id = sel.id;
      }
      return this.blogdb.save(data, function(r) {
        if (r.error) {
          return me.error("Cannot save blog: " + r.error);
        }
        return me.loadBlogs();
      });
    };

    Blogger.prototype.loadBlogs = function() {
      var me;
      me = this;
      return this.blogdb.get(null, function(r) {
        var i, len, ref, v;
        if (r.error) {
          return me.notify("No post found: " + r.error);
        }
        ref = r.result;
        for (i = 0, len = ref.length; i < len; i++) {
          v = ref[i];
          v.text = v.title;
          v.complex = true;
          v.closable = true;
          v.content = v.content.unescape();
          v.detail = [
            {
              text: "Created: " + v.ctimestr,
              "class": "blog-dates"
            }, {
              text: "Updated: " + v.utimestr,
              "class": "blog-dates"
            }
          ];
        }
        me.bloglist.set("onitemclose", function(e) {
          me.openDialog("YesNoDialog", function(b) {
            if (!b) {
              return;
            }
            return me.blogdb["delete"](e.item.item.id, function(r) {
              if (r.error) {
                return me.error("Cannot delete: " + r.error);
              }
              me.bloglist.remove(e.item.item, true);
              me.bloglist.set("selected", -1);
              me.editor.value("");
              return me.inputtags.value = "";
            });
          }, "Delete a post", {
            iconclass: "fa fa-question-circle",
            text: "Do you really want to delete this post ?"
          });
          return false;
        });
        return me.bloglist.set("items", r.result);
      });
    };

    Blogger.prototype.resizeContent = function() {
      var cheight, children, container, statusbar, titlebar, toolbar;
      container = this.find("editor-container");
      children = ($(container)).children();
      titlebar = (($(this.scheme)).find(".afx-window-top"))[0];
      toolbar = children[1];
      statusbar = children[4];
      cheight = ($(this.scheme)).height() - ($(titlebar)).height() - ($(toolbar)).height() - ($(statusbar)).height() - 90;
      return ($(children[2])).css("height", cheight + "px");
    };

    return Blogger;

  })(this.OS.GUI.BaseApplication);

  Blogger.singleton = true;

  Blogger.dependencies = ["mde/simplemde.min"];

  this.OS.register("Blogger", Blogger);

}).call(this);

