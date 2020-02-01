<?php
session_start();
if (empty($_SESSION['id']))
	header("Location: ./index.php");

require './includes/dbh.inc.php';

function file_upload(){
	if (!file_exists('uploads/')) {
	    mkdir('uploads/', 0777, true);
	}

	$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["filename"]["name"]);
	$uploadOk = 1;
	// Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["filename"]["tmp_name"]);
    if($check !== false) {
        echo "File is " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "Not exists file.";
        $uploadOk = 0;
    }
	// Check if file already exists
	if (file_exists($target_file)) {
	    echo "Sorry, file already exists.";
	    $uploadOk = 0;
	}
	// Check file size
	if ($_FILES["filename"]["size"] > 500000) {
	    echo "Sorry, your file is too large.";
	    $uploadOk = 0;
	}

	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	    echo "Sorry, your file was not uploaded.";
	// if everything is ok, try to upload file
	} else {
	    if (move_uploaded_file($_FILES["filename"]["tmp_name"], $target_file)) {
	        echo "The file ". basename( $_FILES["filename"]["name"]). " has been uploaded.";
	    } else {
	        echo "Sorry, there was an error uploading your file.";
	    }
	}
	return $target_file;
}

if (isset($_POST['method'])) {
	$method = $_POST['method'];
} else {
	echo "Invalid request";
	exit();
}

$sql = '';
switch ($method) {
	case 'edit':
		$bookmark_id = $_POST['id'];
		$bookmark_name = $_POST['bookmark_name'];
		$bookmark_link = $_POST['bookmark_link'];
		$sql = "UPDATE bookmarks SET LinkName='$bookmark_name', adress='$bookmark_link' WHERE id=$bookmark_id";
		break;
	case 'delete':
		$bookmark_id = $_POST['id'];
		$sql = "DELETE FROM bookmarks WHERE id=$bookmark_id";
		break;
	case 'move':
		$bookmark_id = $_POST['id'];
		$category_name = $_POST['category_name'];
		$sql = "UPDATE bookmarks SET category='$category_name' WHERE id=$bookmark_id";
		break;
	case 'category_edit':
		$old_category_name = $_POST['old_category_name'];
		$new_category_name = $_POST['new_category_name'];
		$sql = "UPDATE bookmarks SET category='$new_category_name' WHERE category='$old_category_name'";
		break;
	case 'category_delete':
		$delete_category = $_POST['delete_category'];
		$sql = "DELETE FROM bookmarks WHERE category='$delete_category'";
		break;
	case 'category_move':
		$category_name_position = $_POST['category_name_position'];
		$category_position = $_POST['category_position'];
		$sql = "UPDATE bookmarks SET CategoryPosition=$category_position WHERE category='$category_name_position'";
		break;
	case 'create_category':
		$create_category_name = $_POST['create_category_name'];
		$create_category_position = $_POST['create_category_position'];
		$sql = "INSERT INTO bookmarks (idUsers, category, LinkName, adress, CategoryPosition, LinkPosition) VALUES (".$_SESSION['id'].", '".$create_category_name."', 'New LinkName', 'New Link', ".$create_category_position.", 1)";
		break;
	case 'bookmark_upload':
		$adress = file_upload();
		$category_name = $_POST['category_name'];
		$linkname = $_POST['linkname'];
		$linkposition = $_POST['linkposition'];
		$category_query = "SELECT CategoryPosition FROM bookmarks WHERE category='$category_name' limit 1";
		$category_positions = mysqli_query($conn, $category_query);
		if (mysqli_num_rows($category_positions) > 0) {
            while($row = mysqli_fetch_assoc($category_positions)) {
               $category_position = $row['CategoryPosition'];
            }
		} 
		$sql = "INSERT INTO bookmarks (idUsers, category, LinkName, adress, CategoryPosition, LinkPosition) VALUES (".$_SESSION['id'].", '".$category_name."', '".$linkname."', '".$adress."', ".$category_position.", $linkposition)";
	default:
		break;
}

if (mysqli_query($conn, $sql)) {
		    echo "Success";
		} else {
		    echo "Occured error: " . mysqli_error($conn);
		}
mysqli_close($conn);
exit();
