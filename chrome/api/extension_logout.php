<?php
session_start();
session_unset();
session_destroy();
require ('extension_index.php');
