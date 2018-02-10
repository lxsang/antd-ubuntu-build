auth_or_die("User unauthorized. Please login")
local rq = (JSON.decodeString(REQUEST.query.json))
if(rq ~= nil and rq.table ~= nil) then
    local model = require("db.model").get(SESSION.iotos_user, rq.table, nil)
    local ret
    if model == nil then
        fail("Cannot get table metadata:"..rq.table)
    else
        if(rq.id == nil ) then
            model:close()
            return fail("Unknow element to delete")
        else
            ret = model:delete(rq.id)
            model:close()
        end
        
        result(ret)
    end
else
    fail("Unknown database request")
end