enyo.kind({
	name: "NutrimentList",
	published: {
		storage: undefined
	},

	events: {
		onChange: ""
	},
	
	components: [],
	fit: true,
		
	storageChanged: function() {
		this.destroyClientControls();
		var groups = this.storage.getNutrimentGroups();
		var nutriments = this.storage.getNutriments();

		var comps = [];
		for (var g in groups) {
			var group = groups[g];
			
			var groupcomp = {kind: "onyx.Groupbox", components: [{kind: "onyx.GroupboxHeader", content: group.label}]};
			for (var i=0; i<nutriments.length; ++i) {
				if (nutriments[i].grp == group.id) {
					groupcomp.components.push({kind: "FittableColumns", components: [ 
					    {kind: "onyx.Checkbox", style: "height: 32px;", owner: this, onchange: "cbChange", nutrimentId:  nutriments[i].id, checked: this.storage.displayedNutriments[nutriments[i].id]?true:false},
					    {content: nutriments[i].label, style: ""}
										]});
				}
			}
			comps.push(groupcomp);
		}
		this.createComponents(comps);
		this.render();
	},
	
	cbChange:  function(inSender, inEvent) {
		var disp  = this.storage.getDisplayedNutriments();
		if (inSender.getValue()) {
			disp[inSender.nutrimentId] = inSender.getValue();
		} else {
			delete disp[inSender.nutrimentId];
		}
		this.storage.setDisplayedNutriments(disp);
		this.storage.displayedNutrimentsChanged();

		this.doChange();
	},
});
