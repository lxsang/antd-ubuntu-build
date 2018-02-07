local model = {}
sqlite.getdb(SESSION.iotos_user)
model.get = function(tbl, data)
    local db = DBModel:new{name=tbl}
    if db:available() then return db end
    if data == nil then return nil end
    local meta = {}
    --print(JSON.encode(data))
    for k,v in pairs(data) do
        if type(v) == "number" then
            meta[k] = "NUMERIC"
        else
            meta[k] = "TEXT"
        end
    end
    db:createTable(meta)
    return db
end
return model