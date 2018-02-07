if SESSION.lua_session ~= nil and SESSION.lua_session ~= '0' then
	local cookie = {lua_session='0',iotos_user=''}
	std.cjson(cookie)
else
	std.json()
end
std.t(JSON.encode({error=false,result=true}))