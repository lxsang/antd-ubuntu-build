<?lua
    local arg = {...}
    local title = arg[1]
    local render = arg[2]
    local url = arg[3]
    local tags = arg[4]
    local cls = ""
    if HEADER.mobile then
        cls = "navmobile"
    end
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?=title?></title>
        <meta charset="UTF-8">
        <!--meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://platform.twitter.com/widgets.js https://connect.facebook.net/en_US/sdk.js https://apis.google.com/js/plusone.js https://platform.twitter.com/js/button.556f0ea0e4da4e66cfdc182016dbd6db.js https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.fr.G6aVHqjZQ7w.O/m=plusone/rt=j/sv=1/d=1/ed=1/am=AQE/rs=AGLTcCM3jVZaR98LsOLZhkxFJYLRGgZQ6A/cb=gapi.loaded_0 https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.fr.G6aVHqjZQ7w.O/m=auth/exm=plusone/rt=j/sv=1/d=1/ed=1/am=AQE/rs=AGLTcCM3jVZaR98LsOLZhkxFJYLRGgZQ6A/cb=gapi.loaded_1"-->

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="rst/ubuntu-regular.css" />
        <link rel="stylesheet" type="text/css" href="rst/font-awesome.css" />
        <link rel="stylesheet" type="text/css" href="assets/style.css" />
        <script src="rst/gscripts/riot.min.js"> </script>
        <script src="rst/resources/antos_tags.js"></script>
        <script src="rst/gscripts/jquery-3.2.1.min.js"> </script>
        <script src="rst/main.js"></script>
<?lua if render then ?>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@blog.lxsang.me" />
        <meta name="twitter:creator" content="@lexsang" />
        <meta property="og:url"                content="<?=url?>" />
        <meta property="og:type"               content="blog" />
        <meta property="og:title"              content="<?=title?>" />
        <meta property="og:description"        content="<?=tags?>" />
        <link rel="stylesheet" type="text/css" href="rst/hljs/github.css" />
        <link rel="stylesheet" type="text/css" href="rst/katex/katex.min.css" />
        <script src="rst/hljs/highlight.pack.js"> </script>
        <script src="rst/hljs/highlightjs-line-numbers.min.js"> </script>
        <script src="rst/katex/katex.min.js"> </script>
        <script src="rst/katex/auto-render.min.js"> </script>
<?lua else ?>
        <meta property="og:url"           content="https://blog.lxsang.me" />
        <meta property="og:type"          content="blog" />
        <meta property="og:title"         content="Xuan Sang LE's blog" />
        <meta property="og:description"   content="My personal space" />
<?lua end ?>
        <script>    
            
<?lua if render then ?>
            $(document).ready(function() {
                renderMathInElement($("#container")[0]);
                $('pre code').each(function(i, block) {
                  hljs.highlightBlock(block);
                  hljs.lineNumbersBlock(block);
                });
              });
<?lua end ?>
            window.twttr = (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0],
                    t = window.twttr || {};
                if (d.getElementById(id)) return t;
                js = d.createElement(s);
                js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);

                t._e = [];
                t.ready = function(f) {
                    t._e.push(f);
                };

                return t;
            }(document, "script", "twitter-wjs"));

            // facebook
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            /*(function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
            })();*/
        </script>
    </head>
    <body>
        <div id="fb-root"></div>

        <div id = "top">
            <div id = "navbar" class = "<?=cls?>">
                <div class = "logo"><a href = "https://lxsang.me"></a></div>
                <ul>
                        <li><i class = "fa fa-home"></i><a href="./">Home</a></li>
                        <li ><i class = "fa fa-address-card"></i><a href="https://info.lxsang.me" >Porfolio</a></li>
                        <li><i class = "fa fa-envelope"></i><a href="#" onclick="mailtoMe('rst')" >Contact</a></li>
                        <?lua
                        if not HEADER.mobile then
                        ?>
                        <li> <i class = "fa fa-paper-plane"></i><a href="#" onclick="subscribe('rst')">Subscribe</a></li>
                        <li > <i class = "fa fa-globe"></i><a href = "https://os.lxsang.me" target="_blank">AntOS</a></li>
                        <?lua end ?>
                </ul>
                <?lua
                if not HEADER.mobile then
                ?>
                <input type = "text" class = "search-box"></input>
                <div class= "search-icon"></div>
                <?lua
                end
                ?>
            </div>
        </div>
        <div id = "desktop">
            <div id = "container">
             