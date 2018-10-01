<?php
define("__DS__" ,"/");
$_REQUEST = __REQUEST__;
$_HEADER = $_REQUEST["__xheader__"];
$GLOBALS["_".$_REQUEST["method"]] = array();
foreach ($_REQUEST as $key => $value) {
    if($key == "method" || $key == "__xheader__")
        continue;
        $GLOBALS["_".$_REQUEST["method"]][$key] = $value;
}

// the header function
function header($name, $value)
{
    echo($name.": ".$value);
}

function status($code, $msg)
{
    echo("HTTP/1.1 ".$code." ".$msg);
}
function flush()
{
    echo("\r\n");
}

function redirect($url, $ctype="text/html")
{
    status(301, "Moved Permanently");
    header("Content-Type",$ctype);
    header("Location", $url);
    flush();
}

function minimal_header($ctype, $code=200, $msg="OK")
{
    status($code,$msg);
    header("Content-Type", $ctype);
    flush();
}
function html($code=200, $msg="OK")
{
    minimal_header("text/html; charset=utf-8", $code, $msg);
}

function json()
{
    minimal_header("application/json");
}

function text()
{
    minimal_header("text/plain; charset=utf-8");
}

function textstream()
{
    minimal_header("text/event-stream");
}

function octstream($name)
{
    status(200,"OK");
    header("Content-Type", "application/octet-stream");
    header("Content-Disposition", "attachment; filename=\"".$name."\"");
    flush();
}

function jpeg()
{
    minimal_header("image/jpeg");
}

function cookie($ctype, $arr, $path="/")
{
    status(200, "0K");
    header("Content-Type", $ctype);
    foreach ($arr as $key => $value) {
        header("Set-Cookie", $key."=".$value."; Path=".$path);
    }
    flush();
}

function unknown()
{
    minimal_header("text/html", 404, "Not found");
}

$__inc_path = __ROOT__.__DS__.__PATH__;
if( is_dir($__inc_path))
    $__inc_path = $__inc_path.__DS__."index.php";
include($__inc_path);

?>