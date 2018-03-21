utils = {}

function utils.is_array(table)
    local max = 0
    local count = 0
    for k, v in pairs(table) do
        if type(k) == "number" then
            if k > max then max = k end
            count = count + 1
        else
            return false
        end
    end
    if max > count * 2 then
        return false
    end

    return true
end

function utils.escape(s)
	local replacements = {
		["\\"] = "\\\\" ,
		['"'] = '\\"', 
		["\n"] = "\\n", 
		["\t"] = "\\t", 
		["\b"] = "\\b", 
		["\f"] = "\\f",
		["\r"] = "\\r",
		["%"] = "%%"
	}
	return (s:gsub( "[\\'\"\n\t\b\f\r%%]", replacements ))
end

function utils.escape_pattern(s)
	return s:gsub("[%(%)%.%+%-%*%?%[%]%^%$%%]", "%%%1")
end

function utils.unescape_pattern(s)
	return s:gsub( "[%%]", "%%%%")
end

function utils.unescape(s)
	local replacements = {
		["\\\\"] 	= "\\" ,
		['\\"'] 	= '"' 	, 
		["\\n"] 	= "\n"	, 
		["\\t"] 	= "\t"	, 
		["\\b"] 	= "\b"	, 
		["\\f"] 	= "\f"	,
		["\\r"] 	= "\r"
	}
	local out = s
	for k,v in pairs(replacements) do
		out = out:gsub(k,v)
	end
	return out
end

function utils.file_exists(name)
   local f=io.open(name,"r")
   if f~=nil then io.close(f) return true else return false end
end

function utils.url_parser(uri)
	local pattern = "^(https?)://([%.%w]+):?(%d*)(/?[^#]*)#?.*$"
	local obj = {}
	obj.protocol = uri:gsub(pattern, "%1")
	obj.hostname = uri:gsub(pattern, "%2")
	obj.port = uri:gsub(pattern, "%3")
	obj.query = uri:gsub(pattern, "%4")
	
	if obj.port == "" then obj.port = 80 else obj.port = tonumber(obj.port) end
	if obj.query == "" then obj.query="/" end
	return obj
end

JSON = modules.JSON()

function JSON.encode(obj)
	local t = type(obj)
	if t == 'table' then 
		-- encode object
		if utils.is_array(obj) == false then
			local lst = {}
			for k,v in pairs(obj) do
				table.insert(lst,'"'..k..'":'..JSON.encode(v))
			end
			return "{"..table.concat(lst,",").."}"
		else
			local lst = {}
			local a = {}
			for n in pairs(obj) do table.insert(a, n) end
			table.sort(a)
			for i,v	in pairs(a) do
				table.insert(lst,JSON.encode(obj[v]))
			end
			return "["..table.concat(lst,",").."]"
		end
	elseif t == 'string' then
		--print('"'..utils.escape(obj)..'"')
		return '"'..utils.escape(obj)..'"'
	elseif t == 'boolean' or t == 'number' then
		return tostring(obj)
	elseif obj == nil then
		return "null"
	else
		return '"'..tostring(obj)..'"'
	end
end

