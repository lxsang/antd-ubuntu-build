auth_or_die("User unauthorized. Please login")
local rq = (JSON.decodeString(REQUEST.query.json))
if(rq ~= nil and rq.table ~= nil) then
    local model = require("db.model").get(rq.table, rq.data)
    local ret
    if model == nil then
        fail("Cannot get table metadata:"..rq.table)
    else
        if(rq.data.id ~= nil and rq.data.id > 0) then
            ret = model:update(rq.data)
        else
            ret = model:insert(rq.data)
        end
        sqlite.dbclose()
        if ret == true then
            result(ret)
        else
            fail("Cannot modify/update table "..rq.table)
        end
    end
else
    fail("Unknown database request")
end