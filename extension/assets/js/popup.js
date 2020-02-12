
$(document).ready(function(){
	$.ajax({
		url: 'http://localhost/website1/extension/api/extension_index.php',
		method: 'post',
		data: {'type': 'landing'},
		success: function(data) {
			$('body').prepend(data);
			$("#login").ajaxForm({
				url: 'http://localhost/website1/extension/api/extension_login.php', 
				type: 'post',
				success: function(data) {
					console.log(data); 
				},
				error: function(e) {
					console.log('failed');
				}
			});
		},
		error: function(error) {
			alert(error);
		}
	})
});

