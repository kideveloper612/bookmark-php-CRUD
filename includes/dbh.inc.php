<?php
$dBServername = "localhost";
$dBUsername = "root";
$dBPassword = "";
$dBName = "bookmarks";

// Create connection
$conn = mysqli_connect($dBServername, $dBUsername, $dBPassword, $dBName, '3307');

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
