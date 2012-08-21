function NutritionStorage(nutrimentsUrl, foodUrl, dataUrl, nutrimentGroupsUrl) {
	
	var nutriments = {};
	var nutrimentgroups = {};
	var foods = {};
	var data = [];
	var defaultLanguage = "en";
	
	this.open = function(callback) {
		
		var count = 0;
		var check_callback = function() {
			++count;
			if (count == 4) {
				callback(count);
			}
		}
		
		new datasource.HttpCsvReader(nutrimentsUrl, function(row) {
			nutriments[row[0]] = { unit: row[1], grp: row[2], name: { en: row[3], fr:row[4] } };
		}, ";", true).load(check_callback);

		new datasource.HttpCsvReader(nutrimentGroupsUrl, function(row) {
			nutrimentgroups[row[0]] = { en: row[1], fr:row[2] };
		}, ";", true).load(check_callback);
		
		new datasource.HttpCsvReader(foodUrl, function(row) {
			foods[row[0]] = { en: row[1], fr: row[2] };
		}, ";", true).load(check_callback);

		new datasource.HttpCsvReader(dataUrl, function(row) {
			data[row[0]] = row.slice(1);
		}, ";", true).load(check_callback);
		
	};

	this.getFoodList = function(regex, lang) {
		lang = lang || "en";
		var result = [];
		for (var key in foods) {
			var data = foods[key];
			if (data[lang].search(regex) != -1) {
				result.push({ id:key, label:data[lang]});
			}
		}
		return result;
	};

	this.getNutrimentGroups = function(lang) {
		lang = lang || defaultLanguage;
		var result = [];
		for (var key in nutrimentgroups) {
			var data = nutrimentgroups[key];
			result.push({ id:key, label:data[lang]});
		}
		return result;
	};

	this.getNutriments = function(lang) {
		lang = lang || defaultLanguage;
		var result = [];
		for (var key in nutriments) {
			var data = nutriments[key];
			result.push({ id:key, label:data["name"][lang], grp: data.grp, unit: data.unit} );
		}
		return result;
	}
	
}