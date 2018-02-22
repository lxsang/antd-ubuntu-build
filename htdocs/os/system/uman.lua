local uman={}

uman.userinfo = function(user)
	local info = {}
	local uid = unix.uid(user)
	if uid then
		info.userData = {
			username = user,
			id = uid.id,
			name = user,
			groups = uid.groups
		}
		info.blacklistedPackages = {}
		info.userSettings = {}
		-- read the setting
		-- use the decodeFile function of JSON instead
		local file =  require('fs.vfs').ospath("home:///").."/.settings.json"
		local st = JSON.decodeFile(file)
		if(st) then
			info.userSettings = st.settings
		end
		--print(JSON.encode(info))
		return info
	else 
		return {}
	end
end

return uman