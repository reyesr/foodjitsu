enyo.kind({
    name : "App",
    fit : true,
    kind : enyo.Panels,
    classes : "panels-sample-flickr-panels enyo-unselectable enyo-fit",
    arrangerKind : "CollapsingArranger",
	lang: new l10n({language: null, acceptedLanguages: ["fr", "en"], defaultFile: "app"}),

    data: new datasource.NutritionData(),
    databaseLanguage: "en",
    debugFlag: false,
    
    components : [
        {
            layoutKind : "FittableRowsLayout",
            components : [
                {
                    kind : "onyx.Toolbar",
                    components : [
                                  {kind: "Group", tag: null, onActivate:"iconGroupActivated", defaultKind: "onyx.IconButton", components: [
           	              				{src: "assets/icons/32x32/home.png", active: true, name: "tbHome"},
           	              				{src: "assets/icons/32x32/favorite.png", name: "tbFavorite"},
           	              				{src: "assets/icons/32x32/preferences.png", name: "tbPreferences"},
           	              				{src: "assets/icons/32x32/search.png", name: "tbSearch"}
           	                         ]},
                                  {kind: "onyx.InputDecorator", components: [
                    				{name: "search", kind: "onyx.Input", placeholder: "Search food", onchange:"search"},
                    				{kind: "Image", src: "assets/icons/22x22/search-gray.png"}
                    			  ]},
                    			  {kind: onyx.Button, content: "?", ontap: "outputLocaleTemplate"},
                    			  {
                    				  kind: onyx.Grabber
                    			  }
                        //{ name : "searchSpinner", kind : "Image", src : "assets/spinner.gif", showing : false },
                    ] 
                },
                {
                	kind: enyo.Panels,
                	fit: true,
                	name: "leftpan",
        			realtimeFit: true, 
        			draggable: false,
        			
                	components: [
               	                {kind:"enyo.Scroller", fit: true, components: [
   	                                   {
   	                                	   kind: enyo.Image, src: "assets/logo.png", style: "width: 100%;"
   	                                   },
   	                                   {
   	                                	   style: "text-align: center; font-size: 1.1em; font-style: italic;",
   	                                	   content: "Your nutrition facts checker"
   	                                   },
   	                                   {
   	                                	   style: "text-align:center; margin-top:3em;",
   	                                	   components: [
   	                                	                {content: "Choose your language"},
   	                	                                {kind: "onyx.MenuDecorator", onSelect: "languageSelected", components: [
                                                  			{name: "languageChoice", content: "Choose your language"},
                                                  			{kind: "onyx.Menu", floating: true, components: [
                                                  				{content: "English", lng: "en"},
                                                  				{content: "Français", lng: "fr"}                                                  			
                                                  			]}
                                                  		]},
   	                                	   ]
   	                                   }
                                      ]
               	                },
               	                {kind:"enyo.Scroller", fit: true, components: [
	                                   { name: "favorites", kind: "FavoriteList", onSelected: "favoriteSelected" }
                                   ]
            	                },
             	                {kind:"enyo.Scroller", fit: true, components: [
	                                   { name: "searchResultList", kind : "FoodResultList", onFoodSelected: "foodSelected"}
                                   ]
            	                },
            	                {kind:"enyo.Scroller", fit: true, components: [
            	                       { name: "nutriments", kind: "NutrimentList", onChange: "updateFoodDisplay" }
                                   ]
            	                },
                	]
                },
        ] }, 
        { fit: true,
			kind: enyo.FittableRows,
			classes: "panels-sample-panels enyo-border-box enyo-fit panels-sample-flickr-main",
			components: [
			                {
			                    kind : "onyx.Toolbar",
			                    components : [
			                                  {kind: onyx.Grabber, ontap: "hideSheet" },
			                                  {kind:"onyx.IconButton", src:"assets/icons/32x32/document-new.png", ontap:"clearSheet", style: "float:right;"},
			                                  {kind:"onyx.IconButton", src:"assets/icons/32x32/favorite.png", ontap:"nameFavoritePopup"},
			                    			  {kind: onyx.Button, content: "Nutrients list", ontap: "changeNutrients"}
			                    ] },
			                    {name: "addFavPopup", classes: "onyx-sample-popup", 
			                    	kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", scrim: true, components: [
					                        {content: "Please name this nutrition sheet", style: "padding-top:2em;padding-left:2em;padding-right:2em;padding-bottom:1em"},                                                                                                                                                                        
		                      				{kind: "onyx.InputDecorator", style: "margin-left:2em;", components: [
		                      					{kind: "onyx.Input", name: "favoriteNameInput"}
		                      				]},
		                      				{tag: "br"},
		                      				{kind: "onyx.Button", content: "Cancel", ontap: "closeAddFavPopup"},
		                      				{kind: "onyx.Button", style:"float:right", content: "Add", ontap: "addFavorite", popup: "lightPopup"}
                      			]},
			             {kind:"enyo.Scroller", fit: true, components: [{ name: "sheet", kind: "NutritionalSheet" }]}
			],
		}
//    		{
//            	kind: "Panels", 
//    			name:"mainPanels", 
//    			fit:true, 
//    			realtimeFit: true, 
//    			classes: "panels-sample-panels enyo-border-box enyo-fit panels-sample-flickr-main", 
//    			components: [
////					{kind:"enyo.Scroller", components: []},
//					,
//					
//    	 			{content:1, style:"background:orange;"},
//    	 			{content:2, style:"background:yellow;"},
//    	 			{content:3, style:"background:green;"},
//    	 			{content:4, style:"background:blue;"},
//    	 			{content:5, style:"background:indigo;"},
//    	 			{content:6, style:"background:violet;"}
//    	 			]
//    		} //,

    ],
    
    rendered: function() {
    	this.inherited(arguments);
    	this.data.setup("assets/data", enyo.bind(this, this.ready));
    	
    	this.lang.init();
    	
    	this.data.setLanguage(this.lang.getIso());
    	switch (this.lang.getIso()) {
    	case "fr":
    		this.$.languageChoice.setContent("Français");
    		break;
    	case "en":
    		this.$.languageChoice.setContent("English");
    	}
    	this.lang.translateControl(this);
    	this.lang.translateControl(this.$.favorites);
    	var self = this;
    	this.lang.t(this.$.search.placeholder, this.$.search, function(r) {
    		self.$.search.setPlaceholder(r);
    	});
    },
    
    ready: function() { // from here, the data is ready
    	this.$.nutriments.setStorage(this.data);
    	this.$.sheet.setStorage(this.data);
    	
    	
    	console.log("THIS NAME: " + this.name);
    	console.log(this);
    	
//    	console.log("LANGS");
//    	console.log(this.lang);
//    	this.lang.setLanguage("fr-FR");
//    	console.log(this.lang);
//    	
//    	
    	// this.lang.language = "fr";
//    	alert("lang: " + this.lang.browserLanguage + " / " + this.lang.getIso() + " && " + this.lang.getRegion());
//    	this.search();
    },
    
    search: function(inSender, inEvent) {
    	var value = this.$.search.getValue();
    	if (value != "") {
        	var res = this.data.searchFood(value);
    	}
    	// console.log(res);
//		this.$.leftpan.setIndex(0);
    	this.setLeftPane("searchresult");
    	this.$.searchResultList.setData(res);
    },
    
    foodSelected: function(inSender, inEvent) {
//    	console.log("Food selected: " + inSender + " / " + inEvent.originator.getSelectedFood());
//    	console.log(arguments);
    	this.$.sheet.addFood(inEvent.originator.getSelectedFood());
    	var bounds = this.getBounds();
    	if (bounds.width < 800) {
    	    this.setIndex(1);
    	}
//	    console.log(this.getBounds());
    	return true;
    },
    
    updateFoodDisplay: function() {
    	this.$.sheet.update();
    },

    radioActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			// this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" radio button is selected.");
			switch(inEvent.originator.uid) {
			case "search":
				this.$.leftpan.setIndex(0);
				break;
			case "nutriments":
				this.$.leftpan.setIndex(1);
				break;
			}
			// console.log(inEvent.originator);
		}
	},
	iconGroupActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.indexInContainer();
