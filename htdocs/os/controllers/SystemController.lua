BaseController:subclass(
    "SystemController",
    {
        registry = {},
        models = {}
    }
)

function SystemController:actionnotfound(...)
    return self:index(table.unpack({...}))
end

function SystemController:index(...)
    local api = {
        description = "This api handle system operations",
        actions = {
            ["/packages"] = "Handle all operation relate to package: list, install, cache, uninstall",
            ["/settings"] = "Save user setting",
            ["/application"] = "Call a specific server side application api"
        }
    }
    result(api)
    return false
end

function SystemController:packages(...)
    auth_or_die("User unauthorized. Please login")
    local rq = (JSON.decodeString(REQUEST.query.json))
    local packages = require("packages")
    packages.init(rq.args.paths)
    if rq ~= nil then
        -- check user command here
        if (rq.command == "install") then
            packages.install(rq.args)
        elseif rq.command == "cache" then
            packages.cache(rq.args)
        elseif rq.command == "list" then
            packages.list(rq.args.paths)
        elseif rq.command == "uninstall" then
            packages.uninstall(rq.args.path)
        else
            fail("Uknown packages command")
        end
    else
        fail("Uknown request")
    end
end

function SystemController:settings(...)
    auth_or_die("User unauthorized. Please login")
    local user = SESSION.user
    if user then
        local ospath = require("vfs").ospath("home:///", user)
        if REQUEST.query and REQUEST.query.json then
            local f = io.open(ospath .. "/" .. ".settings.json", "w")
            if f then
                f:write(REQUEST.query.json)
                f:close()
                result(true)
            else
                fail("Cannot save setting")
            end
        else
            fail("No setting founds")
        end
    else
        fail("User not found")
    end
end

function SystemController:application(...)
    auth_or_die("User unauthorized. Please login")
    local rq = nil
    if REQUEST.query.json ~= nil then
        rq = (JSON.decodeString(REQUEST.query.json))
    else
        rq = REQUEST.query
    end

    if rq.path ~= nil then
        local pkg = require("vfs").ospath(rq.path)
        if pkg == nil then
            pkg = WWW_ROOT.. "/packages/" .. rq.path
        --die("unkown request path:"..rq.path)
        end
        pkg = pkg .. "/api.lua"
        if unix.exists(pkg) then
            dofile(pkg).exec(rq.method, rq.arguments)
        else
            fail("Uknown  application handler: " .. pkg)
        end
    else
        fail("Uknown request")
    end
end
