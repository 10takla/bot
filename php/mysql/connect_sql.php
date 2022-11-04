<?php
$link = mysqli_connect(
    'localhost',
    'root',
    '',
    'planet'
) or die('Не удалось соединиться: ' . mysqli_error());;

if ($link == false) {
    print("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());
}

if (!function_exists('sql')) {
    function sql($text)
    {
        global $link;
        return mysqli_query($link, $text);
    }
}


if (!function_exists('sql_get')) {
    function sql_get($text, $col = null, $row = null)
    {
        global $link;
	    $arr = array();
        $result = mysqli_query($link, $text);
        $i = 0;
        while ($db = mysqli_fetch_assoc($result)) {
            if ($col != null) {
                $arr[] = $db[$col];
            } else {
                $arr[] = $db;
            }
            $i++;
            if ($i == $row) {
                return $arr;
            }
        }
        return $arr;
    }
}

if (!function_exists('get_data_type')) {
    function get_data_type($type)
    {
        switch ($type) {
            case 'int':
                return 'type="number"';
            case 'float':
                return 'type="number"';
            case 'date':
                return 'type="date"';
            case 'mail':
                return 'type="mail"';
            case 'tel':
                return 'type="tel"';
            default:
                return '';
        }
    }
}
