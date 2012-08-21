enyo.kind({
	name: "l10n",
	kind: "Component",

	translationFiles: {},	
	translationQueue: [],
	translationMemory: [],
	processing: false,
	timeId: new Date().getTime(),
	
	published: {
		browserLanguage: window.navigator.userLanguage || window.navigator.language,
		defaultLanguage: "en-US",
		acceptedLanguages: ["en"],
		language: window.navigator.userLanguage || window.navigator.language,
		rootFiles: "assets/locales",
		useRegion: true,
		prefix: ""
	},
	
	constructor: function() {
		this.inherited(arguments);
		this.setLanguage(this.browserLanguage);
	},

	init: function() {
		this.setLanguage(window.navigator.userLanguage || window.navigator.language);		
	},
	
	setLanguage: function(lang) {
		// with region
		var lpart = lang.split("-");
		lang = lpart[0];
		var region = lpart.length>1?lpart[1]:false;
		
		for (var i=0; i<this.acceptedLanguages.length; ++i) {
			var accpart = this.acceptedLanguages[i].split("-");
//			console.log(accpart);
			if (accpart[0] == lang) {
				if (!region || !accpart[1] || accpart[1]==region) {
					this.language = lang;
					return;
				}
			}
		}
		this.language = this.defaultLanguage;
	},
	
	getIso: function(val) {
		var v = val || this.language;
		if (v) {
			return v.split("-")[0];
		} else if (v != this.defaultLanguage) {
			return this.getIso(this.defaultLanguage);
		}
		return undefined;
	},
	
	getRegion: function(val) {
		var v = val || this.language;
		if (v) {
			return v.split("-")[1];
		} else if (v != this.defaultLanguage) {
			return this.getRegion(this.defaultLanguage);
		}
		return undefined;
	},
	
	t: function(msg, obj, callback) {
		var target = obj.owner||this.owner;
		this.translationQueue.push({msg: msg, name: target.name, target: obj, callback: callback});
		this.translationMemory.push({msg: msg, name: target.name, target: obj, callback: callback});
//		console.log("TRANSLATION for " + target.name + " (" + msg + ")");
		this.process();
		return msg;
	},

	process: function() {
		if (this.translationQueue.length > 0) {
			var obj = this.translationQueue.shift();
			console.log("processing translation for " + obj.msg + " / " + obj.name);
			
//			if (this.prefix && this.prefix.length > 0) {
//				if (obj.substring(0, this.prefix.length) != this.prefix) {
//					return;
//				}
//			}
			
			this.getTranslationFile(obj.name, function(data) {
//				console.log("GOT TRANSLATION FILE !!!" + data);
//				console.log(data);
//				console.log(obj);
				var result = data[obj.msg] || data[this.prefix + obj.msg];
				if (result) {
					if (obj.callback) {
						obj.callback(result);
					} else if (typeof obj == "object" && obj.target["setContent"]) {
						obj.target.setContent(result);
					}
				}
			}, this.useRegion);
		}
			
	},

	retranslateAll: function() {
		this.translationFiles = {};
		for (var i=this.translationMemory.length-1; i>=0; --i) {
			this.translationQueue.push(this.translationMemory[i]);
		}
		this.process();
	},
	
	getTranslationFile: function(name, callback, useRegion) {
		
		if (!this.translationFiles[name]) {
			this.translationFiles[name] = new l10najaxproxy();
			
			var urlBase = this.rootFiles + ((this.rootFiles[this.rootFiles.length-1] == '/')?"":"/") + name;
			var self = this;
//			console.log("URLBASE : " + urlBase);
			var urls = [];
			if (useRegion && this.getRegion()) {
				urls.push(urlBase + "." + this.getIso() + "-" +this.getRegion() + ".json?time="+this.timeId);
			}
			urls.push(urlBase + "." + this.getIso() + ".json?time="+this.timeId);

			this.translationFiles[name].start(urls);
		}
		
		this.translationFiles[name].getResult(callback);
	},
	
	getTemplate: function() {
		var result = "{\n";
		for (var i=this.translationMemory.length-1; i>=0; --i) {
			var obj = this.translationMemory[i];
			result += "\t\"" + obj.msg + "\": \"" + obj.msg + "\"";
			result += (i>0)?",\n":"\n";
		}
		result += "\n}\n";
		return result;
	},
	
	translateControl: function(control, name) {
//		console.log("TRANSLATING: " + control.name + " : " + control.getContent() + " : " + typeof control.getContent() + " :: " + control.name + " :: " + control.owner.name);
		var content = control.getContent();
		if (content && typeof content == "string") { // && content.substring(0,2) == "$$") {
			//control.setContent(this.t(content, control));
			this.t(content, control);
		}
		for (var i=0, max=control.children.length; i<max; ++i) {
			this.translateControl(control.children[i]);
		}
//		console.log(control);
	}
});

enyo.kind({
	kind: enyo.Object,
	name: "l10najaxproxy",
	
	finished: false,
	result: undefined,
	callbacks: [],
	urls: null,
	
	getResult: function(callback) {
		if (this.finished) {
			callback(this.result);
		}
//		console.log("Adding callback " + callback);
		this.callbacks.push(callback);
	},
	
	start: function(urls) {
		this.urls = urls;
		this.process();
	},
	
	process: function() {
		if (this.urls.length != 0) {
			
			var url = this.urls.shift();
//			console.log("URL!!");
//			console.log(url);
			var self = this;
		    var aj = new enyo.Ajax({
		        handleAs : "json",
		        cacheBust: false,
		        url : url});
//		    console.log(aj);
		    aj.response(function(inSender, inResponse) {
		    	console.log(inResponse);
		    	self.result = inResponse;
		    	self.finished = true;
			    self.trigger();
		    });
		    
		    aj.error(function(inSender, inResponse) {
		    	self.process();
		    });
		    aj.go();
			
		} else {
			this.result = undefined;
			this.finished = true;
			this.trigger();
		}
	},
	
	trigger: function() {
//		console.log("TRIGGER !");
//		console.log(this.callbacks);
		for (var i=0; i<this.callbacks.length; ++i) {
//			console.log("TRIGGER FILE " + this.result);
			this.callbacks[i](this.result);
		}
	}
});


