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
	    move_uploaded_file($_FILES["filename"]["tmp_name"], $target_file);
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
		mysqli_query($conn, $sql);
		$rearrange = "UPDATE bookmarks SET id = id - 1 WHERE id > $bookmark_id";
		break;
	case 'move':
		$bookmark_id = $_POST['id'];
		$category_name = $_POST['category_name'];
		$find_sql = "SELECT CategoryPosition FROM bookmarks WHERE category='$category_name' LIMIT 1";
		$current_categoryposition_query = mysqli_query($conn, $find_sql);
		while ($row = mysqli_fetch_assoc($current_categoryposition_query)) {
			$current_categoryposition = $row['CategoryPosition'];
		}
		$delete_sql = "DELETE FROM bookmarks WHERE category='$category_name' AND LinkName='New LinkName'";
		mysqli_query($conn, $delete_sql);
		$sql = "UPDATE bookmarks SET category='$category_name', CategoryPosition=$current_categoryposition WHERE id=$bookmark_id";
		echo $sql;
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
		$update_sql = "SELECT CategoryPosition FROM bookmarks WHERE idUsers=".$_SESSION['id'];
		$position_list = mysqli_query($conn, $update_sql);
		$position_values = array();
		if (mysqli_num_rows($position_list) > 0) {
            while($row = mysqli_fetch_assoc($position_list)) {
            	if(!in_array($row, $position_values))
            		array_push($position_values, $row);
            }
		}
		sort($position_values);
		for($x = 1; $x < count($position_values)+1; $x++) { 
		    $temp_sql = "UPDATE bookmarks SET CategoryPosition=$x WHERE CategoryPosition=".$position_values[$x-1]['CategoryPosition'];
		    mysqli_query($conn, $temp_sql);
		}
		$current_position_sql = "SELECT CategoryPosition from bookmarks WHERE category='$category_name_position' limit 1";
		$current_position_query = mysqli_query($conn, $current_position_sql);
		while ($row = mysqli_fetch_assoc($current_position_query)) {
			$current_position = $row['CategoryPosition'];
		}
		if ($current_position > $category_position) {
			$update_again = "UPDATE bookmarks SET CategoryPosition = CategoryPosition + 1 WHERE CategoryPosition >= $category_position AND CategoryPosition < $current_position";
			mysqli_query($conn, $update_again);
		} else if ($current_position < $category_position){
			$update_again = "UPDATE bookmarks SET CategoryPosition = CategoryPosition - 1 WHERE CategoryPosition > $current_position AND CategoryPosition <= $category_position";
			mysqli_query($conn, $update_again);
		}
		$sql = "UPDATE bookmarks SET CategoryPosition=$category_position WHERE category='$category_name_position'";
		break;
	case 'create_category':
		$create_category_name = $_POST['create_category_name'];
		$create_category_position = $_POST['create_category_position'];
		$update_sql = "SELECT CategoryPosition FROM bookmarks WHERE idUsers=".$_SESSION['id'];
		$position_list = mysqli_query($conn, $update_sql);
		$position_values = array();
		if (mysqli_num_rows($position_list) > 0) {
            while($row = mysqli_fetch_assoc($position_list)) {
            	if(!in_array($row, $position_values))
            		array_push($position_values, $row);
            }
		}
		sort($position_values);
		for($x = 1; $x < count($position_values)+1; $x++) { 
		    $temp_sql = "UPDATE bookmarks SET CategoryPosition=$x WHERE CategoryPosition=".$position_values[$x-1]['CategoryPosition'];
		    mysqli_query($conn, $temp_sql);
		}
		$update_sql = "UPDATE bookmarks SET CategoryPosition = CategoryPosition + 1 WHERE CategoryPosition >= $create_category_position";
		mysqli_query($conn, $update_sql);
		$sql = "INSERT INTO bookmarks (idUsers, category, LinkName, adress, CategoryPosition, LinkPosition) VALUES (".$_SESSION['id'].", '".$create_category_name."', 'New LinkName', 'New Link', ".$create_category_position.", 1)";
		break;
	case 'bookmark_upload':
		$adress = file_upload();
		$category_name = $_POST['category_name'];
		$linkname = $_POST['linkname'];
		$linkposition = $_POST['linkposition'];
		$category_query = "SELECT CategoryPosition FROM bookmarks WHERE category='$category_name' limit 1";
		$category_positions = mysqli_query($conn, $category_query);
		$delete_sql = "DELETE FROM bookmarks WHERE category='$category_name' AND LinkName='New LinkName'";
		mysqli_query($conn, $delete_sql);
		if (mysqli_num_rows($category_positions) > 0) {
            while($row = mysqli_fetch_assoc($category_positions)) {
               $category_position = $row['CategoryPosition'];
            }
		}

		$update_sql = "UPDATE bookmarks SET LinkPosition = LinkPosition + 1 WHERE LinkPosition >= $linkposition AND category = '$category_name'";
		echo $update_sql;
		mysqli_query($conn, $update_sql);
		$sql = "INSERT INTO bookmarks (idUsers, category, LinkName, adress, CategoryPosition, LinkPosition) VALUES (".$_SESSION['id'].", '".$category_name."', '".$linkname."', '".$adress."', ".$category_position.", $linkposition)";
		break;
	case 'get_bookmarks':
		$category_for_link = $_POST['category_name'];
		$sql = "SELECT * FROM bookmarks WHERE category = '$category_for_link'";
		$linkpositions = mysqli_query($conn, $sql);
		$returned_linkpositions = array();
		while ($row = mysqli_fetch_assoc($linkpositions)) { 
			if ($row['LinkName'] !== 'New LinkName')
			array_push($returned_linkpositions, $row['LinkPosition']);
		}
		echo (json_encode($returned_linkpositions));
		exit();
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
