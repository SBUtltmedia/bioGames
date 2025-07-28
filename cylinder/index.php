<?php
print_r($_SERVER);
exit;
$server=$_SERVER["SERVER_NAME"];
$directory=$_SERVER['REQUEST_URI'];

print <<<EOT
<script>
window.location="https://${server}${directory}page.html"+location.search
</script>
EOT;
