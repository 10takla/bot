<?php
include 'mysql/connect_sql.php';


$result = sql( "SELECT * FROM planet" );

while ( $db = mysqli_fetch_assoc( $result ) ) {
	$name = $db['name'];
	$dir  = $_SERVER['DOCUMENT_ROOT'] . "/textures/$name";

	if ( ! file_exists( $dir ) ) {
		mkdir( $dir, 0777, true );
	}

	foreach ( array_diff( scandir( $dir ), array( '..', '.' ) ) as $key => $texture ) {
		$format = strstr( $texture, '.', true );
		$format = strstr( $format, '_', false );
		$format = str_replace( '_', '', $format );
		switch ( $format ) {
			case '4K':
				$db['textures']['4K'][] = $texture;
				break;
			default:
				$db['textures']['2K'][] = $texture;
		}
	}


	$db['plots'] = sql_get( "SELECT * FROM plot WHERE id_planet = $db[id_planet]" );
	foreach ( $db['plots'] as $key => $plot ) {
		if ( isset( $plot['id_user'] ) ) {
			$db['plots'][$key]['user'] = sql_get( "SELECT * FROM user WHERE id_user = $plot[id_user]" );
		}
	}


	$arr[$name] = $db;

}

print_r( json_encode( $arr ) );