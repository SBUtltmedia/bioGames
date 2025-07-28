<?php
print_r($_SERVER);
print $_SERVER['cn'];
$a = $_POST['highScoreCh'];
file_put_contents("dataCh/".$_SERVER['cn'],$a);

?>
