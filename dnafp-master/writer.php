<?
$a = new stdClass();
$a -> studentData = $_REQUEST['studentData'];
$a -> stats = json_decode($_REQUEST['stats']);
$a -> netid =$_SERVER['cn'];
$info= "${_SERVER['cn']},${_REQUEST['studentData']}\n";   
file_put_contents("data/winners.csv",$info, FILE_APPEND | LOCK_EX); 

$a = json_encode($a);
file_put_contents("data/".$_SERVER['cn'],$a);
print($a);
?>