sqlite = modules.sqlite()

if sqlite == nil then return 0 end
require("OOP")
-- create class
DBModel = Object:inherit{db=nil, name=''}

function DBModel:createTable(m)
	if self:available() then return true end
	local sql = "CREATE TABLE "..self.name.."(id INTEGER PRIMARY KEY"
	for k, v in pairs(m) do
		if k ~= "id" then
			sql = sql..","..k.." "..v
		end
	end
	sql = sql..");"
	return sqlite.query(self.db,sql) == 1 
end

function DBModel:insert(m)
	local keys = {}
	local values = {}
	for k,v in pairs(m) do
		if k ~= "id" then
			table.insert(keys,k)
			if type(v) == "number" then
				table.insert(values, v)
			else
				local t = "\""..utils.escape(v).."\""
				table.insert(values,t)
			end
		end
	end
	local sql = "INSERT INTO "..self.name.." ("..table.concat(keys,',')..') VALUES ('
	sql = sql..table.concat(values,',')..');'
	return sqlite.query(self.db, sql) == 1
end

function DBModel:get(id)
	return sqlite.select(self.db, self.name,"id="..id)[0]
end

function DBModel:getAll()
	local sql = "SELECT * FROM "..self.name
	return sqlite.select(self.db, self.name, "1=1")
end

function DBModel:find(cond)
	return sqlite.select(self.db, self.name, cond)
end

function DBModel:query(sql)
	return sqlite.query(self.db, sql) == 1
end

function DBModel:update(m)
	local id = m['id']
	if id ~= nil then
		local lst = {}
		for k,v in pairs(m) do
			if(type(v)== "number") then
				table.insert(lst,k.."="..v)
			else
				table.insert(lst,k.."=\""..utils.escape(v).."\"")
			end
		end
		local sql = "UPDATE "..self.name.." SET "..table.concat(lst,",").." WHERE id="..id..";"
		return sqlite.query(self.db, sql) == 1
	end
	return false
end

function DBModel:available()
	return sqlite.hasTable(self.db, self.name) == 1
end
function DBModel:delete(id)
	local sql = "DELETE FROM "..self.name.." WHERE id="..id..";"
	return sqlite.query(self.db, sql) == 1
end

function DBModel:lastInsertID()
	return sqlite.lastInsertID(self.db)
end

function DBModel:close()
	if self.db then
		sqlite.dbclose(self.db)
	end
end
function DBModel:open()
	if self.db ~= nil then
		self.db = sqlite.getdb(self.db)
	end
end