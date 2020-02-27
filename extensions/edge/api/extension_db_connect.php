<?php
$dBServername = "dabos.se.mysql";
$dBUsername = "dabos_sebookmarks";
$dBPassword = "Random8246";
$dBName = "dabos_sebookmarks";

// Create connection
$conn = mysqli_connect($dBServername, $dBUsername, $dBPassword, $dBName, '3307');

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
