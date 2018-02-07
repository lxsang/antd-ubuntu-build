local get
get =  function(vfsfile)
	auth_or_die("User unauthorized. Please login")
	local r,m = require("fs.vfs").checkperm(vfsfile,'read')
	if r then
		std.header(std.mimeOf(m))
		if std.is_bin(m) then
			std.fb(m)
		else
			std.f(m)
		end
	else
		fail(m)
	end
end

return get;
