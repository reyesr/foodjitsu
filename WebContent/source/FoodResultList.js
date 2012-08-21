enyo.kind({
	name: "FoodResultList",
	
	components: [],
	fit: true, 
	
	events: {
		//* @public
		//* Fired when a food is selected
		onFoodSelected: "",
	},

	published: {
		selectedFood: undefined
	},
	
	setData: function(data) {
		var root = [];
		var remaining = [];

		this.destroyClientControls();
		var res = this.joinCommaSeparated(data);
		console.log(res);
		var comps = this.createNodes(res);
		this.createComponents(comps);
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
//				console.log(res);
				if (!result[res[1]]) {
					result[res[1]] = [];
				}
				result[res[1]].push({full: res[0], label: res[2], id: datalist[i].id });
			} else {
				console.log(datalist[i]);
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
		//this.$.selection.select(node.id, node);
		console.log("tapped: " + node.id);
		console.log(node.foodId);
		this.setSelectedFood(node.foodId);
		this.doFoodSelected();
	},
	select: function(inSender, inEvent) {
		console.log("select: " + inEvent);
//		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		console.log("deselect: " + inEvent);
//		inEvent.data.$.caption.applyStyle("background-color", null);
	}

});