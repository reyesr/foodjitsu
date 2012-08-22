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
		var comps = [];
		var index = 0;
		for (var k in data) {
			var arr = data[k];
			
			var sublist = {showing: false, components:[]};
			for (var i=0; i<arr.length; ++i) {
				sublist.components.push({ foodId: arr[i].id, ontap: "tapped", classes: "searchresult", components: [
					{ tag:"img", attributes: {src:"assets/icons/24x24/go-next.png"}, style: "float: left;", foodId: arr[i].id },
					{content: arr[i].label, foodId: arr[i].id} 
						]});
			}
			var header = {tag:"div", ontap:"toggleGroup", gindex:index, classes: "searchresult-head", components: [
			                      { tag:"img", attributes: {src:"assets/icons/24x24/sign-right.png"}, style: "float: left;", gindex:index },
			                      { tag: "span", content:k, gindex:index, classes: "searchresult-head-name" },
			                      { tag: "span", content: ("("+ sublist.components.length + ")"), classes: "searchresult-count"}
                             ]};
			var node = {components:[ header, sublist ]};
			comps.push(node);
			
			++index;
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
	},
	toggleGroup: function(inSender, inEvent) {
		this.log("toggle group");
		this.log(inEvent);
//		if (inEvent.originator && inEvent.originator.parent && inEvent.originator.parent.children[1]) {
//			inEvent.originator.parent.children[1].setShowing(!inEvent.originator.parent.children[1].getShowing());
//		}
		if (inEvent.originator.gindex >= 0) {
			this.log("INDEX: " + inEvent.originator.gindex);
			var ctrl = this.getClientControls();

			var element = ctrl[inEvent.originator.gindex].children[1];
			if (element) {
				element.setShowing(!element.showing);
			}
			
			var head = ctrl[inEvent.originator.gindex].children[0]
			this.log(head);
			if (head && head.children[0] && head.children[0].hasNode()) {
				var src = element.showing?"assets/icons/24x24/sign-down.png":"assets/icons/24x24/sign-right.png";
				head.children[0].setAttribute("src", src);
				head.children[0].render();
			}
	//		ctrl[inEvent.originator.gindex].setShowing(this.children[inEvent.originator.gindex].showing);
		}
	}

});