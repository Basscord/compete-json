<?php
$site = $_GET['site']; // TODO: Strip Protocol, Sanitize, etc.
exec("./phantomjs compete.js $site", $o, $e);
header('Content-type: application/json');
echo $o[0];
?>