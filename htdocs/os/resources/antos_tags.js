<afx-app-window ref = "window" >
    <div   class = "afx-window-wrapper">
        <ul class= "afx-window-top" >
            <li class = "afx-window-close" onclick = {close}></li>
             <li if = {minimizable == true} class = "afx-window-minimize" onclick = {minimize}></li>
             <li if = {resizable == true} class = "afx-window-maximize" onclick={maximize}></li>
             <li  ref = "dragger" class = "afx-window-title">{ apptitle }</li>
        </ul>
        <div class = "afx-clear"></div>
        <div ref = "content" class = "afx-window-content">
            <yield/>
        </div>
        <div if = {resizable == true} ref = "grip" class = "afx-window-grip">
    </div>

    <script>
        this.apptitle = opts.apptitle || ""
        this.minimizable = eval(opts.minimizable) || true
        this.resizable = eval(opts.resizable) || true
        var self = this
        var offset = {top:0,left:0}
        var desktop_pos = $("#desktop").offset()
        var isMaxi = false
        var history = {}
        var width = opts.width || 400
        var height = opts.height || 300
        this.root.observable = opts.observable || riot.observable()
        if(!window._zindex) window._zindex = 10
        this.shown = false

        self.root.contextmenuHandler = function (e) {}

        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        minimize()
        {
            this.root.observable.trigger("hide")
        }
        close()
        {
            this.root.observable.trigger("exit")
        }
        this.on('mount', function() {
            var left,top 
            //left = 20 + Math.floor(Math.random() *  ($("#desktop").width()  - width))
            //top = 20 + Math.floor(Math.random() *  ($("#desktop").height() - height))
            left = ($("#desktop").width()  - width)/2
            top = ($("#desktop").height() - height)/2
            $(self.refs.window)
                .css("position",'absolute')
                .css("left",left + "px")
                .css("top",top + "px")
                .css("width",width + "px")
                .css("height", height + "px")
                .css("z-index",window._zindex++)
            $(self.refs.window).on("mousedown", function(e){
                if(self.shown == false)
                    self.root.observable.trigger("focus")
            })
            $(self.refs.window).click(function(e) {
                //e.stopPropagation()
                //e.windowactive = true
                //self.root.observable.trigger("windowselect")
            })
            enable_dragging()
            if(self.resizable)
                enable_resize()
            $(self.refs.dragger).dblclick(function(e){
                toggle_window()
            })
            $(self.refs.content).children().each(function(e){
                this.observable = self.root.observable
            })
            var fn = function()
            {
                var ch = $(self.refs.content).height()/ $(self.refs.content).children().length
                $(self.refs.content).children().each(function(e){
                    $(this).css("height",ch+"px")
                })
            }
            fn()
            self.root.observable.on("resize", function(){ fn()})
            self.root.observable.on("focus",function(){
                window._zindex++
                $(self.refs.window)
                    .show()
                    .css("z-index",window._zindex)
                    .removeClass("unactive")

                self.shown = true
            })
            self.root.observable.on("blur", function(){
                self.shown = false
                $(self.refs.window)
                    .addClass("unactive")
                // add css to blur app :)
            })
            self.root.observable.on("hide", function()
            {
                $(self.refs.window).hide()
                self.shown = false
            })

            self.root.observable.on("toggle", function(){
                if(self.shown)
                    self.root.observable.trigger("hide")
                else 
                    self.root.observable.trigger("focus")
            })
            self.root.observable.trigger("rendered", self.root)
        })
        var enable_dragging = function()
        {
            $(self.refs.dragger)
                .css("user-select","none")
                .css("cursor","default")
            $(self.refs.dragger).on("mousedown", function(e){
                e.preventDefault()
                offset = $(self.refs.window).offset()
                offset.top = e.clientY - offset.top
                offset.left = e.clientX - offset.left
                $(window).on("mousemove", function(e){
                    var top,left
                    if(isMaxi)
                    {
                        toggle_window()
                        top = 0
                        letf = e.clientX - $(self.refs.window).width()/2
                        offset.top = 10 //center
                        offset.left = $(self.refs.window).width()/2
                    } else
                    {
                        top  = e.clientY - offset.top - desktop_pos.top
                        left = e.clientX - desktop_pos.top - offset.left
                        left = left < 0?0:left;
                        top = top < 0?0:top;
                    }
                    
                    $(self.refs.window).css("top", top +"px")
                    .css("left",left + "px")
                })
                $(window).on("mouseup", function(e){
                    //console.log("unbind mouse up")
                    $(window).unbind("mousemove", null)
                })
            })
        }

        var enable_resize = function()
        {
            if(!self.resizable) return
            $(self.refs.grip)
                .css("user-select","none")
                .css("cursor","default")
                .css("position","absolute")
                .css("bottom","0")
                .css("right","0")
                .css("cursor","nwse-resize")
            $(self.refs.grip).on("mousedown", function(e){
                e.preventDefault()
                offset.top = e.clientY
                offset.left = e.clientX
                $(window).on("mousemove", function(e){
                    var w,h
                    w  = $(self.refs.window).width() + e.clientX - offset.left
                    h  = $(self.refs.window).height() + e.clientY - offset.top
                    w  = w < 100 ? 100:w 
                    h = h < 100 ?100:h
                    offset.top = e.clientY
                    offset.left = e.clientX
                    $(self.refs.window)
                        .css("width", w +"px")
                        .css("height",h + "px")
                    isMaxi = false
                    self.root.observable.trigger('resize',
                        {id:$(self.root).attr("data-id"),w:w,h:h})
                })
                $(window).on("mouseup", function(e){
                    $(window).unbind("mousemove", null)
                })
            })
        }

        var toggle_window = function()
        {
            if(!self.resizable) return
            if(isMaxi == false)
            {
                history = {
                    top: $(self.refs.window).css("top"),
                    left:$(self.refs.window).css("left"),
                    width:$(self.refs.window).css("width"),
                    height:$(self.refs.window).css("height")
                }
                var w,h 
                w = ($("#desktop").width() - 5)
                h = ($("#desktop").height() - 10)
                $(self.refs.window)
                    .css("width", w + "px")
                    .css("height", h + "px")
                    .css("top","0").css("left","0")
                self.root.observable.trigger('resize',
                    {id:$(self.root).attr("data-id"),w:w,h:h})
                isMaxi = true
            }
            else
            {
                isMaxi = false
                $(self.refs.window)
                    .css("width",history.width)
                    .css("height",history.height)
                    .css("top",history.top).css("left",history.left)
                self.root.observable.trigger('resize',
                    {id:$(self.root).attr("data-id"),w:history.width,h:history.height} )
            }
            
        }
        maximize()
        {
            toggle_window()
        }
    </script>
