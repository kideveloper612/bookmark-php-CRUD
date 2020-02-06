<?php
session_start();
if (empty($_SESSION['id']))
	header("Location: ./index.php");

require './includes/dbh.inc.php';
// Assuming you installed from Composer:
require "simplehtmldom_1_9_1/simple_html_dom.php";

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
	case 'create_bookmark':
		$create_bookmark_name = $_POST['create_bookmark_name'];
		$create_bookmark_link = $_POST['create_bookmark_link'];
		$create_bookmark_position = $_POST['create_bookmark_position'];
		$category = $_POST['category_name_bookmark'];
		$category_position_sql = "SELECT CategoryPosition FROM bookmarks WHERE category='$category' LIMIT 1";
		$category_query = mysqli_query($conn, $category_position_sql);
		if (mysqli_num_rows($category_query) > 0) {
            while($row = mysqli_fetch_assoc($category_query)) {
            	$create_category_position = $row['CategoryPosition'];
            }
		}
		$update_sql = "SELECT LinkPosition FROM bookmarks WHERE category='$category'";
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
		    $temp_sql = "UPDATE bookmarks SET LinkPosition=$x WHERE LinkPosition=".$position_values[$x-1]['LinkPosition'];
		    mysqli_query($conn, $temp_sql);
		}
		$update_sql = "UPDATE bookmarks SET LinkPosition = LinkPosition + 1 WHERE LinkPosition >= $create_bookmark_position";
		mysqli_query($conn, $update_sql);
		$sql = "INSERT INTO bookmarks (idUsers, category, LinkName, adress, CategoryPosition, LinkPosition) VALUES (".$_SESSION['id'].", '".$category."', '$create_bookmark_name', '$create_bookmark_link', ".$create_category_position.", '$create_bookmark_position')";
		echo $sql;
		break;
	case 'bookmark_upload':
		$html = file_get_html($_FILES["filename"]["tmp_name"]);
		$DTs = array();
		foreach($html->find('DT>H3') as $DTH3) {
			if (trim($DTH3->innertext) === 'Bookmarks bar') continue;
			$DLP = $DTH3->parent()->next_sibling();
			$key = $DTH3->innertext;
			$bookmarks = array();
			foreach ($DLP->find('DT>A') as $DTA) {
				$bookmark = $DTA->innertext;
				$address = $DTA->href;
				array_push($bookmarks, [$bookmark, $address]);
			}
			$DTs[$key] = $bookmarks;
		}
		$current_category_position_sql = "SELECT CategoryPosition FROM bookmarks WHERE idUsers=".$_SESSION['id'];
		$current_category_position = mysqli_query($conn, $current_category_position_sql);
		$position_values = array();
		if (mysqli_num_rows($current_category_position) > 0) {
            while($row = mysqli_fetch_assoc($current_category_position)) {
            	if(!in_array($row, $position_values))
            		array_push($position_values, $row['CategoryPosition']);
            }
		}
		$category_position = max($position_values);
		foreach ($DTs as $category => $bookmarks) {
			$category_position += 1;
			$link_position = 0;
			foreach ($bookmarks as $bookmark) {
				$bookmark_name = $bookmark[0];
				$bookmark_link = $bookmark[1];
				$link_position += 1;
				$sql = "INSERT INTO bookmarks (idUsers, category, LinkName, adress, CategoryPosition, LinkPosition) VALUES (".$_SESSION['id'].", '".$category."', '$bookmark_name', '$bookmark_link', ".$category_position.", '$link_position')";
				mysqli_query($conn, $sql);
			}
		}
		exit();
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
