utest.kind({
	name: "tests.TestLocalStorage",

	genericSetGetDelVal: function() {
		var store = new datasource.LocalStorage();
		this.assert.object(store);

		for (var i=0; i<arguments.length; ++i) {
			var tested = arguments[i];
			store.set("myobj", tested);
			this.assert.same(store.get("myobj"), tested);
			
			store.remove("myobj");
			this.assert.same(store.get("myobj"), undefined, "Value removed correctly");
		}
	},
	
	testSetObject: function() {
		
		var obj1 = {un: 1, deux: 2};
		var obj2 = {un: true, deux: "deux", trois: 3, quatre: {4:4}};
		this.genericSetGetDelVal(obj1, obj2);
	},
	
	testSetString: function() {
		var tested = "some string";
		var tested2 = "some other string";
		this.genericSetGetDelVal(tested, tested2);
	},

	testNumber: function() {
		var tested = 123.231;
		var tested2 = 543;
		this.genericSetGetDelVal(tested, tested2);
	},

	testSetBoolean: function() {
		var tested = true
		var tested2 = false
		this.genericSetGetDelVal(tested, tested2);
	},


});