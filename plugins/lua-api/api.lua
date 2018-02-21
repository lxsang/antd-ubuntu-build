-- root dir
__ROOT__ = __api__.root
-- set require path
package.path = __ROOT__ .. '/?.lua;'..__api__.apiroot..'/?.lua'
package.cpath = __api__.apiroot..'/?.llib'
-- set session
SESSION = {}
if REQUEST.query ~= nil and REQUEST.query.cookie ~= nil then
	SESSION = REQUEST.query.cookie
end
HEADER = REQUEST.query.__xheader__

require("std")
require("utils")
require("extra_mime")

function has_module(m)
	if utils.file_exists(__ROOT__..'/'..m) then
		if m:find("%.ls$") then
			return true, true,  __ROOT__..'/'..m
		else
			return true, false, m:gsub(".lua$","")
		end
	elseif utils.file_exists(__ROOT__..'/'..string.gsub(m,'%.','/')..'.lua') then
		return true, false, m
	elseif utils.file_exists(__ROOT__..'/'..string.gsub(m,'%.','/')..'.ls') then
		return true, true, __ROOT__..'/'..string.gsub(m,'%.','/')..'.ls'
	end
	return false, false, nil
end

function echo(m)
    if m then std.t(m) else std.t("Undefined value") end
end

function doscript(file)
    local f = io.open(file, "rb")
    local content = ""
    if f then
        local html = ""
        local pro = ""
        local s,e, mt
        local mtbegin = true -- find begin of scrit, 0 end of scrit
        local i = 1
        for line in io.lines(file) do
            line = std.trim(line, " ")
            if(line ~= "") then
                if(mtbegin) then
                    mt = "^%s*<%?lua"
                else
                    mt = "%?>%s*$"
                end
                s,e = line:find(mt)
                if(s) then
                    if mtbegin then
                        if html ~= "" then
                            pro= pro.."echo(\""..utils.escape(html).."\")\n"
                            html = ""
                        end
                        local b,f  = line:find("%?>%s*$")
                        if b then
                            pro = pro..line:sub(e+1,b-1).."\n"
                        else
                            pro = pro..line:sub(e+1).."\n"
                            mtbegin = not mtbegin
                        end
                    else
                        pro = pro..line:sub(0,s-1).."\n"
                        mtbegin = not mtbegin
                    end
                else -- no match
                    if mtbegin then
                        -- detect if we have inline lua with formqt <?=..?>
                        local b,f = line:find("<%?=")
                        if b then
                            local tmp = line
                            while(b) do
                                -- find the close
                                local x,y = tmp:find("%?>")
                                if x then
                                    pro= pro.."echo(\""..utils.escape(html..tmp:sub(0,b-1)).."\")\n"
                                    pro = pro.."echo("..tmp:sub(f+1,x-1)..")\n"
                                    html = ""
                                    tmp = tmp:sub(y+1)
                                    b,f = tmp:find("<%?=")
                                else
                                    error("Syntax error near line "..i)
                                end
                            end
                            pro= pro.."echo(\""..utils.escape(tmp).."\")\n"
                        else
                            html = html..std.trim(line," ").."\n"
                        end
                    else
                        if line ~= "" then pro = pro..line.."\n" end
                    end
                end
            end
            i = i+ 1
        end
        if(html ~= "") then
            pro = pro.."echo(\""..utils.escape(html).."\")\n"
        end
        --print(pro)
        local  r,e = load(pro)
        if r == nil then
            --print(e)
            std.t(e)
        else
            r,e = pcall(r)
            if r == false then
                --print(e)
                std.t(e)
            end
        end
    end
end

-- OOP support
--require("OOP")
-- load sqlite helper
--require("sqlite")
-- enable extra mime

-- run the file
require('index')
