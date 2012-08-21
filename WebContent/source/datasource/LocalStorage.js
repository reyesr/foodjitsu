enyo.kind({
	name: "datasource.LocalStorage",
	kind: "Component",
	
	published: {
		prefix: "",
		type_suffix: "___type"
	},

	remove: function(key) {
		localStorage.removeItem(this.prefix + key); 
		localStorage.removeItem(this.prefix + key + this.type_suffix); 
	},
	
	set: function(key, value) {
		switch (typeof value) {
		case "string":
			localStorage.setItem(this.prefix + key, value); 
			localStorage.setItem(this.prefix + key + this.type_suffix, "string"); 
			break;
		case "number":
			localStorage.setItem(this.prefix + key, value); 
			localStorage.setItem(this.prefix + key + this.type_suffix, "number"); 
			break;
		case "boolean":
			localStorage.setItem(this.prefix + key, value?"true":"false"); 
			localStorage.setItem(this.prefix + key + this.type_suffix, "boolean"); 
			break;
		default:
			localStorage.setItem(this.prefix + key, enyo.json.stringify(value)); 
			localStorage.setItem(this.prefix + key + this.type_suffix, "object"); 
			break;
		}
	},
	
	get: function(key, defaultValue) {
		if (localStorage[this.prefix + key + this.type_suffix] == undefined) {
			return defaultValue;
		}
		
		var type = localStorage.getItem(this.prefix + key + this.type_suffix);
		
		switch(type) {

		case "string":
			return localStorage.getItem(this.prefix + key);

		case "number":
			return parseFloat(localStorage.getItem(this.prefix + key));
			
		case "boolean":
			return localStorage.getItem(this.prefix + key)=="true"?true:false;
			
		case "object":
			return enyo.json.parse(localStorage.getItem(this.prefix + key));
		}
		
		return undefined;
	}
	
});