//			console.log("index of icon: " + selected);
			switch (selected) {
			case 0:
				this.setLeftPane("home");
				break;
			case 1:
				this.setLeftPane("favorite");
				break;
			case 2:
				this.setLeftPane("prefs");
				break;
			case 3:
				this.setLeftPane("searchresult");
				break;
			}
		}
	},
	setLeftPane: function(index) {
//    	var bounds = this.getBounds();
//    	if (bounds.width < 800) {
   	    this.setIndex(0);
//    	}

//    	console.log("setLeftPane: " + index);
		switch(index) {
		case 0:
		case "home":
			this.$.tbHome.setActive(true);
			this.$.leftpan.setIndex(0);
			break;
		case 1:
		case "favorite":
			this.$.tbFavorite.setActive(true);
			this.$.leftpan.setIndex(1);
			break;
		case 2:
		case "searchresult":
			this.$.tbSearch.setActive(true);
			this.$.leftpan.setIndex(2);
			break;
		case 3:
		case "prefs":
			this.$.tbPreferences.setActive(true);
			this.$.leftpan.setIndex(3);

			break;
			
		}
	},
	
	hideSheet: function() {
		this.setIndex(0);
	},
	
	setDebugFlag: function(flag) {
		this.debugFlag = flag;
		return this;
	},
	
	languageSelected: function(inSender, inEvent) {
//		console.log(inSender);
//		console.log(inEvent);
		this.$.languageChoice.setContent(inEvent.content);
		this.lang.setLanguage(inEvent.originator.lng);
		this.databaseLanguage = inEvent.originator.lng;
		this.data.language = inEvent.originator.lng;
		this.lang.retranslateAll();
	},
	
	outputLocaleTemplate: function() {
		console.log(this.lang.getTemplate());
	},
	
	nameFavoritePopup: function() {
		if (this.$.sheet.internalData) {
			this.$.addFavPopup.show();
		}
	},
	closeAddFavPopup: function() {
		this.$.addFavPopup.hide();
	},
	addFavorite: function(inSender, inEvent) {
		console.log("Add fav: " + this.$.favoriteNameInput.getValue());
		console.log(inSender);
		this.$.favorites.add(this.$.favoriteNameInput.getValue(), this.$.sheet.internalData);
		this.$.addFavPopup.hide();
		this.setLeftPane("favorite");
		return true;
	},
	clearSheet: function() {
		this.$.sheet.clear();
	},
	changeNutrients: function() {
		this.setLeftPane("prefs");
	},
	
	favoriteSelected: function(inSender, inEvent) {
		console.log("=== FAV SEL");
		console.log(arguments);
		this.$.sheet.createTable(inEvent.data);
	}
	
});
