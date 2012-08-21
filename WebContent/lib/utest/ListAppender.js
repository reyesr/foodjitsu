enyo.kind({
	name: "utest.ListAppender",

	enclosingTemplate: null,
	$$: {},
	template: {},

	create: function() {
		this.inherited(arguments);
		this.enclosingTemplate = new enyo.Control();
		this.enclosingTemplate.setTag(null);
		this.enclosingTemplate.setOwner(null);
		this.enclosingTemplate.createComponent(this.template);
		this.$$ = this.enclosingTemplate.$;
		
		// Remove all the ID from the template, to make sure style change events do not modify one the of generated instance
		this.removeIdFromControl(this.enclosingTemplate);
	},

	rendered: function() {
		this.inherited(arguments);
//		this.append();
	},
	
	getControl: function() {
		return this.templateComponent;
	},
	
	removeIdFromControl: function(control) {
		console.log(control);
		if (control.attributes && control.attributes.id) {
			delete control.attributes.id;
		}
		if (control.children) {
			for (var i=0; i<control.children.length; ++i) {
				this.removeIdFromControl(control.children[i]);
			}
		}
	},
	
	append: function(control) {
//		console.log(control);
//		control.show();
		var template = control || this.enclosingTemplate;
		
		var html = template.generateChildHtml();
//		console.log("html = " + html);
		this.appendHtml(html);
	},

	prepend: function(control) {
		var template = control || this.$$;
		var html = template.generateChildHtml();
//		console.log("html = " + html);
		this.prependHtml(html);
	},

	appendHtml: function(html) {
		var node = this.hasNode();
		if (node) {
			var nn = document.createElement("div");
			nn.innerHTML = html;
			node.appendChild(nn);
		}
	},

	prependHtml: function(html) {
		var node = this.hasNode();
		if (node) {
			var nn = document.createElement("div");
			nn.innerHTML = html;
			node.insertBefore(nn, node.firstChild);
		}
	},

	clear: function() {
		this.msgid = 0;
		this.templateDisplayed = false;
		
		enyo.forEach(this.getClientControls(), function(e) {
			e.hide();
		});
		this.render();
	}
	
});