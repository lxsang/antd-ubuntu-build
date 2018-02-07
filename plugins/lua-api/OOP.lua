Object = {}
function Object:new(o)
	o = o or {}     -- create table if user does not provide one
	setmetatable(o, self)
	self.__index = self
	return o
end

function Object:print()
	print('an Object')
end

function Object:asJSON()
	return '{}'
end

function Object:inherit(o)
	return self:new(o)
end

Test = Object:inherit{dummy = 0}

function Test:toWeb()
	wio.t(self.dummy)
end