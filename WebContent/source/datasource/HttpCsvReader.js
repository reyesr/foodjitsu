
enyo.kind({
	name: "datasource.HttpCsvReader",
	kind: enyo.Component,
	
	published: {
		delimitor: ";",
		url: undefined,
		rowProcessor: undefined,
		skipHeader: false
	},
	
	constructor: function(url, rowProcessor) {
		this.rowProcessor = rowProcessor;
		this.url = url;
	},
	
	rowcut: function(row) {
		
		if (!this.skipHeader) {
			var data = row.split(this.delimitor);
			this.rowProcessor(data);
		} else {
			this.skipHeader = false;
		}
	},
	
	load: function(callback) {
		var self = this;
		console.log("ajax: " + this.url);
		var ajax = new enyo.Ajax({url: this.url, method: "get", handleAs: "text"});
		ajax.response(this, function(sender, data) {
//			console.log(response);
			var len = data.length;
			for (var i=0; i<len; ) {
				var next = data.indexOf("\n", i);
				if (next == -1) {
					if (i == 0) {
						self.rowcut(data);
					}
					i = len;
				} else {
					self.rowcut(data.substring(i, next));
					i = next +1;
				}
			}
			
			callback();
		});
		ajax.go();
		return this;
	}
});
