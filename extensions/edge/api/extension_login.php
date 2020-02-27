<?php
// setcookie('cross-site-cookie', 'name', ['samesite' => 'None', 'secure' => true]);
header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
// Here we check whether the user got to this page by clicking the proper login button.
if (isset($_POST['login-submit'])) {
  require 'extension_db_connect.php';
  $mailuid = $_POST['mailuid'];
  $password = $_POST['pwd'];
  if (empty($mailuid) || empty($password)) {
    echo "Empty Username or Password";
    require("extension_index.php");
    exit();
  }
  else {
    $sql = "SELECT * FROM users WHERE uidUsers=? OR emailUsers=?;";
    $stmt = mysqli_stmt_init($conn);
    if (!mysqli_stmt_prepare($stmt, $sql)) {
      echo "DB Error";
      require("extension_index.php");
      exit();
    }
    else {
      mysqli_stmt_bind_param($stmt, "ss", $mailuid, $mailuid);
      mysqli_stmt_execute($stmt);
      $result = mysqli_stmt_get_result($stmt);
      if ($row = mysqli_fetch_assoc($result)) {
        $pwdCheck = password_verify($password, $row['pwdUsers']);
        if ($pwdCheck == false) {
          echo "Invalid Credential";
          require("extension_index.php");
          exit();
        }
        else if ($pwdCheck == true) {
          session_start();
          $_SESSION['id'] = $row['idUsers'];
          $_SESSION['uid'] = $row['uidUsers'];
          $_SESSION['email'] = $row['emailUsers'];
        }
        
      }
    }
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
  }
}
require("extension_index.php");
exit();