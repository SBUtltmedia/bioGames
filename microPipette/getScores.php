<?php
$dir = getcwd() . '/data/';
$files = scandir($dir);
header('Content-type: text/csv');
header('Content-disposition: attachment;filename=PipetteScores.csv');
print_r("Name,Hints Mode Score,No Hints (P10),No Hints(P100),No Hints (P1000),Challenge Mode Score,Time posted" . PHP_EOL);
foreach($files as $file) {
    if (strpos($file, '.') === false) {
	$a = file_get_contents($dir . $file);
	$a = json_decode($a);
        print_r($file . "," . $a->hintScore . "," . $a->noHints10 . "," . $a->noHints100 . "," . $a->noHints1000 . "," . $a->challengeScore . "," . $a->time . PHP_EOL);
    }
}
?>
