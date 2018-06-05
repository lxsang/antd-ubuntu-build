<?lua
local arg = {...}

local path = require("fs/vfs").ospath("home://aiws/blog-clustering")
local gettext = loadfile(path.."/gettext.lua")()
local cluster = loadfile(path.."/cluster.lua")()
loadscript(BLOG_ROOT.."/view/top.ls")("Welcome to my blog", false)
local data = gettext.get({publish=1})
local documents = {}
if data then
    local sw = gettext.stopwords("home://aiws/blog-clustering/stopwords.txt")
    for k,v in pairs(data) do
        local bag = cluster.bow(data[k].content, sw)
        documents[data[k].id] = bag
    end
    cluster.tfidf(documents)
    --local v = cluster.search("arm", documents)
    --echo(JSON.encode(v))
    local vectors, maxv, size = cluster.get_vectors(documents)
    local sample_data = {pid = 1, sid = 2, score = 0.1}
    local db = require("db.model").get("mrsang", "st_similarity", sample_data)
    if db then
        -- purge the table
        db:delete({["="] = {["1"] = 1}})
        -- get similarity and put to the table
        for id,v in pairs(vectors) do
            local top = cluster.top_similarity(id,vectors,3)
            for a,b in pairs(top) do
                local record = {pid = id, sid = a, score = b}
                db:insert(record)
            end
        end
        echo("<h3>Analyse complete</h3>")
        db:close()
    else
        echo("<h3>Cannot get database objectw/h3>")
    end
    --local s = cluster.save_topchart(vectors,file, 3)
    --if s then echo("file saved") else echo("error save file") end
    --echo(JSON.encode(r))
    --r = cluster.similarity(vectors["14"],vectors["16"])
    --echo("Similarity "..r)
    
    --local c,l = cluster.kmean(3, documents, 10)
    --echo(JSON.encode(c))
    --echo(JSON.encode(l))
else
    echo("<h3>Cannot find data to analyse</h3>")
end

?>