<?php
require 'adminCheck.php';
// New file
if (!(file_exists("data/{$_SERVER['cn']}"))) {
    $a = new stdClass();
    $b = new stdClass();
    $c = new stdClass();
    $a -> studentData = $b;
    $a -> stats = $c;
    $a ->name = $_SERVER['cn'];
    file_put_contents("data/".$_SERVER['cn'], json_encode($a));
    $contents=$a;
}
else{
$contents = file_get_contents("data/".$_SERVER['cn']);
$contents = json_decode($contents);
}
// Print netID, score, and firstname
$contents->name = $_SERVER['cn'];
$contents->firstname = $_SERVER['givenName'];
$contents->isAdmin=$isAdmin;
print(json_encode($contents));
?>
