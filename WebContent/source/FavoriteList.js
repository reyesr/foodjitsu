enyo.kind({
	name: "FavoriteList",
	kind: enyo.Control,
	data: [],
	storage: new datasource.LocalStorage({prefix: "favs_"}),
	selIndex: undefined,
	firstLoad: false,
	
	events: {
		onSelected: ""
	},
	
	components: [
	     	    {name: "hasFav", content: "Your favorite nutritional data charts.", classes: "fav-header"},
	    	    {name: "hasNoFav", content: "To add a nutritional data chart here, create a chart, then click on the favorite icon.", classes: "fav-header"},
	    	    {name: "container", components: [], 
	    	    	selected: function(inSender, inEvent) {this.parent.selected(inSender, inEvent);},
	    	    	deleteFav: function(inSender, inEvent) {this.parent.deleteFav(inSender, inEvent);},
	    	    }
	],
	
	rendered: function() {
		this.inherited(arguments);
		if (!this.firstLoad) {
			this.firstLoad = true;
			this.load();
			this.update();
		}
	},
	
	constructor: function() {
		this.inherited(arguments);
		this.load();
	},

	update: function() {
		this.$.container.destroyClientControls();
		var comps = [];
		var self = this;
		for (var i=0; i<this.data.length; ++i) {
			if (this.data[i] && this.data[i].name) {
				comps.push({tag: "div", ontap: "selected", favindex:i, classes: (i%2)?"fav-even":"fav-odd", 
						components: [
					    {kind: "onyx.Icon", src: "assets/icons/32x32/favorite.png"},
					    {tag: "a", content: this.data[i].name},
					    {kind: "onyx.IconButton", src: "assets/icons/32x32/delete.png", ontap: "deleteFav", style: "float:right;"}
					 ]});
			}
		}
		this.$.container.createComponents(comps);
		if (this.data.length > 0) {
			this.$.hasNoFav.hide();
			this.$.hasFav.show();
		} else {
			this.$.hasFav.hide();
			this.$.hasNoFav.show();
		}
		this.render();
	},
	
	add: function(name, data) {
		if (name && data) {
			this.data.push({name: name, data: data, time: new Date().getTime()});
			this.update();
			this.save();
		}
	},
	
	load: function() {
		var count = this.storage.get("count", 0);
		this.data = [];
		for (var i=0; i<count; ++i) {
			var d = this.storage.get("el_"+i);
			if (d) {
				this.data.push(d);
			}
		}
	},
	
	save: function() {
		this.storage.set("count", this.data.length);
		for (var i=0; i<this.data.length; ++i) {
			this.storage.set("el_" + i, this.data[i]);
		}
	},
	
	selected: function(inSender, inEvent) {
		var index = inEvent.originator.favindex?inEvent.originator.favindex:inEvent.originator.parent.favindex;
		if (typeof index == "number") {
			var data = this.data[index].data;
			this.selIndex = index;
			this.doSelected(enyo.clone(this.data[index]));
		}
		
	},
	
	deleteFav: function(inSender, inEvent) {
		var index = (inEvent.originator.favindex?inEvent.originator.favindex:inEvent.originator.parent.favindex);
		this.data.splice(index, 1);
		this.save();
		this.update();
		return true;	
	}
	
});