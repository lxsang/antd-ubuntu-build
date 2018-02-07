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

function auth_or_die(msg)
	if SESSION.lua_session == nil or SESSION.lua_session == '0' then die(msg) end
end

if has_module("os/"..REQUEST.path) then
	-- run the correct module
	require("os/"..REQUEST.path)
else
	local hstr = REQUEST.path:match("^%a+/")
	if hstr == "fs/" then
		require("fs.fsh")(REQUEST.path:gsub(hstr,"",1))
	else
		if utils.file_exists(OSROOT..'/'..REQUEST.path) then
			-- run the correct module
			print("USER REQUIRE LUA FILE")
			require(REQUEST.path:gsub('.lua',""))
		else
			fail("Resource not found for request "..REQUEST.path)
		end
	end
end
