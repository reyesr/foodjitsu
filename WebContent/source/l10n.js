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
		language: null,
		rootFiles: "assets/locales",
		useRegion: true,
		prefix: "",
		defaultFile: null
	},
	
	constructor: function() {
		this.inherited(arguments);
		this.setLanguage(this.browserLanguage);
	},

	init: function(lang) {
		this.setLanguage(lang||window.navigator.userLanguage || window.navigator.language);		
	},
	
	setLanguage: function(lang) {
		// with region
		var lpart = lang.split("-");
		lang = lpart[0];
		var region = lpart.length>1?lpart[1]:false;
		
		for (var i=0; i<this.acceptedLanguages.length; ++i) {
			var accpart = this.acceptedLanguages[i].split("-");
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
		this.process();
		return msg;
	},

	process: function() {
		if (this.translationQueue.length > 0) {
			var obj = this.translationQueue.shift();
			
			this.getTranslationFile(obj.name, function(data) {
				if (!data) {
					return;
				}

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
			var root = this.rootFiles + ((this.rootFiles[this.rootFiles.length-1] == '/')?"":"/");
			var urlBase = root + name;
			var self = this;

			var urls = [];
			if (useRegion && this.getRegion()) {
				urls.push(urlBase + "." + this.getIso() + "-" +this.getRegion() + ".json?time="+this.timeId);
			}
			urls.push(urlBase + "." + this.getIso() + ".json?time="+this.timeId);
			if (this.defaultFile && name != this.defaultFile) {
				if (useRegion && this.getRegion()) {
					urls.push(root + this.defaultFile + "." + this.getIso() + "-" +this.getRegion() + ".json?time="+this.timeId);
				}
				urls.push(root + this.defaultFile + "." + this.getIso() + ".json?time="+this.timeId);
			}
			
			this.translationFiles[name].start(urls);
		}
		
		this.translationFiles[name].getResult(callback);
	},
	
	getTemplate: function() {
		var data = {};
		for (var i=this.translationMemory.length-1; i>=0; --i) {
			var obj = this.translationMemory[i];
			data[obj.msg] = obj.msg;
		}
		
		var result = "{\n";
		for (var k in data) {
			result += "\t\"" + k + "\": \"" + k + "\"";
			result += (i>0)?",\n":"\n";
		}
		result += "\n}\n";
		return result;
	},
	
	translateControl: function(control, name) {
		var content = control.getContent();
		if (content && typeof content == "string") { // && content.substring(0,2) == "$$") {
			this.t(content, control);
		}
		for (var i=0, max=control.children.length; i<max; ++i) {
			this.translateControl(control.children[i]);
		}
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
		this.callbacks.push(callback);
	},
	
	start: function(urls) {
		this.urls = urls;
		this.process();
	},
	
	process: function() {
		if (this.urls.length != 0) {
			
			var url = this.urls.shift();
			var self = this;
		    var aj = new enyo.Ajax({
		        handleAs : "json",
		        cacheBust: false,
		        url : url});
		    aj.response(function(inSender, inResponse) {
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
		for (var i=0; i<this.callbacks.length; ++i) {
			this.callbacks[i](this.result);
		}
	}
});
