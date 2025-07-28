<?php
require "adminCheck.php";
$dir = getcwd() . '/data/';
$files = scandir($dir);
$json="";
if($isAdmin){
foreach($files as $file) {
    if (strpos($file, '.') === false) {
        $contents = file_get_contents($dir . $file);
        $contents = json_decode($contents);
        $contents->name = $file;
        $contents = json_encode($contents);
        $json .= $contents . ",";
    }
}
}
print "[".substr($json, 0, -1)."]";
?>
