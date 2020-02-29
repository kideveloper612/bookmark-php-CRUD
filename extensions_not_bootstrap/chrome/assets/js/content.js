var bookmark_name = '';
var bookmark_link = '';
var id = '';
var category_name_move = '';
var old_category_name = '';
var new_category_name = '';
var delete_category = '';
var category_position = '';
var category_name_position = '';
var create_bookmark_name = '';
var create_bookmark_position = '';
var upload_category = '';
var upload_linkname = '';
var upload_linkposition = '';
var uploadfile = '';
var uploadcategory = '';
var uploadlinkname = '';
var uploadlinkposition = '';
var category_name_bookmark = '';
var new_bookmark_link = '';
var create_category_name = '';
var create_category_position ='' ;
var link_position = '';
var submethod = '';

function make_modal() {
	var $modal_dom = '<div class="Modal_Bookmark_container" id="Modal_Bookmark_a"></div><div class="Modal_Bookmark_modal" id="Modal_Bookmark_b"><div class="Modal_Bookmark_header"><div class="Modal_Bookmark_modal_title"></div><a href="javascript: void(0)" class="Modal_Bookmark_cancel">X</a></div><div class="Modal_Bookmark_content"><form></form></div><div class="Modal_Bookmark_footer"><button class="Modal_Bookmark_cancel">Cancel</button><button id="Modal_Bookmark_button"></button></div></div>'
	$('body').append($modal_dom);
}
make_modal();

function modal_view(button_name, header) {
	$("#Modal_Bookmark_a").css("display","block");
    $("#Modal_Bookmark_b").css("display","block");
	$('#Modal_Bookmark_b #Modal_Bookmark_button').html(button_name);
	$('#Modal_Bookmark_b div.Modal_Bookmark_modal_title').html(header);
}

function modal_hide() {
	$("#Modal_Bookmark_a").fadeOut();
    $("#Modal_Bookmark_b").fadeOut();
}

$("#Modal_Bookmark_a").on('click', function(){
 	modal_hide();
	$('#Modal_Bookmark_b form').empty();
});

function ajax_request(payload) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: 'https://dabos.se/extension/api/extension_db_manage.php',
			type: 'POST',
			data:payload,
			success: function(data) {
				console.log(data);
				window.location.reload();
			},
			error: function(e) {
				console.log(e);
				alert('Only work on not ssl sites');
			}
		});
	});
}

$('#Modal_Bookmark_b .Modal_Bookmark_cancel').on('click', function(e){
	modal_hide();
	$('#Modal_Bookmark_b form').empty();
});