</afx-app-window>
<afx-apps-dock>
    <afx-button class = {selected: parent.selectedApp && app.pid == parent.selectedApp.pid} each={ items } icon = {icon} text = {text} onbtclick = {onbtclick}>
    </afx-button>
    <script>
        this.items = opts.items || []
        var self = this
        self.selectedApp = null
        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
            {
                self[k] = v
                if(k == "selectedApp")
                { 
                    for(var i in self.items)
                        self.items[i].app.blur()
                    if(v)
                        $("#desktop")[0].set("selected", -1)
                }
            }
            self.update()
        }
        self.root.newapp = function(i)
        {
            self.items.push(i)
            self.selectedApp = i.app
            self.update()
            for(var i in self.items)
                self.items[i].app.blur()
        }
    
        self.root.removeapp = function(a)
        {
            var i = -1;
            for(var k in self.items)
                if(self.items[k].app.pid == a.pid)
                {
                    i = k; break;
                }
            if(i != -1)
            {
                delete self.items[i].app
                self.items.splice(i,1)
                
                self.update()
            }
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        this.on("mount", function(){
            window.OS.courrier.trigger("sysdockloaded")
        })
        
    </script>
</afx-apps-dock>
<afx-button>
    <button disabled={ enable == "false" } onclick="{ _onbtclick }" ref = "mybtn" > 
        <afx-label color = {color} icon={icon} iconclass = {iconclass} text = {text} ></afx-label>
    </button>
    <script>
        this.enable = opts.enable
        this.icon = opts.icon
        this.iconclass = opts.iconclass
        this.color = opts.color
        this.text = opts.text || ""
        var self = this
        this.onbtclick = opts.onbtclick
        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        self.root.trigger = function()
        {
            $(self.refs.mybtn).trigger("click")
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        this._onbtclick = function(e)
        {
            if(typeof self.onbtclick == 'string')
                eval(self.onbtclick)
            else if(self.onbtclick)
                self.onbtclick(e)
            if(self.root.observable)
            {
                self.root.observable.trigger("btclick",{id:$(self.root).attr("data-id"),data:self.root})
            }
        }
    </script>
</afx-button>
<afx-calendar-view>
    <div><i class ="prevmonth" onclick={prevmonth}></i>{text}<i onclick={nextmonth} class="nextmonth"></i></div>
    <afx-grid-view data-id ={"grid_" + rid}  style = "height:100%;" ref = "grid"  header = {header}> </afx-grid-view>

    <script >
    this.header = [{value:"Sun"},{value:"Mon"},{value:"Tue"},{value:"Wed"},{value:"Thu"},{value:"Fri"},{value:"Sat"}]
    this.root.observable = opts.observable
    var self = this
    this.day = 0
    this.month = 0
    this.year = 0
    this.ondayselect = opts.ondayselect
    this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
    this.selectedDate = undefined
    self.root.get = function(k)
    {
        return self[k]
    }

    this.on("mount", function (e) { 
        self.refs.grid.root.observable = self.root.observable
        calendar(null)
        self.root.observable.on("gridcellselect", function(d){
            if(d.id != "grid_" + self.rid) return
            if(d.data.value == "") return
            var data = {id:self.rid, data:new Date(self.year, self.month,d.data.value)};
            if(self.ondayselect)
                self.ondayselect(data)
            self.selectedDate = data.data
            self.root.observable.trigger("dayselect",data)
        })
    })
    prevmonth()
    {
        self.selectedDate = undefined
        this.month--
        if(this.month < 0) 
        {
            this.month = 11
            this.year--
        }
        calendar(new Date(this.year, this.month,1))
    }
    nextmonth()
    {
        self.selectedDate = undefined
        this.month++
        if(this.month > 11)
        {
            this.month = 0
            this.year++
        }
        calendar(new Date(this.year, this.month,1))
    }
    var calendar = function (date) {
        
        if (date === null)
            date = new Date()

        self.day = date.getDate()
        self.month = date.getMonth()
        self.year = date.getFullYear()

        var now ={ d:(new Date()).getDate(), m:(new Date()).getMonth(), y:(new Date()).getFullYear()}
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        this_month = new Date(self.year, self.month, 1)
        next_month = new Date(self.year, self.month + 1, 1)

        // Find out when this month starts and ends.
        first_week_day = this_month.getDay()
        days_in_this_month = Math.round((next_month.getTime() - this_month.getTime()) / (1000 * 60 * 60 * 24))
        self.text = months[self.month] + ' ' + self.year
        var rows = []
        var row = []
        // Fill the first week of the month with the appropriate number of blanks.
        for (week_day = 0; week_day < first_week_day; week_day++)
            row.push({value:""})

        week_day = first_week_day;
        for (day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
            week_day %= 7
            if (week_day == 0)
            {
                rows.push(row)
                row =[]
            }   

            // Do something different for the current day.
            
            if (now.d == day_counter && self.month == now.m && self.year == now.y)
                row.push({value:day_counter, selected:true})
            else 
                row.push({value:day_counter})
           
            week_day++;
        }
        for(var i = 0; i <= 7 - row.length;i++)
            row.push({value:""})
        rows.push(row)
        self.refs.grid.root.set("rows",rows)
    } 
</script> 
</afx-calendar-view>
<afx-color-picker>
<div style = "width:310px; height:190px;display:block; padding:3px;">
    <canvas class = "color-palette" width="284" height="155" style ="float:left;" ref = "palette" ></canvas>
    <div class = "color-sample"  style= "width:15px; height:155px; text-align:center; margin-left:3px; display:block;float:left;" ref = "colorval"></div>
    <div class = "afx-clear"></div>
    <div style ="margin-top:3px;"> 
        <span>Hex:</span><input type = "text" ref = "hextext" style = "width:70px; margin-left:3px;margin-right:5px;"></input>
        <span ref = 'rgbtext'></span>
    </div>
</div>
<script>
    var self = this
    var colorctx = undefined
    self.root.observable = opts.observable
    self.oncolorsetect = opts.oncolorsetect
    self.selectedColor = undefined
    self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
    self.root.get = function(k)
    {
        return self[k]
    }

    var build_palette = function()
    {
        colorctx = $(self.refs.palette).get(0).getContext('2d')
        var gradient = colorctx.createLinearGradient(0,0,$(self.refs.palette).width(),0)
        // fill color
        gradient.addColorStop(0,    "rgb(255,   0,   0)")
        gradient.addColorStop(0.15, "rgb(255,   0, 255)")
        gradient.addColorStop(0.33, "rgb(0,     0, 255)")
        gradient.addColorStop(0.49, "rgb(0,   255, 255)")
        gradient.addColorStop(0.67, "rgb(0,   255,   0)")
        gradient.addColorStop(0.84, "rgb(255, 255,   0)")
        gradient.addColorStop(1,    "rgb(255,   0,   0)")
        gradient.addColorStop(0,    "rgb(0,   0,   0)")
        // Apply gradient to canvas
        colorctx.fillStyle = gradient;
        colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height)
        
        // Create semi transparent gradient (white -> trans. -> black)
        gradient = colorctx.createLinearGradient(0, 0, 0, $(self.refs.palette).width())
        gradient.addColorStop(0,   "rgba(255, 255, 255, 1)")
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)")
        gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)")
        gradient.addColorStop(1,   "rgba(0,     0,   0, 1)")
        // Apply gradient to canvas
        colorctx.fillStyle = gradient
        colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height)
        //$(self.refs.palette).css("position", "absolute")
        // now add mouse move event
        var getHex = function(c)
        {
            s = c.toString(16)
            if(s.length == 1) s = "0" + s
            return s
        }
        var pick_color = function(e)
        {
            $(self.refs.palette).css("cursor","crosshair")
            var offset = $(self.refs.palette).offset()
            var x = e.pageX - offset.left
            var y = e.pageY - offset.top
            var color = colorctx.getImageData(x,y, 1, 1)
            var data = {
                r:color.data[0],
                g:color.data[1],
                b:color.data[2],
                text:'rgb(' + color.data[0] + ', ' + color.data[1] + ', ' + color.data[2] + ')',
                hex:'#' + getHex(color.data[0]) + getHex(color.data[1]) + getHex(color.data[2])
            }
            return data
        }
        var mouse_move_h = function(e)
        {
            var data = pick_color(e)
            $(self.refs.colorval).css("background-color", data.text)
        }
        $(self.refs.palette).mouseenter(function(e){
            $(self.refs.palette).on("mousemove",mouse_move_h)
        })
        $(self.refs.palette).mouseout(function(e){
            $(self.refs.palette).unbind("mousemove",mouse_move_h)
            if(self.selectedColor)
                $(self.refs.colorval).css("background-color", self.selectedColor.text)
        })
        $(self.refs.palette).on("click", function(e){
            data = pick_color(e)
            $(self.refs.rgbtext).html(data.text)
            $(self.refs.hextext).val(data.hex)
            self.selectedColor = data
            if(self.oncolorsetect)
                self.oncolorsetect(data)
            if(! self.root.observable) return 
            self.root.observable.trigger("colorselect",data)
        })
    }

    this.on("mount", function(){
        build_palette()
    })
