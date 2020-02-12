<?php
header('Access-Control-Allow-Origin: *');
if ($_POST['type'] === 'landing'){ ?>
	<header>
	<div class="header-login">
		<?php
		if (!isset($_SESSION['id'])) {
			echo 
				'<form id="login">
				<input type="text" name="mailuid" placeholder="E-mail/Username">
				<input type="password" name="pwd" placeholder="Password">
				<div class="sign_in_up">
				  <button type="submit" name="login-submit">Login</button>
				  <button class="sign_up_button">Sign Up</button>
				</div>
				</form>
				';
			exit();
		}
		else if (isset($_SESSION['id'])) {
		  	echo 
		  		'<form action="includes/logout.inc.php" method="post">
		        <button type="submit" name="login-submit">Logout</button>
		      	</form>';
		  	require "extension_bookmarks.php"; 
		  	exit();
		} ?>
	</div>
	</header>
<?php } ?>