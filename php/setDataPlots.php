<?php
include 'mysql/connect_sql.php';

$id_planet  = $_GET['id_planet'];
$plotLength = $_GET['plotLength'];
$planetName = $_GET['planetName'];

for ( $i = 1; $i <= $plotLength; $i ++ ) {
	sql( "INSERT IGNORE INTO plot (id_plot, id_planet) VALUES ('$planetName $i', $id_planet)" );
}

