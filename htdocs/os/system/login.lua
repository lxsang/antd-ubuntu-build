if REQUEST.query.json ~= nil then
	local request = JSON.decodeString(REQUEST.query.json)
	local r = unix.auth(request.username,request.password)
	if r == true then
		local cookie = {lua_session=std.md5(request.password), iotos_user = request.username}
		std.cjson(cookie)
		local user = {
	    	result = require("system.uman").userinfo(cookie.iotos_user),
	    	error = false
		}
		std.t(JSON.encode(user))
	else
		fail("Invalid login")
	end
else
	fail("Invalid request")
end


