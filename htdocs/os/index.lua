unix = require("ulib")
require("sqlite")
OSROOT = __ROOT__.."/os"
function fail(msg)
	std.json()
	std.t(JSON.encode({error=msg}))
end

function result(obj)
	std.json()
	std.t(JSON.encode({result=obj, error=false}))
end

function die (msg)
  fail(msg)
  debug.traceback=nil
  error("Permission denied")
end
-- check if the sysdb is create, otherwise create the table
function sysdb()
	local meta = {}
	meta.sessionid = ""
	meta.username = ""
	meta.stamp = 0
	return require("db.model").get("sysdb", "sessions", meta)
end

function auth_or_die(msg)
	if SESSION.sessionid == nil or SESSION.sessionid == '0' then die(msg) end
	-- query session id from database
	local db = sysdb()
	if db == nil then die(msg.." - Cannot get system database") end
	local cond = {exp= {["="] = { sessionid = SESSION.sessionid }}}
	local data = db:find(cond)
	--print(JSON.encode(data))
	db:close()
	if data == nil or data[0] == nil then die(msg) end
	-- next time check the stamp
	SESSION.iotos_user = data[0].username
	--print("Go for new thing")
end
-- test only
if has_module("os/"..REQUEST.path) then
	-- run the correct module
	require("os/"..REQUEST.path)
else
	local hstr = REQUEST.path:match("^%a+/")
	if hstr == "fs/" then
		--print("require module")
		require("fs.fsh")(REQUEST.path:gsub(hstr,"",1))
	else
		if utils.file_exists(__ROOT__..'/'..REQUEST.path) then
			-- run the correct module
			print("USER REQUIRE LUA FILE")
			require(REQUEST.path:gsub('.lua',""))
		else
			fail("Resource not found for request "..REQUEST.path)
		end
	end
end
