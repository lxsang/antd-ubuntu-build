if SESSION.sessionid ~= nil and SESSION.sessionid ~= '0' then
	local cookie = {sessionid='0'}
	local db = sysdb()
	if db ~= nil then
		--local data = db:find("sessionid ='"..SESSION.sessionid.."'")
		--if data and data[0] ~= nil then
		--	db:delete(data[0].id)
		--end
		db:delete("sessionid = '"..SESSION.sessionid.."'")
		db:close()
	end
	std.cjson(cookie)
else
	std.json()
end
std.t(JSON.encode({error=false,result=true}))