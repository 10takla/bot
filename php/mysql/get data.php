<?php
include 'connect_sql.php';


if (!function_exists('get')) {
    function get($column)
    {
        if (isset($_COOKIE['id'])) {
            $result = sql("SELECT $column FROM аккаунт WHERE id_аккаунта = " . $_COOKIE['id'] . ";");
            $db = mysqli_fetch_assoc($result);
            return $db[$column];
        }
    }
}