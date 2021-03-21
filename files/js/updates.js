function updateListener(callback) {
	xhr = new XMLHttpRequest();
	
	xhr.onload = function () {
		if (xhr.status === 200) {
			var responseObject = JSON.parse(xhr.responseText);
			callback(responseObject);
		}
	}
  
	xhr.open("GET", "liveUpdates", true);
	xhr.send(null);
}
