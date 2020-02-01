<?php
  // To make sure we don't need to create the header section of the website on multiple pages, we instead create the header HTML markup in a separate file which we then attach to the top of every HTML page on our website. In this way if we need to make a small change to our header we just need to do it in one place. This is a VERY cool feature in PHP!
  require "header.php";
  // $id = $_SESSION['id']
?>

<div class="card">
  

        <!--
        We can choose whether or not to show ANY content on our pages depending on if we are logged in or not. I talk more about SESSION variables in the login.inc.php file!
        -->
        <?php
        if (!isset($_SESSION['id'])) {
          echo '<p class="login-status">You are logged out!</p>';
          echo '
          <p class="login-status">
            <h1>Produkt</h1>
            <a href="img/dabo_web.png">
              <img src="img/dabo_web.png" alt="Dabo Webbrowser" style="width:100%;height:100%;border:0">
            </a><br>
          </p><br>';

        }
        else if (isset($_SESSION['id'])) {
          // Paste the code here.
          require "bookmarks.php"; 
          
        }
        ?>

</div>
<?php
  // And just like we include the header from a separate file, we do the same with the footer.
  require "footer.php";
?>
