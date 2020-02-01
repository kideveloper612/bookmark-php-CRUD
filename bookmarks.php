
<?php

function cmp($a, $b) {
    $c = $a['CategoryPosition'] - $b['CategoryPosition'];
    $c .= strcmp($b['category'], $a['category']);
    $c .= $a['LinkPosition'] - $b['LinkPosition'];
    return $c;
}

$sql = "SELECT * FROM bookmarks";
$result = $conn->query($sql);
$all_info = array();
$category_list = array();
$category_position = array();

if ($result->num_rows > 0) {
    
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $users = $row["idUsers"];
        $session_user = $_SESSION['id'];

        if ($users == $session_user) {
            array_push($all_info,$row);
            array_push($category_list, $row['category']);
            array_push($category_position, $row['CategoryPosition']);
            }
        }
    }

$conn->close();
usort($all_info, 'cmp');
$category_list = array_count_values($category_list);
$category_position = array_unique($category_position);
?>

<input type="text" name="category_list" value='<?= json_encode($category_list); ?>' hidden>
<input type="text" name="category_position" value='<?= json_encode($category_position); ?>' hidden>
<input type="text" name="all_info" value='<?= json_encode($all_info); ?>' hidden>
<nav id="menu">
    <ul class="parent-menu">
        <?php 
            $count = 0;
            foreach ($category_list as $category_name => $category_count) { ?>
            <li><a href="#" class="category_name"><?= $category_name ?></a>
                <a class="category_edit" title="Edit" value="<?= $category_name; ?>"><i class="material-icons">&#xE254;</i></a>
                <a class="category_delete" title="Delete" value="<?= $category_name; ?>"><i class="material-icons">&#xE872;</i></a>
                <a class="category_move" title="Move" value="<?= $category_name; ?>"><i class="material-icons">&#xe14d;</i></a>
                <ul>
                    <?php 
                    for ($i=$count; $i<$count+$category_count; $i++) { ?>
                        <li>
                            <a href="<?= $all_info[$i]['adress']; ?>" class="bookmark_name" target="_blank"><?= $all_info[$i]['LinkName']; ?></a>
                            <a class="bookmark_edit" title="Edit" id="bookmark_edit" value='<?= json_encode($all_info[$i]); ?>'>
                                <i class="material-icons">&#xE254;</i>
                            </a>
                            <a class="bookmark_delete" title="Delete" id="bookmark_delete" value='<?= json_encode($all_info[$i]); ?>'>
                                <i class="material-icons">&#xE872;</i>
                            </a>
                            <a class="bookmark_move" title="Move" id="bookmark_move" value='<?= json_encode($all_info[$i]); ?>'>
                                <i class="material-icons">&#xe14d;</i>
                            </a>
                        </li>
                    <?php } 
                        $count += $category_count;
                    ?>
                </ul>
            </li>
        <?php } ?>
        <li>
            <button type="button" class="btn btn-info addButton"><i class="fa fa-bookmark"></i>&nbsp;Add</button>
            <button type="button" class="btn btn-info uploadButton"><i class="fa fa-upload"></i>&nbsp;Upload</button>
        </li>
    </ul>
</nav>

<div class="modal" id="Modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title"></h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-success" id="modal_button"></button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
        </div>
    </div>
</div>
