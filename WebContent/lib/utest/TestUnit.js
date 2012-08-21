var utest = utest || {};

utest.tests = [];
utest.global = this;
utest.methodUnderTest = null;

utest.isTestingFunction = function(obj, key) {
	if ((/^[Tt]est.+$/.test(key) || /^.+[Tt]est$/.test(key)) && typeof obj[key] == "function" ) {
		return true;
	}
	return false;
};

utest.kind = function(obj) {
	console.log("utest.kind : " + obj["name"]);
	console.log(obj);
	if (obj["name"]) {
		console.log("added name " + obj.name);
		utest.tests.push(obj.name);
	} else {
		// FAIL HERE
	}

	// Sets the right kind if it's not set
	if (!obj["kind"]) {
		obj["kind"] = "utest.TestUnit";
	}
	
	for (var k in obj) {
		if (utest.isTestingFunction(obj, k)) {
			var org = obj[k];
			obj[k] = (function(methodName, original) {
				return function() {
					console.log("Setting method name: " + methodName);
					console.log(this);
					this.assert.init(methodName);
					original.apply(this, arguments);
					this.assert.stop();
				}
			})(k, org);
		}
	}
	
	return enyo.kind(obj);
};

enyo.kind({
	name: "utest.TestUnit",
	kind: "Component",

	create: function() {
		
	},
	
	assert: (function() {
		var methodUnderTest = "";
		var failed = 0;
		var passed = 0;
		var startTime = 0;
		var time = 0;
		
		var execTest = function(val, resultMessage, userMessage) {
			if (val) {
				++passed;
			} else {
				++failed;
			}
			if (utest.testRunner) {
				utest.testRunner.addResult(methodUnderTest,val, resultMessage, userMessage);
			}
		};
		
		
		return {
			init: function(name) {
				methodUnderTest = name;
				failed = passed = 0;
				startTime = new Date().getTime();
			},
			stop: function() {
				time = new Date().getTime() - startTime;
			},
			getMethod: function() {
				return methodUnderTest;
			},			
			getPassed: function() {
				return passed;
			},
			getFailed: function() {
				return failed;
			},
			getTime: function() {
				return time;
			},
			
			log: function(message) {
				utest.testRunner.addLog(methodUnderTest, message);
			},
			isTrue: function(val, message) {
				execTest(val, "isTrue failed", message || "true value found");
			},
			isFalse: function(val, message) {
				execTeset(!val, "isFalse failed", message || "false value found");
			},
			equals: function(found, expected, message) {
				execTest(found === expected, "Expected " + expected + ", but found " + found, message || "Found " + found + ", as expected");
			},
			same: function(found, expected, message) {
				message = message || "Found " + found + ", as expected";
				if (typeof found != typeof expected) {
					execTest(false, "Found " + typeof found + " but expected a " + typeof expected, message);
				} else {
					switch(typeof found)  {
					case "object":
						var strfound = enyo.json.stringify(found);
						var strexp = enyo.json.stringify(expected);
						execTest(strfound == strexp, "Expected object " + strexp + ", but found " + strfound, message);
						break;
					default:
						execTest(found === expected, "Expected " + expected + ", but found " + found, message);
						break;
					}
				}
			},
			greaterThan: function(found, threshold, message) {
				execTest(found > threshold, "Expected value greater than " + threshold + ", but found " + found, message || (found + " greater than " + than));
			},
			lowerThan: function(found, threshold, message) {
				execTest(found < threshold, "Expected value greater than " + threshold + ", but found " + found, message || (found + " lower than " + than));
			},
			object: function(obj, message) {
				execTest(obj != null && typeof obj == "object", "Expected object, but found " + typeof obj, message || "valid object found");
			}
		};
	})()
	
});
