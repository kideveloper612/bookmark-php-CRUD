<?php
// header('Access-Control-Allow-Origin: *');
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
$login_form_display = 'block';
$signup_form_display = 'none';
if (!isset($_SESSION['id'])) { ?>
	<header>
		<div class="header-login">
			<form id="login" style="display: <?php echo $login_form_display; ?>;">
				<input type="text" name="mailuid" placeholder="E-mail/Username">
				<input type="password" name="pwd" placeholder="Password">
				<div class="sign_in_up">
					<button type="submit" name="login-submit">Login</button>
					<a class="sign_up_button">Sign Up</a>
				</div>
			</form>
			<form id="signup" style="display: <?php echo $signup_form_display; ?>;">
				<input type="text" name="uid" placeholder="Username">
				<input type="text" name="mail" placeholder="E-mail">
				<input type="password" name="pwd" placeholder="Password">
				<input type="password" name="pwd-repeat" placeholder="Repeat Password">
				<div class="sign_in_up">
					<button type="submit" name="signup-submit">Sign Up</button>
					<a class="log_in_button">Login</a>
				</div>
			</form>
		</div>
	</header>
<?php
	exit();
}
else if (isset($_SESSION['id'])) {
  	echo '
	  	<header>
			<div class="header-login">
			  	<form id="logout">
		        	<button type="submit" name="login-submit">Logout</button>
		      	</form>
	      	</div>
		</header>
		';
  	require "extension_bookmarks.php"; 
  	exit();
} ?>