</script>
</afx-color-picker>
<afx-dummy>
    <yield/>
</afx-dummy>
<afx-file-view>
    <afx-list-view  ref="listview"  observable = {root.observable}></afx-list-view>
    <afx-grid-view  ref = "gridview" header = {header}  observable = {root.observable}></afx-grid-view>
    <div class = "treecontainer" ref="treecontainer">
        <afx-tree-view  ref = "treeview" observable = {root.observable}></afx-tree-view>
    </div>
    <div if = {status == true} class = "status" ref = "stbar"></div>
    <script>
        var self = this
        self.root.observable = opts.observable || riot.observable()
        self.view = opts.view || 'list'
        self.data = opts.data || []
        self.path = opts.path || "home:///"
        self.onfileselect
        self.onfileopen
        this.status = opts.status == undefined?true:opts.status
        this.selectedFile = undefined
        this.showhidden = opts.showhidden
        this.fetch = opts.fetch
        this.chdir = opts.chdir
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        this.header = [{value:"File name"},{value: "Type", width:150}, {value: "Size", width:70}]

        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            if(k == 'view')
                switchView()
            if(k == "data")
                self.selectedFile = undefined
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        var sortByType = function(a,b)
        {
            return a.type < b.type ? -1 : ( a.type > b.type ? 1: 0 )
        }
        var calibre_size = function()
        {
            var h = $(self.root).outerHeight()
            var w = $(self.root).width()
            if(self.refs.stbar)
                h -= ($(self.refs.stbar).height() + 10)
            $(self.refs.listview.root).css("height", h + "px")
            $(self.refs.gridview.root).css("height", h + "px")
            $(self.refs.treecontainer).css("height", h + "px")
            $(self.refs.listview.root).css("width", w + "px")
            $(self.refs.gridview.root).css("width", w + "px")
            $(self.refs.treecontainer).css("width", w + "px")
        }
        var refreshList = function(){
            var items = []
            $.each(self.data, function(i, v){
                if(v.filename[0] == '.' && !self.showhidden) return
                v.text = v.filename
                if(v.text.length > 10)
                    v.text = v.text.substring(0,9) + "..."
                v.iconclass = v.iconclass?v.iconclass:v.type
                v.icon = v.icon
                items.push(v)
            })
            self.refs.listview.root.set("items", items)
        }
        var refreshGrid = function(){
            var rows = []
            $.each(self.data, function(i,v){
                if(v.filename[0] == '.' && !self.showhidden) return
                var row = [{value:v.filename, iconclass: v.iconclass?v.iconclass:v.type, icon:v.icon},{value:v.mime},{value:v.size},{idx:i}]
                rows.push(row)
            })
            self.refs.gridview.root.set("rows",rows)
        }
        var refreshTree = function(){
            self.refs.treeview.root.set("selectedItem", null)
            var tdata = {}
            tdata.name = self.path
            tdata.nodes = getTreeData(self.data)
            self.refs.treeview.root.set("data", tdata)
        }
        var getTreeData = function(data)
        {
            nodes = []
            $.each(data, function(i,v){
                if(v.filename[0] == '.' && !self.showhidden) return
                v.name = v.filename
                if(v.type == 'dir')
                {
                    v.nodes = []
                    v.open = false
                }
                v.iconclass = v.iconclass?v.iconclass:v.type
                v.icon = v.icon
                nodes.push(v)
            })
            return nodes
        }
        var refreshData = function(){
            self.data.sort(sortByType)
            if(self.view == "icon")
                refreshList()
            else if(self.view == "list")
                refreshGrid()
            else 
                refreshTree()
        }
        var switchView = function()
        {
            $(self.refs.listview.root).hide()
            $(self.refs.gridview.root).hide()
            $(self.refs.treecontainer).hide()
            self.selectedFile = undefined
            self.refs.listview.root.set("selected", -1)
            self.refs.treeview.selectedItem = undefined
            self.refs.treeview.root.set("fetch",function(e,f){
                if(!self.fetch) return
                self.fetch(e, function(d){
                    f(getTreeData(d))
                })
            })
            $(self.refs.stbar).html("")
            switch (self.view) {
                case 'icon':
                    $(self.refs.listview.root).show()
                    break;
                case 'list':
                    $(self.refs.gridview.root).show()
                    break;
                case 'tree':
                    $(self.refs.treecontainer).show()
                    break;
                default:
                    break;
            }
            calibre_size()
        }
        self.on("updated", function(){
            refreshData()
            calibre_size()
        })
        self.on("mount", function(){
            switchView()
            self.refs.listview.onlistselect = function(data)
            {
                data.id = self.rid
                self.root.observable.trigger("fileselect",data)
            }
            self.refs.listview.onlistdbclick = function(data)
            {
                data.id = self.rid
                self.root.observable.trigger("filedbclick",data)
            }
            self.refs.gridview.root.observable = self.root.observable
            self.refs.gridview.ongridselect = function(d)
            {
                var data = {id:self.rid, data:self.data[d.data.child[3].idx], idx:d.data.child[3].idx}
                self.root.observable.trigger("fileselect",data)
            }
            self.refs.gridview.ongriddbclick = function(d)
            {
                var data = {id:self.rid, data:self.data[d.data.child[3].idx], idx:d.data.child[3].idx}
                self.root.observable.trigger("filedbclick",data)
            }
            self.refs.treeview.ontreeselect = function(d)
            {
                if(!d) return;
                var data;
                var el = d;
                if(d.treepath == 0)// select the root
                {
                    el = self.path.asFileHandler()
                    el.size = 0
                    el.filename = el.path
                }
                var data = {id:self.rid, data:el}
                self.root.observable.trigger("fileselect",data)
            }
            self.refs.treeview.ontreedbclick = function(d)
            {
                if(!d || d.treepath == 0) return;
                var data = {id:self.rid, data:d}
                self.root.observable.trigger("filedbclick",data)
            }
            self.root.observable.on("fileselect", function(e){
                if(e.id != self.rid) return
                self.selectedFile = e.data
                if(self.onfileselect)
                    self.onfileselect(e.data)
                $(self.refs.stbar).empty()
                $(self.refs.stbar).append($("<span>").append("Selected: " + e.data.filename + " (" + e.data.size + " bytes)"))//.html()
            })
            self.root.observable.on("filedbclick", function(e){
                if(e.id != self.rid ) return
                if(e.data.type != "dir" && self.onfileopen)
                    self.onfileopen(e.data)
                else if(self.chdir && e.data.type == "dir")
                    self.chdir(e.data.path)
            })
            calibre_size()
            self.root.observable.on("resize", function(e){
                calibre_size()
            })
            self.root.observable.on("calibrate", function(e){
                calibre_size()
            })
        })
    </script>
