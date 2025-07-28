<?php
if (!(file_exists("data/{$_SERVER['cn']}"))) {
    $a = new stdClass();
    $b = new stdClass();
    $a -> stats = $b;
    $a ->name = $_SERVER['cn'];
    $a = json_encode($a);
    file_put_contents("data/".$_SERVER['cn'], $a);
}
$contents = file_get_contents("data/".$_SERVER['cn']);
$contents = json_decode($contents);
// Print netID, score, and firstname
$contents->name = $_SERVER['cn'];
$contents->firstname = $_SERVER['givenName'];
print(json_encode($contents));
?>
