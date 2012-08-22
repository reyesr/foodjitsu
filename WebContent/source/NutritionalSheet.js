enyo.kind({
	name: "NutritionalSheet",

	published: {
		storage: undefined,
	},
	foods: [],
	internalData: undefined,
	
	components: [],
	
	clear: function() {
		this.destroyClientControls();
		this.internalData = undefined;
		this.foods = [];
		this.render();
	},
	
	addFood: function(foodId) {
		this.foods.push(foodId);
		this.update();
	},

	update: function() {
		var tab = this.createInternalData();
		this.createTable(tab);
	},
	
	// Creates an internal representation of the form:
	// { 
	//    foods: [ {name: name, data: [ number1,number2 ] } ... ],
	//    nutrients: [ {type: "group", name: name}, {id: id, type: "nutrient", name: "name", unit: unit }... ]
	// }
	createInternalData: function() {
		var result = {};

		var size = this.foods.length;
		var ngroups =  this.storage.getGroupedDisplayedNutriments();
		var header = [];
		var lines = [];
		var foods = [];
		for (var i=0,max=this.foods.length; i<max; ++i) {
			foods.push(this.storage.fetchFood(this.foods[i]));
		}

		header.push("Nutriment");
		for (var i=0; i<foods.length; ++i) {
			header.push(foods[i].label);
		}

		var nutrients = [];
		for (var grp in ngroups) {
			var grpname = this.storage.getNutrimentGroupName(grp);
			nutrients.push({name: grpname, type: "group"});
			
			for (var i=0,max=ngroups[grp].length; i<max; ++i) {
				var line = [];
				lines.push(line);
				var n = this.storage.getNutriment(ngroups[grp][i]);
				nutrients.push({name: n.label, type: "nutrient", unit: n.unit, id: n.id});
			}
		}

		var foodarray = [];
		for (var index=0; index<foods.length; ++index) {
			var obj = {name: foods[index].label, data: []};
			for (var n=0; n<nutrients.length; ++n) {
				if (nutrients[n].type == "nutrient") {
					obj.data.push(foods[index].data[nutrients[n].id]);
				}
			}
			foodarray.push(obj);
		}
		
		return {foods: foodarray, nutrients: nutrients};
	},
	
	createTable: function(obj) {
		this.internalData = obj;
		
		var headers = [{tag:"th", attributes:{colspan:2}, content: "/100g", classes: "foodsheet-col2"}];
		for (var i=0; i<obj.foods.length; ++i) {
			headers.push({tag:"th", content: obj.foods[i].name, classes: "foodsheet"});
		}
		
		var lines = [];
		var nutrindex = -1;
		for (var i=0; i<obj.nutrients.length; ++i) {
			var line = {tag:"tr", components: []};
			if (obj.nutrients[i].type == "group") {
				line.components.push({tag:"td", content: obj.nutrients[i].name, attributes: {colspan: obj.foods.length+2}, classes: "foodsheet-group"});
			} else {
				line.components.push({tag:"td", content: obj.nutrients[i].name, classes: "foodsheet-col1"});
				line.components.push({tag:"td", content: obj.nutrients[i].unit, classes: "foodsheet-col2"});
				++nutrindex;
				for (var f=0; f<obj.foods.length; ++f) {
					line.components.push({tag:"td", content: obj.foods[f].data[nutrindex],classes: "foodsheet"});
				}
			}
			lines.push(line);
		}

		var result = {tag: "table", classes: "foodsheet", components: [
		                  {tag:"thead", components: headers},
						  {tag:"tbody", components: lines}
					]};
		this.destroyClientControls();
		if (lines.length > 0) {
			this.createComponent(result);
		}
		this.render();
	},

});