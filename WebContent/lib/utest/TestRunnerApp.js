var utest = utest || {};

enyo.kind({
	name: "utest.TestRunnerApp",
	kind: "Panels",
	classes: "panels-sample-flickr-panels enyo-unselectable enyo-fit",
	arrangerKind: "CollapsingArranger",
	msgid: 0,
	
	components: [
		{layoutKind: "FittableRowsLayout", components: [
		    {name: "runTestsButton", kind:"onyx.Button", content: "Button", ontap:"runTests"},
			{name:"testItemRepeater", kind: "Repeater", fit: true, touch: true, onSetupItem: "setupTestItem", components: [
			             {name:"item", classes:"repeater-sample-item", components: [
                   				{tag:"span", name: "testName"},
                   				{tag:"span", name: "personName", content: " ..."}
                   				]}
			             ]}
		]},
		{kind: "Scroller", name: "logScroller", components: [
		    {kind: "utest.ListAppender", name: "flogs", 
		         template: {kind: "FittableColumns", components: [
		      		           {name: "msgid", style: "width: 5em;"},
		    		           {name: "result", style: "width: 6em; text-align: center;"},
		    		           {name: "objectName", style: "padding-left: 1em; width: 10em;"},
		    		           {name: "msg", style: "padding-left: 1em;"}
	      		           ] }
		       },
		    ]},
	],
	create: function() {
		this.inherited(arguments);
		this.setup();
	},
	
	setup: function() {
		var tests = utest.TestUnit.allTestUnits;
		this.$.testItemRepeater.setCount(utest.tests.length);
		utest.testRunner = this;
	},

	addResult: function(methodName, result, failMessage, successMessage) {
		// console.log("GOT A RESULT: " + methodName + " = " +result + " / " + failMessage);
		this.msgid++;
		this.$.flogs.$$.msgid.content = this.msgid;

		this.$.flogs.$$.result.content = "invalid";
		if (result) {
			this.$.flogs.$$.result.applyStyle("background", "green");
			this.$.flogs.$$.result.applyStyle("color", "black");
			this.$.flogs.$$.result.content = "[PASS]";
		} else {
			this.$.flogs.$$.result.applyStyle("background", "red");
			this.$.flogs.$$.result.applyStyle("color", "white");
			this.$.flogs.$$.result.content = "[FAIL]";
		}
		
		this.$.flogs.$$.objectName.content = methodName; 
		this.$.flogs.$$.msg.content = result?successMessage:failMessage;
		console.log(result + " " + enyo.json.stringify(this.$.flogs.$$.result.style));
		
		this.$.flogs.append();
		this.$.logScroller.scrollToBottom();
	},
	
	addLog: function(methodName, message) {
		// console.log("GOT A LOG: " + message);
		// this.$.logs.addLog(message);
		this.msgid++;

		this.$.flogs.$$.result.content = "log";
		this.$.flogs.$$.result.applyStyle("background", "white");
		this.$.flogs.$$.result.applyStyle("color", "black");
		this.$.flogs.$$.objectName.content = methodName; 
		this.$.flogs.$$.msgid.content = this.msgid;
		this.$.flogs.$$.msg.content = message;

		this.$.flogs.append();
		this.$.logScroller.scrollToBottom();
	},

	setupListResults: function(inSender, inEvent) {
		return this.$.logs.setupListResults(inSender, inEvent);
	},
	
	setupTestItem: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		
		var data = utest.tests[index];
		item.$.testName.content = data;
	},
	
	instanciateByName: function(name) {
		var parts = name.split('.');
		var ptr = utest.global;

		for (var i=0; i<parts.length; ++i) {
//			console.log(parts[i] +" = " + ptr[parts[i]]);
			if (typeof ptr[parts[i]] == "function") {
				return ptr[parts[i]];
			}
			ptr = ptr[parts[i]];
		}
		return ptr;
	},

	runSingleTest: function(obj, method) {
		obj[method]();
		// console.log("Result, method " + method + ": " + obj.assert.getPassed() + " passed, " + obj.assert.getFailed() + " failed");
	},
	
	runTests: function() {
		// console.log(utest.tests);
		this.$.flogs.clear();
		this.msgid = 0;
		
		enyo.forEach(utest.tests, function(element) {
			var inst = new (this.instanciateByName(element.toString()));
			for (var k in inst) {
				if (utest.isTestingFunction(inst, k)) {
					this.runSingleTest(inst,k);
				}
			}
		}, this);
	}
});
