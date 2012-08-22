enyo.kind({
	name: "FoodResultList",
	
	components: [
	    {name: "header", content: "No item found. Type a food in the search box above.", style: "padding:1em;"},
	    {name: "spinner", kind: "onyx.Spinner", style: "text-align: center; padding 2em;", isShowing: false}
	],
	fit: true, 
	
	events: {
		//* @public
		//* Fired when a food is selected
		onFoodSelected: "",
	},

	setSpinner: function(b) {
		if (b) {
			this.$.header.hide();
			this.$.spinner.show();
		} else {
			this.$.header.show();
			this.$.spinner.hide();
		}
	},
	
	published: {
		selectedFood: undefined
	},
	
	setData: function(data) {
		this.destroyClientControls();
		var res = this.joinCommaSeparated(data);
		var comps = this.createNodes(res);
		this.createComponents(comps);

		if (this.$.header && this.$.spinner) {
			this.$.header.hide();
			this.$.spinner.hide();
		}

		this.render();
	},
	
	createNodes: function(data) {
		var comps = [ {kind: "Selection", onSelect: "selectDeselect", onDeselect: "selectDeselect"}];
		for (var k in data) {
			var arr = data[k];
			var node = {components:[], kind: "Node", content: k,  expandable: true, expanded: false};
			for (var i=0; i<arr.length; ++i) {
				node.components.push({content: arr[i].label, foodId: arr[i].id, onNodeTap: "tapped", icon_: "assets/knobs_icons/Knob%20Search.png" });
			}
			comps.push(node);
		}
		return comps;
	},
	
	joinCommaSeparated: function(datalist) {
		var result = {};
		var pattern = new RegExp("^([^,]+),(.+)$");
		for (var i=0, max=datalist.length; i<max; ++i) {
			var res = datalist[i].label.match(pattern);
			if (res) {
				if (!result[res[1]]) {
					result[res[1]] = [];
				}
				result[res[1]].push({full: res[0], label: res[2], id: datalist[i].id });
			} else {
				if (!result["misc"]) {
					result["misc"] = [];
				}
				result.misc.push({full: datalist[i].label, label: datalist[i].label, id: datalist[i].id})
			}
		}
		
		return result;
	},
	
	tapped:  function(inSender, inEvent) {
		var node = inEvent.originator;
		this.setSelectedFood(node.foodId);
		this.doFoodSelected();
	},
	select: function(inSender, inEvent) {
	},
	deselect: function(inSender, inEvent) {
	}

});