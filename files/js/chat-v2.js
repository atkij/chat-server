function getMessage (callback) {
  xhr = new XMLHttpRequest();
  
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        var responseObject = JSON.parse(xhr.responseText);
        if (!doReceiveFlags(responseObject.message)) {
          callback(responseObject.message, responseObject.name);
          saveMessage(responseObject.message, responseObject.name);
        }
        messageListener();
      } catch (e) {
       messageListener();
      }
    }
  }
  
  xhr.open("GET", "liveUpdates", true);
  xhr.send(null);
}

function sendMessage (message, name) {
 
	var xhr = new XMLHttpRequest();
	
	xhr.onload = function () {
		if (xhr.status === 200) {
			return true;
		} else {
      return false;
    }
	};
  
	var url = "message?message=" + encodeURIComponent(message) + "&name=" + encodeURIComponent(name);
	xhr.open("GET", url, true);
	xhr.send();
}

function showMessage(message, name) {
  let msgWrapper = document.createElement("div");
  let msgText = document.createElement("p");
  let msgName = document.createElement("p");
  let messages = document.getElementById("messages");
  
  msgWrapper.id = "msg-wrapper";
  msgText.id = "msg-text";
  msgName.id = "msg-name";
  
  msgText.innerHTML = message;
  msgName.innerHTML = name;
  
  msgWrapper.appendChild(msgName);
  msgWrapper.appendChild(msgText);
  messages.appendChild(msgWrapper);
  
  updateScroll();
}

function messageListener () {
  getMessage(showMessage);
}

function updateScroll () {
  let element = document.getElementById("messages-container");
  element.scrollTop = element.scrollHeight;
}

function getName () {
  if (localStorage.getItem("name") == null) {
    name = prompt("Please enter your name");
    if (name.search("[a-zA-Z]") || name == "null") {
      name = getName();
    }
    localStorage.setItem("name", name);
  } else {
    name = localStorage.getItem("name");
  }
  return name;
}

function saveMessage (message, name) {
  let content = [message, name]
  
  if (localStorage.getItem("messages") == null) {
    localStorage.setItem("messages", JSON.stringify([content]));
  } else {  
    let storage = JSON.parse(localStorage.getItem("messages"));
    storage.push(content);
    localStorage.setItem("messages", JSON.stringify(storage));
  }
}

function loadMessages () {
  if (localStorage.getItem("messages") != null) {
    let messages = JSON.parse(localStorage.getItem("messages"));
    for (i=0; i<messages.length; i++) {
      let msg = messages[i];
      showMessage(msg[0], msg[1]);
    }
    updateScroll();
  }
}

function doSendFlags(flag) {
  try {
    if (btoa(flag) == "Om1hc3Rlcl9yZXNldF9hbGw=") {
      localStorage.clear();
      location.reload();
      return true;
    } else if (btoa(flag) == "Om1hc3Rlcl9yZXNldF9uYW1l") {
      localStorage.removeItem("name");
      location.reload();
      return true;
    } else if (btoa(flag) == "Om1hc3Rlcl9yZXNldF9tZXNzYWdlcw==") {
      localStorage.removeItem("messages");
      location.reload();
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

function doReceiveFlags(flag) {
  try {
    if (btoa(flag) == "OnJlZnJlc2hfYWxs") {
      location.reload();
      return true;
    } else if (btoa(flag) == "OmZsYXNoeV9yYWluYm93X2Vhc3RlcmVnZw==") {
      if (document.body.id == "flashy") {
        document.body.id = "flashy2";
      } else {
        document.body.id = "flashy";
      }
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

var name = getName();


var form = document.getElementById("message-form");
var msgContainer = document.getElementById("messages-container");



form.addEventListener("submit", function (e) {
  e.preventDefault();
  let input = document.getElementById("message-text")
  let msg = input.value;
  
  if (!/\S/.test(msg) || msg == null || msg == "") {
      this.reset();
  } else {
    if (!doSendFlags(msg)) {
      sendMessage(msg, name);
    }
    this.reset();
  }
});

messageListener();
loadMessages();
