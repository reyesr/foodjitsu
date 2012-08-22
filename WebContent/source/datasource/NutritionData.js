enyo.kind({
	name: "datasource.NutritionData",
	
	baseUrl: null,

	published: {
		nutrimentFileName: "nutriments.csv", 
		nutrimentGroupFileName: "nutrimentgroup.csv",
		foodFileName: "food.csv", 
		dataFileName: "data.csv",
		
		storage: new datasource.LocalStorage(),
		language: "en",
		displayedNutriments: {},
	},
	
	nutriments: {},
	nutrimentgroups : {},
	foods: {},
	data: {},
	
	mergeUrlParts: function(base, filename) {
		if (base.charAt(base.length) == '/') {
			return base + filename;
		}
		return base + '/' + filename;
	},
	
	setup: function(baseUrl, callback) {
        this.baseUrl = baseUrl;
        var self = this;

        var count = 0;
		var check_callback = function() {
			++count;
			if (count == 4) {
				callback(count);
			}
		};
        
		new datasource.HttpCsvReader(this.mergeUrlParts(this.baseUrl, this.nutrimentFileName), function(row) {
			self.nutriments[row[0]] = { unit: row[1], grp: row[2], name: { en: row[3], fr:row[4] } };
		}, ";", true).load(check_callback);

		new datasource.HttpCsvReader(this.mergeUrlParts(this.baseUrl, this.nutrimentGroupFileName), function(row) {
			self.nutrimentgroups[row[0]] = { en: row[1], fr:row[2] };
		}, ";", true).load(check_callback);
		
		new datasource.HttpCsvReader(this.mergeUrlParts(this.baseUrl, this.foodFileName), function(row) {
			self.foods[row[0]] = { en: row[1], fr: row[2] };
		}, ";", true).load(check_callback);

		new datasource.HttpCsvReader(this.mergeUrlParts(this.baseUrl, this.dataFileName), function(row) {
			self.data[row[0]] = row.slice(1);
		}, ";", true).load(check_callback);

		this.displayedNutriments = this.storage.get("nutriments.displayed", this.displayedNutriments);
		
		return this;
	},

	displayedNutrimentsChanged: function() {
		this.storage.set("nutriments.displayed", this.displayedNutriments);
	},
	
	//
	// Returns a list of { id: groupId, label: "" } elements 
	getNutrimentGroups : function(lang) {
		lang = lang || this.language;
		var result = [];
		for (var key in this.nutrimentgroups) {
			var data = this.nutrimentgroups[key];
			result.push({ id:key, label:data[lang]});
		}
		return result;
	},

	//
	// returns a list of { id: nutrimentId, label: "nutriment name", grp: nutrimentGroupdId, unit: "unit"}
	getNutriments: function(lang) {
		lang = lang || this.language;
		var result = [];
		for (var key in this.nutriments) {
			var data = this.nutriments[key];
			result.push({ id:key, label:data["name"][lang], grp: data.grp, unit: data.unit} );
		}
		return result;
	},
	
	searchFood: function(search, lang) {
		lang = lang || this.language;
		var result=[];
		var pattern =  new RegExp(search, "i");
		
		for (var k in this.foods) {
			var food = this.foods[k];
			var str = food[lang];
			var res = str.search(pattern);
			if (res >= 0) {
				result.push({id: k, label: str});
			}
		}
		return result;
	},
	
	getNutriment: function(nutId, lang) {
		lang = lang || this.language;
		if (this.nutriments[nutId]) {
			var n = this.nutriments[nutId];
			return {id: nutId, grp: n.grp, unit: n.unit, label: n.name[lang] };
		}
		return undefined;
	},
	
	getGroupedDisplayedNutriments: function() {
		var result = {};
		for (var nutriment in this.displayedNutriments) {
			if (this.displayedNutriments[nutriment]) {
				var grp = this.nutriments[nutriment].grp;
				if (!result[grp]) {
					result[grp] = [];
				}
				result[grp].push(nutriment);
			}
		}
		return result;
	},
	
	getNutrimentGroupName: function(groupId, lang) {
		lang = lang || this.language;
		if (this.nutrimentgroups[groupId]) {
			return this.nutrimentgroups[groupId][lang];
		}
		return undefined;
	},
	
	fetchFood: function(foodId, lang) {
		lang = lang || this.language;
		return { label: this.foods[foodId][lang], data: this.data[foodId] };
	}
	
});