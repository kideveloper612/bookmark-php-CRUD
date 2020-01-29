<!DOCTYPE html>
<html>
<body>

<?php

function val_sort($array,$key) {
	//Loop through and get the values of our specified key
	foreach($array as $k=>$v) {
		$b[] = strtolower($v[$key]);
	}

    asort($b);

    foreach($b as $k=>$v) {
		$c[] = $array[$k];
	}

    return $c;
}



$sql = "SELECT * FROM bookmarks";
$result = $conn->query($sql);
$all_info = array();


if ($result->num_rows > 0) {
    
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $users = $row["idUsers"];
        $session_user = $_SESSION['id'];

        if ($users == $session_user) {
            array_push($all_info,$row);
            }
        }
    }

$conn->close();


// Category start
// Sorts on CategoryPosition.
$sorted = val_sort($all_info, 'CategoryPosition');

$all_category = [];

foreach ($sorted as $loopdata) {
    $category = $loopdata["category"];
    array_push($all_category,$category);
    //echo $category."<br>";
}
$category = array_unique($all_category);

foreach ($category as $loopdata) {
    //echo "<a href='#news'>$loopdata<br></a>";
}
echo "<br>";
// Category stopp


// Links Start
// Sorts on category. Array is already sorted on LinkPosition.
foreach ($category as $loopdata) {
    //echo $loopdata."<br>";
    $a = $loopdata;

    foreach ($sorted as $loopdata) {
        if ($a == $loopdata["category"]) {
            $adress = $loopdata["adress"];
            $LinkName = $loopdata["LinkName"];
            //echo '<a href="'.$adress.'">'.$LinkName.'</a>'."<br>";
        }
    }
    echo "<br>";
}
// Links stopp


?>
<table style="width:100%" class="first_row">
    <tr>
        <td style="width:200px"><?php foreach ($category as $loopdata) {echo "<a href='#news'>$loopdata<br></a>";} ?></td>
        <td><?php foreach ($category as $loopdata) {echo '<a href="'.$adress.'">'.$LinkName.'</a>'."<br>";} ?></td>
    </tr>
</table>


<br>

</body>
</html> 