document.addEventListener('DOMContentLoaded', function() {

	function jquery_css() {
	}

	function click_events() {
		$('.extension_body #menu > ul > li >:first-child').on('click', function(e){
			e.stopPropagation();
			if (e.target.tagName.toUpperCase() !== 'BUTTON') {
				$(this).parent().find('ul').toggle();
				$('body.extension_body').css('width', '300px');
			}
		});
		
		$('.sign_up_button').click( function(e){
			$('.extension_body #login').hide();
			$('.extension_body #signup').show();
			$('body.extension_body').css('width', '');
		});
		$('.log_in_button').click( function(e){
			$('.extension_body #login').show();
			$('.extension_body #signup').hide();
			$('body.extension_body').css('width', '');
		});
		$(".extension_body a.bookmark_add").click( function (e) {
			e.preventDefault();
			var category_name = $(this).attr('value');
			browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "bookmark_add", 'category_name': category_name});
			});
		});
		$(".extension_body a.bookmark_edit").click( function(e) {
			e.preventDefault();
			var json = $(this).attr('value');
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "bookmark_edit", 'json_data': json});
			});
		});
		$('.extension_body a.bookmark_delete').click( function(e) {
			e.preventDefault();
			var json = JSON.parse($(this).attr('value'));
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "bookmark_delete", 'json_data': json});
			});
		});
		$('.extension_body a.bookmark_move').click( function(e) {
			e.preventDefault();
			var json = JSON.parse($(this).attr('value'));
			var categories = JSON.parse($('input[name=arranged_category_list]').val());
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "bookmark_move", 'json_data': json, 'categories': categories});
			});
		});
		$('.extension_body a.category_edit').click( function(e) {
			e.preventDefault();
			var old_category_name = $(this).attr('value');
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "category_edit", 'old_category_name': old_category_name});
			});
		});
		$('.extension_body a.category_delete').click( function(e) {
			e.preventDefault();
			var category_name = $(this).attr('value');
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "category_delete", 'category_name': category_name});
			});
		});
		$('.extension_body a.category_move').click( function(e) {
			e.preventDefault();
			var category = $(this).attr('value');
			var category_positions = JSON.parse($('input[name=arranged_category_list]').val());
			var all_info = JSON.parse($('input[name=all_info]').val());
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "category_move", 'category': category, 'category_positions': category_positions, 'all_info': all_info});
			});
		});
		$('.extension_body button.addButton').click( function(e) {
			e.preventDefault();
			var categories = JSON.parse($('input[name=arranged_category_list]').val());
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "category_add", 'categories': categories});
			});
		});
		$('.extension_body button.uploadButton').click( function(e) {
			e.preventDefault();
			browser.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				browser.tabs.sendMessage(activeTab.id, {"message": "bookmark_upload"});
			});
		});
	}

	function ajax_requests(data) {
		$('#logout').on('click', function(){
			$.ajax({
				url: 'https://dabos.se/extension/api/extension_logout.php',
				type: 'get',
				success: function(data) {
					$('body.extension_body > header').remove();
					$('body.extension_body #menu').remove();
					$('body.extension_body').prepend(data);
					$('body.extension_body').css('width', '');
				},
				error: function(e) {
					console.log(e);
				}
			});
		});
		$("#signup").ajaxForm({
			url: 'https://dabos.se/extension/api/extension_signup.php',
			type: 'post',
			success: function(data) {
				$('body > header').remove();
				$('body').prepend(data);
			},
			error: function(e) {
				console.log(e);
			}
		});
	}

	function event_module(data) {
		$('body.extension_body > header').remove();
		$('body.extension_body ').prepend(data);
		$('.extension_body #menu > ul > li > ul').toggle();
		jquery_css();
		click_events();
		ajax_requests(data);
	}
	
	$.ajax({
		url: 'https://dabos.se/extension/api/extension_index.php',
		method: 'post',
		data: {'type': 'landing'},
		success: function(data) {
			event_module(data);
			$("#login").ajaxForm({
				url: 'https://dabos.se/extension/api/extension_login.php', 
				type: 'post',
				success: function(data) {
					event_module(data);
				},
				error: function(e) {
					console.log(e);
				}
			});
		},
		error: function(error) {
			alert(error);
		}
	});
});