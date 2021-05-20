const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

var accept = true
var connections = new Array()

function escape_html(str) { 
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "\": "&#92;"
  };
  
  var regex = /[&<>"']/g;
  
  str = str.replace(regex, function (char) {return map[char]; });
  return str;
}


http.createServer(function (req, res) {
	var q = url.parse(req.url, true);
	//console.log(q.pathname);
	if (q.pathname == "/liveUpdates") {
		if (accept) {
			connections.push([res]);
			//console.log(connections);
			res.writeHead(200, {"pragma": "no-cache",
				"Content-Type": "application/json"});
		} else {
			res.writeHead(403);
			res.end();
		}
	} else if (q.pathname == "/message") {
		var len  = connections.length;
		accept = false;
		for (i=0; i<len; i++) {
			connections[0][0].write('{"message": "' + escape_html(decodeURIComponent(q.query.message)) + '","name": "' + escape_html(decodeURIComponent(q.query.name)) + '"}');
			connections[0][0].end();
			connections.shift();
			//console.log(connections);
		}
		accept = true;
		//connections = new Array();
		res.writeHead(200);
		res.end();
	} else if (q.pathname == "/") {
		var filename = path.join(__dirname, "files", "html", "index.html");
		/*fs.readFile(filename, function (err, data) { 
			if (err) {
				res.writeHead(404, {"Content-Type": "text/html"});
				return res.end("Error 404. File not found.");
			} else {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(data);
				return res.end();
			}
		});*/
    
    res.writeHeader(301, {"Location": "/v2"});
    res.end();
	} else if (q.pathname == "/v2") {
    var filename = path.join(__dirname, "files", "html", "index-v2.html");
		fs.readFile(filename, function (err, data) { 
			if (err) {
				res.writeHead(404, {"Content-Type": "text/html"});
				return res.end("Error 404. File not found.");
			} else {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(data);
				return res.end();
			}
		});
  }  else {
		var filename = path.join(__dirname, "files", q.pathname);
		fs.readFile(filename, function (err, data) { 
			if (err) {
				res.writeHead(404, {"Content-Type": "text/html"});
				return res.end("Error 404. File not found.");
			} else {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(data);
				return res.end();
			}
		});
	}
}).listen(3000);