</afx-file-view>
<afx-float-list ref = "container">
    <div ref = "list">
        <div each={item,i in items } class={float_list_item:true, float_list_item_selected: parent._autoselect(item,i)} ondblclick = {parent._dbclick}  onmousedown = {parent._select} oncontextmenu = {parent._select}>
            <afx-label color = {item.color} iconclass = {item.iconclass} icon = {item.icon} text = {item.text}></afx-label>
        </div>
    </div>
    <script>
        this.items = opts.items || []
        var self = this
        self.selidx = -1
        self.onlistselect = opts.onlistselect
        self.onlistdbclick = opts.onlistdbclick
        self.fetch = undefined
        this.root.observable = opts.observable || riot.observable()
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        self.dir =  opts.dir || "horizontal"

        self.root.set = function(k,v)
        {
            if(k == "selected")
            {
                if(self.selidx != -1)
                    self.items[self.selidx].selected =false
                if(v == -1)
                    self.selidx = -1
                else
                    if(self.items[v]) self.items[v].selected = true
            }
            else if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            if(k == "selected")
                if(self.selidx == -1)
                    return undefined
                else
                    return self.items[self.selidx]
            return self[k]
        }
        self.root.push = function(e,u)
        {
            self.items.push(e)
            if(u) self.update()
        }
        self.root.unshift = function(e,u)
        {
            self.items.unshift(e)
            if(u) self.update()
        }
        self.root.remove = function(e,u)
        {
            var i = self.items.indexOf(e)
            if(i >= 0)
            {
                if(self.selidx != -1)
                {
                    self.items[self.selidx].selected =false
                    self.selidx = -1
                }
                self.items.splice(i, 1)
                if(u)
                    self.update()
            }
        }

        self.root.refresh = function()
        {
            _refresh()
        }

        this.on("mount", function(){
            if(self.root.ready)
                self.root.ready(self.root)
            // now refresh the list
            _refresh()  
        })

        var _refresh = function()
        {
            var ctop = 20
            var cleft = 20
            var gw = $(self.refs.container).width()
            var gh = $(self.refs.container).height()
            $(self.refs.list)
            .children()
            .each(function(e)
            {
                $(this).unbind("mousedown")
                _enable_drag($(this))
                var w = $(this).width()
                var h = $(this).height()
                $(this).css("top", ctop + "px").css("left", cleft + "px")
                if(self.dir == "horizontal")
                {
                    ctop += h + 20
                    if(ctop > gh)
                    {
                        ctop = 20
                        cleft += w + 20
                    } 
                }
                else
                {
                    cleft += w + 20
                    if(cleft > gw )
                    {
                        cleft = 20
                        ctop += h + 20
                    }
                }
            })
        }

        var _enable_drag = function(el)
        {
            var globalof = $(self.refs.container).offset()
            el
                .css("user-select","none")
                .css("cursor","default")
                .css("position",'absolute')
                .on("mousedown", function(e){
                    e.preventDefault()
                    offset = el.offset()
                    offset.top = e.clientY - offset.top
                    offset.left = e.clientX - offset.left
                    $(window).on("mousemove", function(e){
                        var top,left
                        top  = e.clientY - offset.top - globalof.top
                        left = e.clientX - globalof.top - offset.left
                        left = left < 0?0:left
                        top = top < 0?0:top
                        el.css("top", top +"px").css("left",left + "px")
                    })
                    $(window).on("mouseup", function(e){
                        //console.log("unbind mouse up")
                        $(window).unbind("mousemove", null)
                    })
                })
        }
        _autoselect(it,i)
        {
            if(self.selidx == i) return true
            if(!it.selected || it.selected == false) return false
            var data = {
                    id:self.rid, 
                    data:it, 
                    idx:i}
            //if(self.selidx != -1)
             //   self.items[self.selidx].selected =false
            self.selidx = i

            if(self.onlistselect)
                self.onlistselect(data)
            this.root.observable.trigger('listselect',data)
            return true
        }
        _select(event)
        {
            if(self.selidx != -1 && self.selidx < self.items.length)
                self.items[self.selidx].selected =false
            event.item.item.selected = true
            //self.update()
        }

        _dbclick(event)
        {
            data =  {
                    id:self.rid, 
                    data:event.item.item,
                    idx: event.item.i}
            if(self.onlistdbclick)
                self.onlistdbclick(data)
            self.root.observable.trigger('listdbclick', data)
        }
    </script>
