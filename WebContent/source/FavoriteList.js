enyo.kind({
	name: "FavoriteList",
	kind: enyo.Control,
	data: [],
	storage: new datasource.LocalStorage({prefix: "favs_"}),
	selIndex: undefined,
	
	events: {
		onSelected: ""
	},
	
	components: [
	    {content: "Favorites...."}
	],

	
	create: function() {
		this.inherited(arguments);
		this.load();
		this.update();
	},
	
	constructor: function() {
		this.inherited(arguments);
		this.load();
	},

	update: function() {
		this.destroyClientControls();
		var comps = [];
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
		this.createComponents(comps);
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
		console.log(this.data);
	},
	
	save: function() {
		this.storage.set("count", this.data.length);
		for (var i=0; i<this.data.length; ++i) {
			this.storage.set("el_" + i, this.data[i]);
		}
	},
	
	selected: function(inSender, inEvent) {
		console.log("selected ");
		console.log(inEvent);
		var index = inEvent.originator.favindex?inEvent.originator.favindex:inEvent.originator.parent.favindex;
		console.log("selected " + index);
		if (typeof index == "number") {
			var data = this.data[index].data;
			this.selIndex = index;
			this.doSelected(enyo.clone(this.data[index]));
		}
		
	},
	
	deleteFav: function(inSender, inEvent) {
		var index = (inEvent.originator.favindex?inEvent.originator.favindex:inEvent.originator.parent.favindex);
		console.log("delete: " + index);
		console.log(inEvent);
		this.data.splice(index, 1);
		this.save();
		this.update();
		return true;	
	}
	
});