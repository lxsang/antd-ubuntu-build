local handler

handler = function(str)
	local func = str:match("^%a+/")
	if func == "get/" then
		require("fs.get")(str:gsub(func,""))
	else
		fail("Action is not supported: "..func)
	end
end

return handler