</afx-float-list>
<afx-grid-view>
    <afx-grid-row ref="gridhead" rootid = {rid} observable = {root.observable}  header="true" class = {grid_row_header:header} if = {header} cols = {header}> </afx-grid-row>
    <div ref = "scroller" style="width:100%; overflow:auto;">
        <div ref = "container" style ="padding-bottom:10px">
            <afx-grid-row each={ child, i in rows } class = {selected: child.selected}  rootid = {parent.rid} observable = {parent.root.observable} index = {i}  cols = {child} ondblclick = {parent._dbclick} onclick = {parent._select} oncontextmenu = {parent._select} head = {parent.refs.gridhead} ></afx-grid-row>
        </div>
    </div>
    <script>
        this.header = opts.header 
        this.rows = opts.rows || []
        var self = this 
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        self.selidx = -1
        self.nrow = 0
        self.ongridselect = opts.ongridselect
        self.ongriddbclick = opts.ongriddbclick
        self.root.observable = opts.observable 
        self.root.set = function(k,v)
        {
            if(k == "selected")
                self._select({item:self.rows[v], preventDefault:function(){}})
            else if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        this.calibrate_size = function()
        {
            if(self.header && self.refs.gridhead)
            {
                $(self.refs.scroller).css("height",
                    $(self.root).height() - $(self.refs.gridhead.root).children().first().height()
                + "px")
            }
            else
                $(self.refs.scroller).css("height",
                    $(self.root).height() + "px")
            
        }
        self.root.get = function(k)
        {
            if(k == "selected")
                return (self.selidx == -1?null:self.rows[self.selidx])
            return self[k]
        }

        this.on("mount", function(){
            if(self.refs.gridhead)
                self.refs.gridhead.observable = self.root.observable
            $(self.refs.container)
                .css("display","table")
                //.css("flex-direction","column")
                .css("width","100%")
            self.calibrate_size()

            self.root.observable.on("resize",function(){
                if(self.root)
                    self.calibrate_size()
            })
        })
        this.on("updated",function(){
            if(self.selidx >= self.rows.length)
                self.selidx = -1
            if(self.nrow == self.rows.length) return
            self.nrow = self.rows.length
            self.calibrate_size()
        })
        _select(event)
        {
            var data = {
                    id:self.rid, 
                    data:event.item}
            if(self.ongridselect)
                self.ongridselect(data)
            if(self.selidx != -1)
                self.rows[self.selidx].selected =false
            self.selidx = event.item.i
            self.rows[self.selidx].selected = true
            self.root.observable.trigger('gridselect',data)
            event.preventUpdate = true
            self.update()
            //event.preventDefault()
        }
        _dbclick(event)
        {
            data =  {
                    id:self.rid, 
                    data:event.item}
            if(self.ongriddbclick)
                self.ongriddbclick(data)
            self.root.observable.trigger('griddbclick', data)
        }
        
    </script>
</afx-grid-view>

<afx-grid-row>
    <div style = {!header? "display: table-cell;" :""} onclick = {parent._cell_select}  each = { child,i in cols } class = {string:typeof child.value == "string", number: typeof child.value == "number", cellselected: parent._auto_cell_select(child,i)} >
        <afx-label color={child.color} icon = {child.icon} iconclass = {child.iconclass} text = {child.value} ></afx-label>
    </div>
    <script>
        this.cols = opts.cols || []
        var self = this
        this.rid = opts.rootid
        this.index = opts.index
        this.header = eval(opts.header)||false
        this.head = opts.head
        this.selidx = -1
        self.observable = opts.observable
        this.colssize = []
        var update_header_size = function()
        {
            if(!self.cols || self.cols.length == 0) return
            var totalw = $(self.root).parent().width()
            if(totalw == 0) return
            var ocw = 0
            var nauto = 0
            self.colssize = []
            $.each(self.cols, function(i,e){
                if(e.width)
                {
                    self.colssize.push(e.width)
                    ocw += e.width
                }
                else
                {
                    self.colssize.push(-1)
                    nauto++
                }
            })
            if(nauto > 0)
            {
                var cellw = parseInt((totalw - ocw)/ nauto)
                $.each(self.colssize,function(i,e){if(e == -1) self.colssize[i] = cellw})
            }
            calibrate_size()
        }
        var calibrate_size = function()
        {
            var i = 0
            $(self.root)
                .children()
                .each(function(){
                    $(this).css("width", self.colssize[i]+"px")
                    i++
                })
        }
        this.on("updated", function(){
            if(self.header)
                update_header_size()
            else if(self.head && self.index == 0)
            {
                self.colssize = self.head.colssize
                calibrate_size()
            }
            
        })
        this.on("mount", function(){
            if (self.header)
            {
                $(self.root)
                    .css("display", "flex")
                    .css("flex-direction", "row")
                update_header_size()
            }
             else 
             {
                $(self.root)
                .css("display","table-row")
                //.css("flex-direction","row")
                .css("width","100%")
                if(self.head && self.index == 0)
                {
                    self.colssize = self.head.colssize
                    calibrate_size()
                }
             }
             self.observable.on("gridcellselect", function(data){
                if(data.id != self.rid || self.selidx == -1) return;
                if(data.row != self.index)
                {
                    self.cols[self.selidx].selected = false
                    self.selidx = -1
                }
            })
            self.observable.on("resize",function(){
                self.update()
            })
        })
        _cell_select(event)
        {
            if(self.header) return;
            if(self.selidx != -1)
            {
                self.cols[self.selidx].selected = false
                self.selidx = -1
            }
            self.cols[event.item.i].selected = true
            
        }
        _auto_cell_select(child,i)
        {
            if(!child.selected || self.header) return false;
            if(self.selidx == i) return true;
            var data = {
                    id:self.rid, 
                    data:child, 
                    col:i,
                    row:self.index}
            
            self.selidx = i
            self.observable.trigger("gridcellselect",data)
            return true;
        }
    </script>
</afx-grid-row>
<afx-hbox style = "display:block;">
    <div ref = "container" class="afx-hbox-container">
         <yield/>
    </div>
    <script>
        var self = this
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        this.on('mount', function(){
            $(self.refs.container)
                .css("display","flex")
                .css("flex-direction","row")
                .css("width","100%")

                calibrate_size()

                if(self.root.observable)
                {
                    self.root.observable.on("resize", function(w,h){
                        calibrate_size()
                    })
                    self.root.observable.on("calibrate", function(){
                        calibrate_size()
                    })
                }
        })
        var calibrate_size = function()
        {
            var auto_width = []
            var csize, ocwidth = 0, avaiheight;
            avaiheight = $(self.root).height()
            avaiWidth = $(self.root).width()
            $(self.refs.container).css("height",avaiheight + "px")
            $(self.refs.container)
                .children()
                .each(function(e)
                {
                    this.observable = self.root.observable
                        //.css("height",avaiheight + "px")
                    var dw = $(this).attr("data-width")
                    if(dw)
                    {
                        if(dw == "grow") return
                        if(dw[dw.length-1] === "%")
	                        dw = Number(dw.slice(0,-1))*avaiWidth/100;
                        $(this).css("width",dw + "px")
                        ocwidth += Number(dw)
                    }
                    else
                    {
                        $(this)
                        .css("flex-grow","1")
                        auto_width.push(this)
                    }
                })
            csize = (avaiWidth - ocwidth)/ (auto_width.length)
            if(csize > 0)
                $.each(auto_width, function(i,v)
                {
                    $(v).css("width", csize + "px")
                })
            self.root.observable.trigger("hboxchange",
                {id:self.rid, w:csize, h:avaiheight})
        }
    </script>
</afx-hbox>
<afx-label>
    <span style = {color?"color:" + color:""} >
        <i if={iconclass} class = {iconclass} ></i>
        <i if={icon} class="icon-style" style = { "background: url("+icon+");background-size: 100% 100%;background-repeat: no-repeat;" }></i>
        { text }
    </span>
    <script>
        this.iconclass = opts.iconclass
        this.icon = opts.icon
        this.text = opts.text
        this.color = opts.color
        var self = this
        this.on("update",function(){
            self.iconclass = opts.iconclass
            self.icon = opts.icon
            self.text = opts.text
            self.color = opts.color
        })
        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    opts[i] = v[i]
            else
                opts[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
    </script>
</afx-label>
<afx-list-view class = {dropdown: opts.dropdown == "true"}>
    <div class = "list-container" ref = "container">
    <div if = {opts.dropdown == "true"} ref = "current" style = {opts.width?"min-width:" + opts.width + "px;":"min-width:150px;"}  onclick = {show_list}>
    </div>
    <ul  ref = "mlist">
        <li each={item,i in items } class={selected: parent._autoselect(item,i)} ondblclick = {parent._dbclick}  onclick = {parent._select} oncontextmenu = {parent._select}>
            <afx-label color = {item.color} iconclass = {item.iconclass} icon = {item.icon} text = {item.text}></afx-label>
            <i if = {item.closable} class = "closable" click = {parent._remove}></i>
            <ul if = {item.complex} class = "complex-content">
                <li each = {ctn,j in item.detail} class = {ctn.class}>{ctn.text}</li>
            </ul>
        </li>
    </ul>
    </div>
    <script>
        this.items = opts.items || []
        var self = this
        self.selidx = -1
        self.onlistselect = opts.onlistselect
        self.onlistdbclick = opts.onlistdbclick
        self.onitemclose = opts.onitemclose
        var onclose = false
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        self.root.set = function(k,v)
        {
            if(k == "selected")
            {
                if(self.selidx != -1)
                    self.items[self.selidx].selected =false
                if(v == -1)
                    self.selidx = -1
                else
                    if(self.items[v]) self.items[v].selected = true
            }
            else if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            if(k == "selected")
                if(self.selidx != -1)
                    return self.items[self.selidx]
                else
                    return undefined
            else if(k == "count")
                return self.items.length
            return self[k]
        }
        self.root.push = function(e,u)
        {
            self.items.push(e)
            if(u) self.update()
        }
        self.root.unshift = function(e,u)
        {
            self.items.unshift(e)
            if(u) self.update()
        }
        self.root.remove = function(e,u)
        {
            var i = self.items.indexOf(e)
            if(i >= 0)
            {
                if(self.selidx != -1)
                {
                    self.items[self.selidx].selected =false
                    self.selidx = -1
                }
                self.items.splice(i, 1)
                if(u)
                    self.update()
                onclose = true
            }
        }
        if(opts.observable)
            this.root.observable = opts.observable
        else
        {
            this.root.observable = riot.observable()
        }
        
        this.on("mount", function(){
            if(opts.dropdown == "true")
            {
                $(document).click(function(event) { 
                    if(!$(event.target).closest(self.refs.container).length) {
                        $(self.refs.mlist).hide()
                    }
                })
                //$(self.root).css("position","relative")
                $(self.refs.container)
                        .css("position","absolute")
                        .css("display","inline-block")
                        
                $(self.refs.mlist)
                    .css("position","absolute")
                    .css("display","none")
                    .css("top","100%")
                    .css("left","0")
                
                self.root.observable.on("vboxchange", function(e){
                   if(e.id == self.parent.rid)
                        $(self.refs.container).css("width", $(self.root).parent().innerWidth() + "px" )
                })
            }
        })
        show_list(event)
        {
            var desktoph = $("#desktop").height()
            var off = $(self.root).offset().top + $(self.refs.mlist).height()
            if( off > desktoph )
                $(self.refs.mlist)
                    .css("top","-" +  $(self.refs.mlist).outerHeight() + "px")
            else 
                $(self.refs.mlist).css("top","100%")
            $(self.refs.mlist).show()
            //event.preventDefault()
            event.preventUpdate = true
        }
        _remove(event)
        {
            r = true
            if(self.onitemclose)
                r = self.onitemclose(event)
            if(r)
                self.root.remove(event.item.item, true)
        }
        _autoselect(it,i)
        {
            if(!it.selected || it.selected == false) return false
            if(self.selidx == i) return true 
            var data = {
                    id:self.rid, 
                    data:it, 
                    idx:i}
            //if(self.selidx != -1)
             //   self.items[self.selidx].selected =false
            self.selidx = i
            if(opts.dropdown  == "true")
            {
                $(self.refs.mlist).hide()
                $(self.refs.current).html(it.text)
            }
            
            if(self.onlistselect)
                self.onlistselect(data)
            this.root.observable.trigger('listselect',data)
            //console.log("list select")
            return true
        }
        _select(event)
        {
            if(onclose)
            {
                onclose = false
                event.preventUpdate = true
                return
            }
            if(self.selidx != -1 && self.selidx < self.items.length)
                self.items[self.selidx].selected =false
            event.item.item.selected = true
        }
        _dbclick(event)
        {
            data =  {
                    id:self.rid, 
                    data:event.item.item,
                    idx: event.item.i}
            if(self.onlistdbclick)
                self.onlistdbclick(data)
            self.root.observable.trigger('listdbclick', data)
        }
    </script>
</afx-list-view>
<afx-menu >
    <ul class={context: opts.context == "true"}>
        <li class="afx-corner-fix"></li>
        <li ref = "container" each={ data,i in items } class = {afx_submenu:data.child != null && data.child.length > 0, fix_padding:data.icon} no-reorder>
            <a href="#" onclick = {parent.onselect}>
                <afx-switch if = {data.switch || data.radio} class = {checked:parent.checkItem(data)} enable = false swon = {data.checked} ></afx-switch>
                <afx-label color = {data.color} iconclass = {data.iconclass} icon = {data.icon} text = {data.text} ></afx-label>
            </a>
            
            <afx-menu  if={data.child != null && data.child.length > 0} child={data.child} onmenuselect = {data.onmenuselect}  observable = {parent.root.observable} rootid = {parent.rid}></afx-menu>
        </li>
         <li class="afx-corner-fix"></li>
    </ul>
    <script>
        this.items = opts.child || []
        var isRoot
        var lastChecked = undefined
        if(opts.rootid)
        {
            this.rid = opts.rootid
            isRoot = false
        }
        else
        {
            this.rid = $(this.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
            isRoot = true
        }
        var self = this
        this.onmenuselect = opts.onmenuselect
        checkItem(d)
        {
            if(d.checked == true && d.radio)
            {
                if(lastChecked)
                    lastChecked.checked = false
                lastChecked = d
                lastChecked.checked = true
            } 
            return false
        }
        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        self.root.push = function(e,u)
        {
            self.items.push(e)
            if(u)
                self.update()
        }
        self.root.unshift = function(e,u)
        {
            self.items.unshift(e)
            if(u)
                self.update()
        }
        self.root.remove = function(e,u)
        {
            var i = self.items.indexOf(e)
            if(i >= 0)
                self.items.splice(i, 1)
            if(u)
                self.update()
        }
        self.root.update = function()
        {
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        self.root.show = function(e)
        {
            //only for menucontext
            if(opts.context != "true") return
            $(self.root)
                .css("top", e.clientY - 15 + "px")
                .css("left",e.clientX  -5 +  "px")
                .show()
            $(document).on("click",mnhide)
        }

        if(opts.observable)
        {
            this.root.observable = opts.observable
        }
        else
        {
            this.root.observable = riot.observable()
            this.root.observable.on('menuselect',function(data){
                if(self.onmenuselect)
                    self.onmenuselect(data)

                if(opts.context == "true")
                    $(self.root).hide()
                else if(!data.root && self.refs.container)
                {
                    var arr = self.refs.container.length?self.refs.container:[self.refs.container]
                    for( var i in arr)
                        $("afx-menu",arr[i]).first().hide()
                }
            })
        }

        var mnhide = function(event)
        {
            if(opts.context == "true")
            {
                if(!$(event.target).closest(self.root).length) {
                    $(self.root).hide()
                    $(document).unbind("click",mnhide)
                }
                return;
            }
            if(!$(event.target).closest(self.refs.container).length && self.refs.container) {
                var arr = self.refs.container.length?self.refs.container:[self.refs.container]
                for( var i in arr)
                    $("afx-menu",arr[i]).first().hide()
                $(document).unbind("click",mnhide)
            } 
            else 
            {
                if(self.refs.container && self.refs.container.length)
                    for(var i in self.refs.container)
                        if(!$(event.target).closest(self.refs.container[i]).length) {
                            $("afx-menu",self.refs.container[i]).first().hide()
                        } 
            }
        }

        onselect(event)
        {
            var data = {id:self.rid, root:isRoot, e:event, item:event.item}
            if(event.item.data.switch)
            {
                event.item.data.checked = !event.item.data.checked
            } else if(event.item.data.radio)
            {
                if(lastChecked)
                {
                    lastChecked.checked = false
                }
                event.item.data.checked = true   
                lastChecked = event.item.data
            }
            this.root.observable.trigger('menuselect',data)
            if( this.onmenuselect && !isRoot)  this.onmenuselect(data)
            event.preventDefault()
            $(document).unbind("click",mnhide)
            if(opts.context == "true") return
            if(isRoot && self.refs.container)
            {
                if(self.refs.container.length)
                    $("afx-menu",self.refs.container[event.item.i]).first().show()
                else 
                    $("afx-menu",self.refs.container).first().show()
                $(document).on("click",mnhide)
                return
            }
        }

    </script>
</afx-menu>
<afx-overlay>
    <yield/>
    <script>
        this.width = opts.width || 200
        this.height = opts.height || 400
        var self = this;
        self.commander = null
        this.root.observable = opts.observable || riot.observable()
        var id = $(self.root).attr("data-id")
        var calibre_size = function()
        {
            $(self.root)
                .css("width", self.width + "px")
                .css("height", self.height + "px")
            self.root.observable.trigger("resize", {id:id,w:self.width,h:self.height})
        }

        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            if( k == "width" || k == "height")
                calibre_size()
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
    
        self.on("mount", function(){
            $(self.root)
                .css("position", "absolute")
                //.css("z-index",1000000)
            $(self.root).children().each(function(e){
                this.observalbe = self.root.observalbe
            })
            calibre_size()
            self.root.observable.trigger("rendered", self.root)
        })
    </script>
</afx-overlay>
<afx-resizer>
    <script>
        var self = this
        self.dir = "hz"
        self.resizable = undefined
        self.parent = undefined
        self.minsize = 0
        self.on("mount", function(){
            //self.parent = $(self.root).parent().parent()
            var tagname = $(self.parent.root).prop("tagName")
            self.resizable = $(self.root).prev().length == 1 ?  $(self.root).prev()[0]: undefined
            if(tagname == "AFX-HBOX")
            {
                self.dir = "hz"
                $(self.root).css("cursor", "col-resize")
                if(self.resizable)
                {
                    self.minsize = parseInt($(self.resizable).attr("min-width"))
                }
            }
            else if(tagname == "AFX-VBOX")
            {
                self.dir = "ve"
                $(self.root).css("cursor", "row-resize")
                if(self.resizable)
                {
                    self.minsize = parseInt($(self.resizable).attr("min-height"))
                }
            }
            else
            {
                //$(self.root).css("cursor", "normal")
                self.dir = "none"
            }
            
            enable_dragging()
        })

    var enable_dragging = function()
        {
            $(self.root)
                .css("user-select","none")
            $(self.root).on("mousedown", function(e){
                e.preventDefault()

                $(window).on("mousemove", function(evt){
                    if(!self.resizable) return
                    if(self.dir == "hz")
                        horizontalResize(evt)
                    else if (self.dir == "ve")
                        verticalResize(evt)
                })
                $(window).on("mouseup", function(evt){
                    //console.log("unbind mouse up")
                    $(window).unbind("mousemove", null)
                })
            })
        }

    var horizontalResize = function(e)
    {
        if(!self.resizable) return
        var offset = $(self.resizable).offset()
        w = Math.round(e.clientX - offset.left)
        if(w < self.minsize) w = self.minsize
        $(self.resizable).attr("data-width", w.toString())
        self.parent.root.observable.trigger("calibrate", self.resizable)
    }

    var verticalResize = function(e)
    {
        //console.log("vboz")
        if(!self.resizable) return
        var offset = $(self.resizable).offset()
        //console.log($(self.resizable).innerHeight())
        //console.log(e.clientY, offset.top)
        h = Math.round(e.clientY - offset.top)
        if(h < self.minsize) h = minsize
        $(self.resizable).attr("data-height", h.toString())
        self.parent.root.observable.trigger("calibrate", self.resizable)
    }
    </script>
</afx-resizer>

<afx-switch>
    <span class = {swon: swon} onclick = {toggle}></span>
    <script>
        this.swon = opts.swon || false
        var self = this
        this.root.observable = opts.observable
        this.enable = opts.enable || true
        this.onchange = opts.onchange
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    opts[i] = v[i]
            else
                opts[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        this.root.toggle = function()
        {
            opts.swon = !self.swon
            self.update()
        }
        this.on("update", function(e){
            self.swon = opts.swon
            self.onchange = opts.onchange
        })
        toggle(e)
        {
            if(!self.enable) return
            opts.swon = !self.swon
            var data = {
                id: self.rid,
                data: opts.swon
            }
            if(self.onchange)
                self.onchange(data)
            if(self.root.observable)
                self.root.observable.trigger("switch", data)
            
        }
    </script>
</afx-switch>
<afx-sys-panel>
    <div>
        <afx-menu data-id = "os_menu" ref = "aOsmenu" child={osmenu.child} onmenuselect = {osmenu.onmenuselect} class="afx-panel-os-menu"></afx-menu>
        <afx-menu data-id = "appmenu" ref = "aAppmenu" child={appmenu.child}  class = "afx-panel-os-app"></afx-menu>
        <afx-menu data-id = "sys_tray" ref = "aTray" child={systray.child} onmenuselect = {systray.onmenuselect} class = "afx-panel-os-stray"></afx-menu>
    </div>
    
    <script>
        this.osmenu = { child: [] }
        this.appmenu = { child: [] }
        this.systray = { 
            child: [], 
            onmenuselect: function(d){
                if(d.root)
                    d.e.item.data.awake(d.e)
            }
        }

        var self = this
        self.root.attachservice = function(s)
        {
            self.refs.aTray.root.unshift(s,true)
            s.attach(self.refs.aTray)
        }
        self.root.detachservice = function(s)
        {
            self.refs.aTray.root.remove(s, true)
        }
        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else
                self[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            return self[k]
        }
        this.on('mount', function() {
            //console.log(self.refs.aOsmenu.root)
            $(self.refs.aOsmenu.root).css("z-index",1000000)
            $(self.refs.aAppmenu.root).css("z-index",1000000)
            $(self.refs.aTray.root).css("z-index",1000000)
            window.OS.courrier.trigger("syspanelloaded")
        })
    </script>
</afx-sys-panel>
<afx-tab-container>
    <afx-list-view   ref = "list" />
    <script>
        var self = this
        this.closable = opts.closable || false
        self.root.observable = opts.observable || riot.observable()
        self.ontabselect = opts.ontabselect
        get_observable(){
            return self.root.observable
        }

        self.root.get = function (k) {
            return self.refs.list.root.get(k)
        }

        self.root.update = function(){
            self.update()
        }

        self.on("mount", function(){
            self.refs.list.root.observable = self.root.observable
            /*self.root.observable.on("listselect", function(){
                console.log("list select")
            })*/
            self.refs.list.root.set ("onlistselect",function (e) {
                //console.log("tab is seleced")
                self.root.observable.trigger("tabselect", e)
                if(self.ontabselect)
                    self.ontabselect(e)
            })
        })

        self.root.set = function (k,v){
            if( k == "*")
                for(var i in v)
                    self.refs.list.root.set(i,v[i])
            else if(k == "closable")
            {
                self.closable = v
            }
            else if(k == "ontabselect")
                self.ontabselect = v
            else
            {
                if(k == "items")
                {
                    for(var i in v)
                        v[i].closable = self.closable
                }
                self.refs.list.root.set(k,v)
            }
            //self.update()
        }

        self.root.push = function(e,u)
        {
            e.closable = self.closable
            self.refs.list.root.push(e,u)
        }
        self.root.unshift = function(e,u)
        {
            self.refs.list.root.unshift(e,u)
        }
        self.root.remove = function(e,u)
        {
            self.refs.list.root.remove(e,u)
        }

    </script>
</afx-tab-container>
<afx-tree-view>

  <div class={afx_tree_item_selected:treeroot.selectedItem && treeroot.selectedItem.treepath == data.treepath, afx_folder_item: isFolder(), afx_tree_item_odd: index%2 != 0  } onclick={select} ondblclick = {_dbclick} oncontextmenu = {select}>
    <ul style = "padding:0;margin:0;white-space: nowrap;">
        <li ref = "padding" ></li>
        <li class = "itemname" style="display:inline-block;" >
            <i if={ !isFolder() && data.iconclass} class = {data.iconclass} ></i>
            <i if={!isFolder() && data.icon} class="icon-style" style = { "background: url("+data.icon+");background-size: 100% 100%;background-repeat: no-repeat;" }></i>

            <span onclick={ toggle } if={ isFolder() } class={open ? 'afx-tree-view-folder-open' : 'afx-tree-view-folder-close'}></span>
            { data.name }
        </li>
    </ul>
  </div>


  <ul if={ isFolder() } show={ isFolder() && open }>
    <li each={ child, i in data.nodes }>
      <afx-tree-view ontreeselect = {parent.ontreeselect} index = {i} fetch = {parent.fetch} ontreedbclick = {parent.ontreedbclick} data={child} indent={indent+1} observable = {parent.root.observable} path = {parent.data.treepath + ">" + i} treeroot= {parent.treeroot}></afx-tree-view>
    </li>
  </ul>

    <script>
        var self = this
        self.open = true
        self.data = { name:"", nodes:null, treepath: opts.path, i:-1}
        if(opts.data)
        {
            self.data = opts.data
            //self.name = opts.data.name
            //self.nodes = opts.data.nodes
            //self.icon = opts.data.icon
            self.open = opts.data.open == undefined?true:opts.data.open
            //self.iconclass = opts.data.iconclass  
        }
        self.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        self.data.rid = self.rid
        self.data.i = opts.index
        self.ontreeselect = opts.ontreeselect
        self.ontreedbclick = opts.ontreedbclick
        self.fetch = opts.fetch
        self.indent = opts.indent || 0
        var istoggle = false
        if(opts.treeroot)
        {
            this.treeroot = opts.treeroot
            this.treeroot.counter++
        }
        else
        {
            this.treeroot = self
            this.treeroot.counter = 0
        }
        self.data.treepath = opts.path || 0
        //self.selected = false
        self.selectedItem = null
        self.index = this.treeroot.counter
        
        var _dfind = function(l,d, k, v)
        {
            if( d[k] == v ) return l.push(d)
            if(d.nodes && d.nodes.length > 0)
                for(var i in d.nodes)
                    _dfind(l, d.nodes[i],k,v)
        }
        self.root.find = function(k, v)
        {
            var l = []
            _dfind(l,self.data,k,v)
            return l
        }

        self.root.set = function(k,v)
        {
            if(k == "*")
                for(var i in v)
                    self[i] = v[i]
            else if (k == "data")
                for(var i in v)
                    self.data[i] = v[i]
            else if (k == "selectedItem")
            {
                if(self.ontreeselect)
                    self.ontreeselect(self.data)
                self.treeroot.selectedItem = v
                self.root.observable.trigger('treeselect',self.data)
            }
            else
                self[k] = v
            self.update()
        }
        self.root.get = function(k)
        {
            //if(k == "data")
            //    return {name:self.name, nodes: self.nodes, icon:self.icon, iconclass: self.iconclass, selectedItem:self.selectedItem}
            return self[k]
        }

        if(opts.observable)
            this.root.observable = opts.observable
        else
        {
            this.root.observable = riot.observable()
        }
        
        this.on("mount", function(){
            $(self.refs.padding)
                .css("display", "inline-block")
                .css("height","1px")
                .css("padding",0)
                .css("margin", 0)
                .css("background-color","transparent")
                .css("width", self.indent*15 + "px" )
        })

        isFolder() {
            return self.data.nodes //&& self.nodes.length
        }

        toggle(e) {
            self.open = !self.open
            e.preventDefault()
            istoggle = true

            if(self.open && self.data.nodes.length == 0 && self.fetch)
            {
                self.fetch(e.item, function(d){
                    self.data.nodes = d
                    self.update()
                })
            }
        }
        
        select(event)
        {
            if(istoggle)
            {
                istoggle = false 
                return
            }
            /*var data = {
                id:self.rid, 
                data:event.item,
                path:self.data.path
            } */
            if(self.ontreeselect)
                self.ontreeselect(self.data)
            self.treeroot.selectedItem = self.data
           this.root.observable.trigger('treeselect',self.data)
           event.preventUpdate = true
           self.treeroot.update()
           event.preventDefault()
        }
        _dbclick(event)
        {
            if(istoggle)
            {
                istoggle = false 
                return
            }
            /*data =  {
                    id:self.rid, 
                    data:event.item,
                    path: self.data.path}*/
            if(self.ontreedbclick)
            {
                self.ontreedbclick(self.data)
            }
            self.root.observable.trigger('treedbclick', self.data)
        }
    </script>
</afx-tree-view>
<afx-vbox style = "display:block;">
    <div ref = "container" class="afx-vbox-container">
         <yield/>
    </div>
    <script>
        var self = this
        this.rid = $(self.root).attr("data-id") || Math.floor(Math.random() * 100000) + 1
        this.on('mount', function(){
            $(self.refs.container)
                .css("display","flex")
                .css("flex-direction","column")
                .css("width","100%")
                //.css("background-color","red")
                //.css("overflow", "hidden")

            calibrate_size()

            if(self.root.observable)
            {
                self.root.observable.on("resize", function(w,h){
                    calibrate_size()
                })
                self.root.observable.on("calibrate", function(){
                    calibrate_size()
                })
            }
        })

        var calibrate_size = function()
        {
            var auto_height = []
            var csize, ocheight = 0, avaiheight;
            avaiheight = $(self.root).height()
            avaiwidth = $(self.root).width()
            $(self.refs.container).css("height",avaiheight + "px")
            $(self.refs.container)
                .children()
                .each(function(e)
                {
                    this.observable = self.root.observable
                        //.css("border","1px solid black")
                    var dw = $(this).attr("data-height")
                    if(dw)
                    {
                        if(dw == "grow") return
                        if(dw[dw.length-1] === "%")
	                        dw = Number(dw.slice(0,-1))*avaiheight/100;
                        $(this).css("height",dw + "px")
                        ocheight += Number(dw)
                    }
                    else
                    {
                        $(this)
                        .css("flex-grow","1")
                        auto_height.push(this)
                    }
                })
            csize = (avaiheight - ocheight)/ (auto_height.length)
            if(csize > 0)
                $.each(auto_height, function(i,v)
                {
                    $(v).css("height", csize + "px")
                })
            self.root.observable.trigger("vboxchange",
                {id:self.rid, w:avaiwidth, h:csize})
        }
    </script>
</afx-vbox>
