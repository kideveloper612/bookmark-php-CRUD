document.addEventListener('DOMContentLoaded', function() {

	function jquery_css() {
		// $('body').css('width', '300px');
	}

	function click_events() {
		$('#menu > ul > li').on('click', function(e){
			e.stopPropagation();
			$(this).find('ul').toggle();
			if (e.target['type'] !== 'button') {
				$('body').css('width', '300px');
			}
		});
		
		$('.sign_up_button').click( function(e){
			$('#login').hide();
			$('#signup').show();
			$('body').css('width', '');
		});
		$('.log_in_button').click( function(e){
			$('#login').show();
			$('#signup').hide();
			$('body').css('width', '');
		});
		$("a.bookmark_add").click( function (e) {
			e.preventDefault();
			var category_name = $(this).attr('value');
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "bookmark_add", 'category_name': category_name});
			});
		});
		$("a.bookmark_edit").click( function(e) {
			e.preventDefault();
			var json = $(this).attr('value');
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "bookmark_edit", 'json_data': json});
			});
		});
		$('a.bookmark_delete').click( function(e) {
			e.preventDefault();
			var json = JSON.parse($(this).attr('value'));
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "bookmark_delete", 'json_data': json});
			});
		});
		$('a.bookmark_move').click( function(e) {
			e.preventDefault();
			var json = JSON.parse($(this).attr('value'));
			var categories = JSON.parse($('input[name=arranged_category_list]').val());
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "bookmark_move", 'json_data': json, 'categories': categories});
			});
		});
		$('a.category_edit').click( function(e) {
			e.preventDefault();
			var old_category_name = $(this).attr('value');
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "category_edit", 'old_category_name': old_category_name});
			});
		});
		$('a.category_delete').click( function(e) {
			e.preventDefault();
			var category_name = $(this).attr('value');
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "category_delete", 'category_name': category_name});
			});
		});
		$('a.category_move').click( function(e) {
			e.preventDefault();
			var category = $(this).attr('value');
			var category_positions = JSON.parse($('input[name=arranged_category_list]').val());
			var all_info = JSON.parse($('input[name=all_info]').val());
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "category_move", 'category': category, 'category_positions': category_positions, 'all_info': all_info});
			});
		});
		$('button.addButton').click( function(e) {
			e.preventDefault();
			var categories = JSON.parse($('input[name=arranged_category_list]').val());
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "category_add", 'categories': categories});
			});
		});
		$('button.uploadButton').click( function(e) {
			e.preventDefault();
			chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];
				chrome.tabs.sendMessage(activeTab.id, {"message": "bookmark_upload"});
			});
		});
	}

	function ajax_requests(data) {
		$('#logout').on('click', function(){
			$.ajax({
				url: 'http://dabos.se/extension/api/extension_logout.php',
				type: 'get',
				success: function(data) {
					$('body > header').remove();
					$('body #menu').remove();
					$('body').prepend(data);
					$('body').css('width', '100px');
				},
				error: function(e) {
					console.log(e);
				}
			});
		});
		$("#signup").ajaxForm({
			url: 'http://dabos.se/extension/api/extension_signup.php',
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
		$('body > header').remove();
		$('body').prepend(data);
		$('#menu > ul > li > ul').toggle();
		jquery_css();
		click_events();
		ajax_requests(data);
	}
	
	$.ajax({
		url: 'http://dabos.se/extension/api/extension_index.php',
		method: 'post',
		data: {'type': 'landing'},
		success: function(data) {
			event_module(data);
			$("#login").ajaxForm({
				url: 'http://dabos.se/extension/api/extension_login.php', 
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
			console.log(error);
		}
	});
});