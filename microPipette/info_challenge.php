<?php
if (!(file_exists("dataCh/{$_SERVER['cn']}"))) {
    file_put_contents("dataCh/".$_SERVER['cn'], 0);
}
$dir = getcwd() . '/dataCh/';
$files = scandir($dir);
$json="";
foreach($files as $file) {
    if (strpos($file, '.') === false) {
        
        $json.='{"name": "'.$file.'", "score": '.file_get_contents($dir . $file).'},';
    }
}
print "[".substr($json, 0, -1)."]";
?>