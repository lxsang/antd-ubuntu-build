std.html()
local r,m = require("web").post("http://127.0.0.1:9000/ffvm/classinfo","class=Object")
--print(data)
std.t(r.data)