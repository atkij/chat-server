var prevMsg;

var btn = document.getElementById("send-message");

btn.addEventListener("click", function () {
	var msg = prompt("Enter your message here:");
	
	var xhr = new XMLHttpRequest();
	
	xhr.onload = function () {
		if (xhr.status === 200) {} else {
			alert("Your message failed to send");
		}
	};
	
	prevMsg = msg;
	var url = "message?message=" + msg;
	xhr.open("GET", url, true);
	xhr.send();
});

updateListener(function(responseObject) {
	if (prevMsg != responseObject.message) {
		alert(responseObject.message);
		prevMsg = "";
	}
  updateListener(function(responseObject) {
    if (prevMsg != responseObject.message) {
      alert(responseObject.message);
      prevMsg = "";
    }
  });
});
