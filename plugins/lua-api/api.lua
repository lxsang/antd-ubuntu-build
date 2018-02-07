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
	return utils.file_exists(__api__.root..'/'..string.gsub(m,'%.','/')..'.lua')
end

-- OOP support
--require("OOP")
-- load sqlite helper
--require("sqlite")
-- enable extra mime

-- run the file
require('index')
