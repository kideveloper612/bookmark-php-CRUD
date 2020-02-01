
$(function(){
	$('#modal_button').hide();
	var bookmark_name = '';
	var bookmark_link = '';
	var id = '';
	var category_name = '';
	var old_category_name = '';
	var new_category_name = '';
	var delete_category = '';
	var category_position = '';
	var category_name_position = '';
	var create_category_name = '';
	var create_category_position = '';
	var upload_category = '';
	var upload_linkname = '';
	var upload_linkposition = '';
	var uploadfile = '';
	var uploadcategory = '';
	var uploadlinkname = '';
	var uploadlinkposition = '';

	function ajax_request(payload) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: 'db_manage.php',
				type: 'POST',
				data:payload,
				success: function(data) {
					console.log(data);
					window.location.reload();
				},
				error: function(e) {
					console.log(e);
					alert(e);
				}
			});
		});
	}
	
	function modal_view(button_name, header) {
		$('#Modal').modal('show');
		$('#modal_button').html(button_name);
		$('#modal_button').show();
		$('h4.modal-title').html(header);
	}

	$('#Modal').on('hidden.bs.modal', function () {
		if ($('.modal-title').html() !== 'Upload Bookmark')
		$(".modal-body").empty();
	});

	$('#fileupload').ajaxForm(function(data) {
        console.log('data');
    });

	$('#modal_button').click(async function(eve){
		eve.preventDefault();
		var button_name = $('.modal-title').html();
		$('.modal-body .validation_red').remove();
		switch (button_name) {
			case 'Edit Bookmark':
				if (bookmark_name.length === 0 || bookmark_link.length === 0) {
					$('.modal-body').prepend($('<div>', {class: 'validation_red', text: 'All fields have to be filled!'}));
					return;
				}
				$("#Modal").modal('hide');
				var data = {'id': id,'bookmark_name': bookmark_name, 'bookmark_link': bookmark_link, 'method': 'edit' };
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Delete Bookmark':
				$("#Modal").modal('hide');
				var data = {'id': id, 'method': 'delete' };
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Move Bookmark':
				$("#Modal").modal('hide');
				var data = {'id': id, 'category_name': category_name, 'method': 'move' }
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Edit Category':
				if (new_category_name.length === 0) {
					$('.modal-body').prepend($('<div>', {class: 'validation_red', text: 'All fields have to be filled!'}));
					return;
				}
				$("#Modal").modal('hide');
				var data = {'old_category_name': old_category_name, 'new_category_name': new_category_name, 'method': 'category_edit' };
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Delete Category':
				$("#Modal").modal('hide');
				var data = {'delete_category': delete_category, 'method': 'category_delete' };
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Move Category':
				$("#Modal").modal('hide');
				var data = {'category_name_position': category_name_position, 'category_position': category_position, 'method': 'category_move' };
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Add Category':
				if (create_category_name.length === 0 || create_category_position.length === 0) {
					$('.modal-body').prepend($('<div>', {class: 'validation_red', text: 'All fields have to be filled!'}));
					return;
				}
				$("#Modal").modal('hide');
				var data = {'create_category_name': create_category_name, 'create_category_position': create_category_position, 'method': 'create_category' };
				var ajax_response = await ajax_request(data);
				console.log(JSON.stringify(ajax_response));
				break;
			case 'Upload Bookmark':
				if (document.getElementById("filename").files) uploadfile = document.getElementById("filename").files.length;
				if ($('#category_name').val()) uploadcategory = $('#category_name').val();
				if ($('#linkname').val()) uploadlinkname = $('#linkname').val();
				if ($('#linkposition').val()) uploadlinkposition = $('#linkposition').val();
				if (uploadfile === 0 || uploadcategory.length === 0 || uploadlinkname.length === 0 || uploadlinkposition.length === 0 ) {
					$('.modal-body').prepend($('<div>', {class: 'validation_red', text: 'All fields have to be filled!'}));
					return;
				}
				$("#Modal").modal('hide');
				var formData = new FormData($('#fileupload')[0]);
				$(".modal-body").empty();
				$.ajax({
					url: 'db_manage.php',
					type: 'POST',
					data:formData,
					contentType: false,
					processData: false,
					success: function(data) {
						console.log('success');
					},
					error: function(e) {
						console.log('failed');
					}
				});
				break;
			default:
				console.log("No option");
				break;
		}
	});

    $('.bookmark_edit').click(function(e){
    	e.preventDefault();
		modal_view('Save', 'Edit Bookmark')
		var json = JSON.parse($(this).attr('value'));
		bookmark_name = json['LinkName'];
    	bookmark_link = json['adress'];
    	id = json['id'];
		var $form_group_name = $("<div>", {class: "form-group"});
		var $bookmark_name_label = $("<label>", {for: "bookmark_name", "text": 'LinkName:'});
        var $bookmark_name = $("<input>", {id: "bookmark_name", name: "bookmark_name", class:"form-control", "value": json['LinkName'], placeholder:'Can not be empty!'});
        $form_group_name.append($bookmark_name_label);
        $form_group_name.append($bookmark_name);

        var $form_group_link = $("<div>", {class: "form-group"});

        var $bookmark_link_label = $("<label>", {for: "bookmark_link", "text": 'Bookmark Link:'});
        var $bookmark_link = $("<input>", {name: "bookmark_link", class:"form-control", "value": json['adress'], placeholder:'Can not be empty!'});

        $form_group_link.append($bookmark_link_label);
        $form_group_link.append($bookmark_link);
		$(".modal-body").append($form_group_name);
        $(".modal-body").append($form_group_link);

		$('input[name=bookmark_name]').on("change paste keyup" ,function(e){
			e.preventDefault();
			bookmark_name = $(this).val();
		});

		$('input[name=bookmark_link]').on("change paste keyup", function(e){
			e.preventDefault();
			bookmark_link = $(this).val();
		});
    });

    $('.bookmark_delete').click(function(e){
        e.preventDefault();
		modal_view('Delete', 'Delete Bookmark');
		var json = JSON.parse($(this).attr('value'));
		var $delete_message = $('<h5>', {text: 'Do you want to remove ' + json['LinkName'] + '?'});
		$(".modal-body").append($delete_message);
		id = json['id'];
    });

    $('.bookmark_move').click(function(e){
        e.preventDefault();
		modal_view('Move', 'Move Bookmark');
		var json = JSON.parse($(this).attr('value'));
		var $form_group_name = $("<div>", {class: "form-group"});
		var $category_select_label = $("<label>", {for: "category_name", text: 'Please select category for ' + json['LinkName'] + ':'});
        var $category_select = $("<select>", {id: "category_name", name: "category_select", class:"form-control"});
        var $category_header = $('<option>', {text: 'Please select a category option', selected:true, disabled: true});
        $category_select.append($category_header);
		var categories = JSON.parse($('input[name=category_list]').val());
		$.each(categories, function(val) {
			if (json['category'] === val) $category = $('<option>', {value: val, text: val, selected:true});
			else $category = $('<option>', {value: val, text: val});
			$category_select.append($category);
		});
		$form_group_name.append($category_select_label);
		$form_group_name.append($category_select);
		$(".modal-body").append($form_group_name);
		$('select[name=category_select]').on('change', function(){
			category_name = $('select[name=category_select]').val();
		});
    });

    $('.category_edit').click(function(e){
        e.preventDefault();
		modal_view('Save', 'Edit Category');
        old_category_name = $(this).attr('value');
        var $form_group_name = $("<div>", {class: "form-group"});
		var $category_name_label = $("<label>", {for: "category_name", text: 'Category Name:'});
        var $category_name = $("<input>", {id: "category_name", name: "category_name", class:"form-control", value: old_category_name, placeholder:'Can not be empty!' });
        $form_group_name.append($category_name_label);
        $form_group_name.append($category_name);
		$(".modal-body").append($form_group_name);
		$('input[name=category_name]').on('change', function(){
			new_category_name = $('input[name=category_name]').val();
		});
    });

    $('.category_delete').click(function(e){
        e.preventDefault();
		modal_view('Delete', 'Delete Category');
        var category_name = $(this).attr('value');
		var $delete_message = $('<h5>', {text: 'Do you want to remove ' + category_name + '?'});
		$(".modal-body").append($delete_message);
		delete_category = category_name;
    });

    $('.category_move').click(function(e){
        e.preventDefault();
        modal_view('Move', 'Move Category');
        var position;
        var category = $(this).attr('value');
        var $form_group_name = $("<div>", {class: "form-group"});
		var $category_select_label = $("<label>", {for: "category_name", text: 'Position of ' + category + ':'});
        var $category_select = $("<select>", {id: "category_name", name: "category_name", class:"form-control"});
        var $category_header = $('<option>', {text: 'Please select a category option', selected:true, disabled: true});
        $category_select.append($category_header);
		var category_positions = JSON.parse($('input[name=category_position]').val());
		var all_info = JSON.parse($('input[name=all_info]').val());
		$.each(all_info, function(key, value) {
			if (value['category'] ===category){
				position = value['CategoryPosition'];
				return;
			}
		});
		$.each(category_positions, function(key, category_position) {
			if (category_position == position) $category = $('<option>', {value: category_position, text: category_position, selected: true});
			else $category = $('<option>', {value: category_position, text: category_position});
			$category_select.append($category);
		});
        $form_group_name.append($category_select_label);
        $form_group_name.append($category_select);
		$(".modal-body").append($form_group_name);
		$('select[name=category_name]').on('change', function(){
			category_position = $('select[name=category_name]').val();
			category_name_position = category;
		});
    });

    $(".addButton").click(function (e) {
		e.preventDefault();
		modal_view('Save', 'Add Category');
        var $form_group_name = $("<div>", {class: "form-group"});
		var $category_name_label = $("<label>", {for: "category_name", text: 'Name of New Category:'});
        var $category_name = $("<input>", {id: "category_name", name: "category_name", class:"form-control", placeholder: 'Please input new category name' });
        $form_group_name.append($category_name_label);
        $form_group_name.append($category_name);
        var $category_position_group = $("<div>", {class: "form-group"});
		var $category_position_label = $("<label>", {for: "category_position", text: 'Position of New Category:'});
        var $category_position = $("<input>", {id: "category_position", name: "category_position", class:"form-control", type: "number", placeholder:'Please input a number for position' });
        $category_position_group.append($category_position_label);
        $category_position_group.append($category_position);
		$(".modal-body").append($form_group_name);
		$(".modal-body").append($category_position_group);

		$('input[name=category_name]').on("change paste keyup" ,function(e){
			e.preventDefault();
			create_category_name = $(this).val();
		});

		$('input[name=category_position]').on("change paste keyup" ,function(e){
			e.preventDefault();
			create_category_position = $(this).val();
		});
	});

	$(".uploadButton").click(function(e){
		e.preventDefault();
		modal_view('Upload', 'Upload Bookmark');
		var $form_fileupload = $('<form>', {id:'fileupload', action:'db_manage.php', method: 'post', enctype:"multipart/form-data"});
		var $form_group_file = $("<div>", {class: "form-group"});
		var $file_label = $("<label>", {for: "filename", text: 'Input File:'});
        var $filename = $("<input>", {id: "filename", name: "filename", class:"form-control", type: "file", placeholder: 'Please select file'});
        $form_group_file.append($file_label);
        $form_group_file.append($filename);
		var category_list = JSON.parse($('input[name=category_list]').val());
        var $form_group_category = $("<div>", {class: "form-group"});
		var $category_name_label = $("<label>", {for: "category_name", text: 'Name of Category:'});
        var $category_name = $("<select>", {id: "category_name", name: "category_name", class:"form-control" });
        var $option_header = $('<option>', {text: 'Please select a category option', selected:true, disabled: true});
        $category_name.append($option_header);
        $.each(category_list, function(val){
        	var $option = $('<option>', {value: val, text: val});
        	$category_name.append($option);
        })
        $form_group_category.append($category_name_label);
        $form_group_category.append($category_name);
        var $form_group_linkname = $("<div>", {class: "form-group"});
		var $linkname_label = $("<label>", {for: "linkname", text: 'LinkName:'});
        var $linkname = $("<input>", {id: "linkname", name: "linkname", class:"form-control", type: "text", placeholder: 'Please input LinkName' });
        $form_group_linkname.append($linkname_label);
        $form_group_linkname.append($linkname);
        var $form_group_linkposition = $("<div>", {class: "form-group"});
		var $linkposition_label = $("<label>", {for: "linkposition", text: 'Position of Link:'});
        var $linkposition = $("<input>", {id: "linkposition", name: "linkposition", class:"form-control", type: 'number', placeholder:'Please input a number for position' });
        $form_group_linkposition.append($linkposition_label);
        $form_group_linkposition.append($linkposition);
        var $submit_button = $('<input>', {id: 'method', name: 'method', value:'bookmark_upload', hidden:true});
        $form_fileupload.append($form_group_file);
        $form_fileupload.append($form_group_category);
        $form_fileupload.append($form_group_linkname);
        $form_fileupload.append($form_group_linkposition);
        $form_fileupload.append($submit_button);
        $('.modal-body').append($form_fileupload);

		$('select[name=category_name]').on("change" ,function(e){
			e.preventDefault();
			upload_category = $(this).val();
		});

		$('input[name=linkname]').on("change paste keyup" ,function(e){
			e.preventDefault();
			upload_linkname = $(this).val();
		});

		$('input[name=linkposition]').on("change paste keyup" ,function(e){
			e.preventDefault();
			upload_linkposition = $(this).val();
		});
	})
});