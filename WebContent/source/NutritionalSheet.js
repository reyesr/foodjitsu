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

		console.log("header:");
		console.log(header);

		console.log("NUTRIMENTS:");
		console.log(ngroups);

		console.log("FOODS:");
		console.log(foods);

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
		console.log("NUTRIENTS:");
		console.log(nutrients);

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
		console.log("FOODARR:");
		console.log(foodarray);
		
		return {foods: foodarray, nutrients: nutrients};
	},
	
	createTable: function(obj) {
		this.internalData = obj;
		
		var headers = [{tag:"th", content: ""}];
		for (var i=0; i<obj.foods.length; ++i) {
			headers.push({tag:"th", content: obj.foods[i].name});
		}
		
		var lines = [];
		var nutrindex = -1;
		for (var i=0; i<obj.nutrients.length; ++i) {
			var line = {tag:"tr", components: []};
			if (obj.nutrients[i].type == "group") {
				line.components.push({tag:"td", content: obj.nutrients[i].name, attributes: {colspan: obj.foods.length+1}, classes: "foodsheet-group"});
			} else {
				line.components.push({tag:"td", content: obj.nutrients[i].name, classes: "foodsheet-col1"});
				++nutrindex;
				for (var f=0; f<obj.foods.length; ++f) {
					line.components.push({tag:"td", content: obj.foods[f].data[nutrindex]});
				}
			}
			lines.push(line);
		}

		var result = {tag: "table", classes: "foodsheet", components: [
		                  {tag:"thead", components: headers},
						  {tag:"tbody", components: lines}
					]};
		console.log(result);
		this.destroyClientControls();
		if (lines.length > 0) {
			this.createComponent(result);
		}
		
//		console.log(this);
		this.render();
		
	},
	
	createTable_old: function() {
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

		console.log("header:");
		console.log(header);

		console.log("NUTRIMENTS:");
		console.log(ngroups);

		console.log("FOODS:");
		console.log(foods);
		
		for (var grp in ngroups) {
			var grpname = this.storage.getNutrimentGroupName(grp);
			lines.push(grpname);
			
			for (var i=0,max=ngroups[grp].length; i<max; ++i) {
				var line = [];
				lines.push(line);

				var nutriment = this.storage.getNutriment(ngroups[grp][i]);
				console.log("Nutriment " + enyo.json.stringify(nutriment));
				line.push(nutriment.label);
				
				for (var j=0; j<foods.length; ++j) {
					if (nutriment.id < foods[j].data.length) {
						line.push(foods[j].data[nutriment.id]);
					}
				}
			}
		}
		
		console.log("SHEET RESULT");
		console.log(lines);

		var comps = [];
		var tline = [];
		for (var i=0; i<header.length; ++i) {
			tline.push({tag: "th", content: header[i]})
		}
		comps.push({ tag:"thead", components: [{ components: tline, tag: "tr"}]});

		for (var i=0; i<lines.length; ++i) {
			var line = lines[i];
			if (typeof line == "string") {
				comps.push({tag: "tr", components: [{tag:"td", attributes: {colspan: foods.length+1}, classes: "foodsheet-group", content: line}]});
			} else {
				tline = [];
				for (var j=0; j<lines[i].length; ++j) {
					var value = lines[i][j];
					var o = {tag: "td", content: value};
					if (j==0) {
						o.classes = "foodsheet-col1";
					} else {
						value = parseFloat(value.toString());
						if (!value) {
							value = "-";
						} else if (value%1 == 0) {
							value = value.toFixed(0);
						} else {
							value = value.toFixed(2);
						}
						o.content = value;
					}
					tline.push(o);
				}
				comps.push({tag: "tr", components: tline});
			}
			
		}
		
		var obj = {tag: "table", classes: "foodsheet", components: [{tag:"tbody", components: comps}]};
		console.log(comps);
		console.log(obj);
		
		this.destroyClientControls();
		if (this.foods.length > 0) {
			this.createComponent(obj);
		}
		
		console.log(this);
		this.render();
	}
	
});