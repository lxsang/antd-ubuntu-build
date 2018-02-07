auth_or_die("User unauthorized. Please login")
local rq = (JSON.decodeString(REQUEST.query.json))
if(rq ~= nil and rq.table ~= nil) then
    local model = require("db.model").get(rq.table, nil)
    local ret
    if model == nil then
        fail("Cannot get table metadata:"..rq.table)
    else
        if(rq.id == nil ) then
            ret = model:getAll()
        else
            ret = model:get(rq.id)
        end
        sqlite.dbclose()
        result(ret)
    end
else
    fail("Unknown database request")
end