$('#Modal_Bookmark_b #Modal_Bookmark_button').click(async function(eve){
	eve.preventDefault();
	var button_name = $('#Modal_Bookmark_b .Modal_Bookmark_modal_title').html();
	$('#Modal_Bookmark_b .Modal_Bookmark_content .Modal_Bookmark_validation_red').remove();
	switch (button_name) {
		case 'Edit Bookmark':
			if (bookmark_name.length === 0 || bookmark_link.length === 0) {
				$('#Modal_Bookmark_b .Modal_Bookmark_content').prepend($('<div>', {class: 'Modal_Bookmark_validation_red', text: 'All fields have to be filled!'}));
				return;
			}
			modal_hide();
			var data = {'id': id,'bookmark_name': bookmark_name, 'bookmark_link': bookmark_link, 'method': 'edit' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Delete Bookmark':
			modal_hide();
			var data = {'id': id, 'method': 'delete' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Move Bookmark':
			modal_hide();
			var data = {'id': id, 'category_name': category_name_move, 'link_position': link_position, 'method': 'move' , 'submethod': submethod}
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Edit Category':
			if (new_category_name.length === 0) {
				$('#Modal_Bookmark_b .Modal_Bookmark_content').prepend($('<div>', {class: 'Modal_Bookmark_validation_red', text: 'All fields have to be filled!'}));
				return;
			}
			modal_hide();
			var data = {'old_category_name': old_category_name, 'new_category_name': new_category_name, 'method': 'category_edit' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Delete Category':
			modal_hide();
			var data = {'delete_category': delete_category, 'method': 'category_delete' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Move Category':
			modal_hide();
			var data = {'category_name_position': category_name_position, 'category_position': category_position, 'method': 'category_move' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Add Bookmark':
			if (create_bookmark_name.length === 0 || create_bookmark_position.length === 0 || new_bookmark_link.length === 0 ) {
				$('#Modal_Bookmark_b .Modal_Bookmark_content').prepend($('<div>', {class: 'Modal_Bookmark_validation_red', text: 'All fields have to be filled!'}));
				return;
			}
			modal_hide();
			var data = {'category_name_bookmark': category_name_bookmark, 'create_bookmark_name': create_bookmark_name, 'create_bookmark_link': new_bookmark_link, 'create_bookmark_position': create_bookmark_position, 'method': 'create_bookmark' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Add Category':
			if (create_category_name.length === 0 || create_category_position.length === 0) {
				$('#Modal_Bookmark_b .Modal_Bookmark_content').prepend($('<div>', {class: 'Modal_Bookmark_validation_red', text: 'All fields have to be filled!'}));
				return;
			}
			modal_hide();
			var data = {'create_category_name': create_category_name, 'create_category_position': create_category_position, 'method': 'create_category' };
			var ajax_response = await ajax_request(data);
			console.log(JSON.stringify(ajax_response));
			break;
		case 'Upload Bookmark':
			if (document.getElementById("Modal_Bookmark_filename").files) uploadfile = document.getElementById("Modal_Bookmark_filename").files.length;
			if (uploadfile === 0) {
				$('#Modal_Bookmark_b .Modal_Bookmark_content').prepend($('<div>', {class: 'Modal_Bookmark_validation_red', text: 'File has to be selected for upload!'}));
				return;
			}
			var formData = new FormData($('#Modal_Bookmark_b #fileupload')[0]);
			modal_hide();
			$.ajax({
				url: 'https://dabos.se/extension/api/extension_db_manage.php',
				type: 'POST',
				data:formData,
				contentType: false,
				processData: false,
				success: function(data) {
					window.location.reload();
					console.log('success');
				},
				error: function(e) {
					alert('Only work on not ssl sites');
				}
			});
			break;
		default:
			console.log("No option");
			break;
	}
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "bookmark_add" ) {
			$('#Modal_Bookmark_b form').empty();
		  	category_name_bookmark = request.category_name;
			modal_view('Save', 'Add Bookmark');
			var $bookmark_name_label = $("<label>", {text: 'Name of New Bookmark:'});
		    var $bookmark_name = $("<input>", {id: "bookmark_name", name: "bookmark_name",placeholder: 'Please input new bookmark name' });
		    $("#Modal_Bookmark_b form").append($bookmark_name_label);
		    $("#Modal_Bookmark_b form").append($bookmark_name);
			var $bookmark_link_label = $("<label>", {text: 'Link of New Bookmark:'});
		    var $bookmark_link = $("<input>", {id: "bookmark_link", name: "bookmark_link", placeholder: 'Please input new bookmark link' });
		    $("#Modal_Bookmark_b form").append($bookmark_link_label);
		    $("#Modal_Bookmark_b form").append($bookmark_link);
			var $bookmark_position_label = $("<label>", {text: 'Position of New Bookmark:'});
		    var $bookmark_position = $("<select>", {id: "bookmark_position", name: "bookmark_position", placeholder:'Please input a number for position' });
		    $.ajax({
				url: 'https://dabos.se/extension/api/extension_db_manage.php',
				method: 'post',
				data: {method: 'get_bookmarks', category_name: category_name_bookmark},
				success: function(data) {
					length_linkposition = JSON.parse(data).length;
					$('#Modal_Bookmark_b #bookmark_position').empty();
					if (length_linkposition === 0) {
						$option = $('<option>', {value: '1', text: '1', selected:'selected'});
						$('#Modal_Bookmark_b #bookmark_position').append($option);
					} else {
						for (let i=1; i<length_linkposition+2; i++) {
							var $option = $('<option>', {value:i, text:i});
		        			$('#Modal_Bookmark_b #bookmark_position').append($option);
				        }
					}
					create_bookmark_position = '1';
				},
				error: function(e) {
					console.log(e);
				}
			});
		    $("#Modal_Bookmark_b form").append($bookmark_position_label);
		    $("#Modal_Bookmark_b form").append($bookmark_position);
			create_bookmark_position = $('select[name=bookmark_position]').val();
			$('#Modal_Bookmark_b input[name=bookmark_name]').on("change paste keyup" ,function(e){
				e.preventDefault();
				create_bookmark_name = $(this).val();
			});

			$('#Modal_Bookmark_b input[name=bookmark_link]').on("change paste keyup" ,function(e){
				e.preventDefault();
				new_bookmark_link = $(this).val();
			});

			$('#Modal_Bookmark_b select[name=bookmark_position]').on("change" ,function(e){
				e.preventDefault();
				create_bookmark_position = $(this).val();

			});
		} else if (request.message === 'bookmark_edit') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Save', 'Edit Bookmark')
			var json = JSON.parse(request.json_data);
			bookmark_name = json['LinkName'];
	    	bookmark_link = json['adress'];
	    	id = json['id'];
			var $bookmark_name_label = $("<label>", {"text": 'LinkName:'});
	        var $bookmark_name = $("<input>", {id: "bookmark_name", name: "bookmark_name", "value": json['LinkName'], placeholder:'Can not be empty!'});
	        $("#Modal_Bookmark_b form").append($bookmark_name_label);
	        $("#Modal_Bookmark_b form").append($bookmark_name);

	        var $bookmark_link_label = $("<label>", {"text": 'Bookmark Link:'});
	        var $bookmark_link = $("<input>", {name: "bookmark_link", "value": json['adress'], placeholder:'Can not be empty!'});

	        $("#Modal_Bookmark_b form").append($bookmark_link_label);
	        $("#Modal_Bookmark_b form").append($bookmark_link);

			$('#Modal_Bookmark_b input[name=bookmark_name]').on("change paste keyup" ,function(e){
				e.preventDefault();
				bookmark_name = $(this).val();
			});

			$('#Modal_Bookmark_b input[name=bookmark_link]').on("change paste keyup", function(e){
				e.preventDefault();
				bookmark_link = $(this).val();
			});
		} else if (request.message === 'bookmark_delete') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Delete', 'Delete Bookmark');
			var json = request.json_data;
			var $delete_message = $('<div>', {class: "Modal_Bookmark_Delete_Confirm", text: 'Do you want to remove ' + json['LinkName'] + '?'});
			$("#Modal_Bookmark_b form").append($delete_message);
			id = json['id'];
		} else if (request.message === 'bookmark_move') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Move', 'Move Bookmark');
			var json = request.json_data;
			var $category_select_label = $("<label>", {text: 'Category for ' + json['LinkName'] + ':'});
	        var $category_select = $("<select>", {id: "category_name", name: "category_select"});
	        var $category_header = $('<option>', {value: 'Please select a category option', text: 'Please select a category option', selected:true, disabled: true});
	        $category_select.append($category_header);
			var categories = request.categories;
			$.each(categories, function(val) {
				if (json['category'] === val) $category = $('<option>', {value: val, text: val});
				else $category = $('<option>', {value: val, text: val});
				$category_select.append($category);
			});
			$("#Modal_Bookmark_b form").append($category_select_label);
			$("#Modal_Bookmark_b form").append($category_select);
			var $link_position_label = $("<label>", {text: 'Position of ' + json['LinkName'] + ':'});
			var $link_position = $('<select>', {id: "linkPosition", name:'linkPosition'});
			var $link_header = $('<option>', {text: 'Please select a position', selected: true, disabled:true});
			$link_position.append($link_header);
			$("#Modal_Bookmark_b form").append($link_position_label);
			$("#Modal_Bookmark_b form").append($link_position);
			$('#Modal_Bookmark_b select[name=category_select]').on('change', function(){
				category_name_move = $('#Modal_Bookmark_b select[name=category_select]').val();
				$.ajax({
					url: 'https://dabos.se/extension/api/extension_db_manage.php',
					method: 'post',
					data: {method: 'get_bookmarks', category_name: category_name_move},
					success: function(data) {
						link_position = '1';
						length_linkposition = JSON.parse(data).length;
						$('#Modal_Bookmark_b #linkPosition').empty();
						if (length_linkposition === 0) {
							$option = $('<option>', {value: '1', text: '1', selected:'selected'});
							$('#Modal_Bookmark_b #linkPosition').append($option);
						} else {
							if (json['category'] === category_name_move) {
								length_linkposition -= 1;
								submethod = 'self';
							}
							for (let i=1; i<length_linkposition+2; i++) {
								var $option = $('<option>', {value:i, text:i});
			        			$('#Modal_Bookmark_b #linkPosition').append($option);
					        }
						}
					},
					error: function(e) {
						console.log(e);
					}
				});
			});
			$('#Modal_Bookmark_b select[name=linkPosition]').on('change', function(){
				link_position = $(this).val();
			});
			id = json['id'];
		} else if (request.message === 'category_edit') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Save', 'Edit Category');
	        old_category_name = request.old_category_name;
			var $category_name_label = $("<label>", {text: 'Category Name:'});
	        var $category_name = $("<input>", {id: "category_name", name: "category_name", value: old_category_name, placeholder:'Can not be empty!' });
	        $("#Modal_Bookmark_b form").append($category_name_label);
	        $("#Modal_Bookmark_b form").append($category_name);
			$('#Modal_Bookmark_b input[name=category_name]').on('change', function(){
				new_category_name = $('#Modal_Bookmark_b input[name=category_name]').val();
			});
		} else if (request.message === 'category_delete') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Delete', 'Delete Category');
	        var category_name = request.category_name;
			var $delete_message = $('<div>', {class: "Modal_Bookmark_Delete_Confirm", text: 'Do you want to remove ' + category_name + '?'});
			$("#Modal_Bookmark_b form").append($delete_message);
			delete_category = category_name;
		} else if (request.message === 'category_move') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Move', 'Move Category');
	        var position;
	        var category = request.category;
			var $category_select_label = $("<label>", {text: 'Position of ' + category + ':'});
	        var $category_select = $("<select>", {id: "category_name", name: "category_name"});
	        var $category_header = $('<option>', {text: 'Please select position of this category', selected:true, disabled: true});
	        $category_select.append($category_header);
			var category_positions = request.category_positions;
			var all_info = request.all_info;
			$.each(all_info, function(key, value) {
				if (value['category'] ===category){
					position = value['CategoryPosition'];
					return;
				}
			});
			for (let i=1; i<Object.keys(category_positions).length+1;i++){
				$category = $('<option>', {value: i, text: i});
				$category_select.append($category);
			}
	        $("#Modal_Bookmark_b form").append($category_select_label);
	        $("#Modal_Bookmark_b form").append($category_select);
			$('#Modal_Bookmark_b select[name=category_name]').on('change', function(){
				category_position = $('#Modal_Bookmark_b select[name=category_name]').val();
				category_name_position = category;
			});
		} else if (request.message === 'category_add') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Save', 'Add Category');
			var $category_name_label = $("<label>", {text: 'Name of New Category:'});
	        var $category_name = $("<input>", {id: "category_name", name: "category_name", placeholder: 'Please input new category name' });
	        $("#Modal_Bookmark_b form").append($category_name_label);
	        $("#Modal_Bookmark_b form").append($category_name);
			var $category_position_label = $("<label>", {text: 'Position of New Category:'});
	        var $category_position = $("<select>", {id: "category_position", name: "category_position", placeholder:'Please input a number for position' });
	        var categories = request.categories; 
	        for (let i=1; i<Object.keys(categories).length + 2; i++){
	        	var $option = $('<option>', {value:i, text:i});
	        	$category_position.append($option);
	        }
	        $("#Modal_Bookmark_b form").append($category_position_label);
	        $("#Modal_Bookmark_b form").append($category_position);
			create_category_position = $('select[name=category_position]').val();
			$('#Modal_Bookmark_b input[name=category_name]').on("change paste keyup" ,function(e){
				e.preventDefault();
				create_category_name = $(this).val();
			});

			$('#Modal_Bookmark_b select[name=category_position]').on("change" ,function(e){
				e.preventDefault();
				create_category_position = $(this).val();
			});
		} else if (request.message === 'bookmark_upload') {
			$('#Modal_Bookmark_b form').empty();
			modal_view('Upload', 'Upload Bookmark');
			$('#Modal_Bookmark_b form').attr({
				'id': 'fileupload',
				'action': 'https://dabos.se/extension/api/extension_db_manage.php',
				'method': 'post',
				'enctype': 'multipart/form-data'
			})
			var $file_label = $("<label>", {text: 'Input File:'});
	        var $filename = $("<input>", {id: "Modal_Bookmark_filename", name: "Modal_Bookmark_filename", type: "file", placeholder: 'Please select file'});
	        $("#Modal_Bookmark_b form").append($file_label);
	        $("#Modal_Bookmark_b form").append($filename);
	        var $submit_button = $('<input>', {id: 'method', name: 'method', value:'bookmark_upload', hidden:true});
	        $("#Modal_Bookmark_b form").append($submit_button);

			$('#Modal_Bookmark_b input[name=linkname]').on("change paste keyup" ,function(e){
				e.preventDefault();
				upload_linkname = $(this).val();
			});

			$('#Modal_Bookmark_b input[name=linkposition]').on("change paste keyup" ,function(e){
				e.preventDefault();
				upload_linkposition = $(this).val();
			});
		}
	}
);