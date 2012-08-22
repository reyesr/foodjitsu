enyo.kind({
    name : "App",
    fit : true,
    kind : enyo.Panels,
    classes : "panels-sample-flickr-panels enyo-unselectable enyo-fit",
    arrangerKind : "CollapsingArranger",
	lang: new l10n({language: null, acceptedLanguages: ["fr", "en"], defaultFile: "app"}),

    data: new datasource.NutritionData(),
    storage: new datasource.LocalStorage({prefix: "app_"}),
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
                    				{kind: "Image", src: "assets/icons/22x22/search-gray.png", ontap: "search"}
                    			  ]},
                    			  {name: "l10ndump", kind: onyx.Button, content: "?", ontap: "outputLocaleTemplate", isShowing: false},
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
   	                                	   style: "padding: 1em; text-align: center;",
   	                                	   content: "To look up a specific food, type its name in the search box above."
   	                                   },
   	                                   {
   	                                	   style: "text-align:center; margin-top:1em;",
   	                                	   components: [
   	                                	                {content: "Choose your language"},
   	                	                                {kind: "onyx.MenuDecorator", onSelect: "languageSelected", components: [
                                                  			{name: "languageChoice", content: "Choose your language"},
                                                  			{kind: "onyx.Menu", floating: true, components: [
                                                  				{content: "English", lng: "en"},
                                                  				{content: "Français", lng: "fr"}                                                  			
                                                  			]}
                                                  		]},
                                                  		{
                                                  			style: "margin-top-1em; padding:1em;",
                                                  			content: "This program is free software, distributed under the terms of the GPL3",
                                                  		},
                                                  		{
                                                  			tag: "a", style: "color: white",
                                                  			content: "https://github.com/reyesr/foodjitsu",
                                                  			attributes: {href: "https://github.com/reyesr/foodjitsu"}
                                                  		},
   	                                	   ]
   	                                   },
                                		{ tag: "div", style: "color: white; padding:1em; text-align:center;",
                                			content: "The nutritional data provided by the The Canadian Nutrient File (CNF) Database.",
                                			attributes: {href: "http://www.hc-sc.gc.ca/fn-an/nutrition/fiche-nutri-data/index-eng.php"}
                                		},
                                		{ tag: "div", style: "color: white; padding:1em; text-align:center;",
                                 			content: "This program and its data are provided as is without warranty or condition of any kind"
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
            	                       { content: "Select the nutrients for the charts", style: "padding:1em;" },
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
    ],
    
    rendered: function() {
    	this.inherited(arguments);
    	this.data.setup("assets/data", enyo.bind(this, this.ready));

    	if (!this.debugFlag) {
    		this.$.l10ndump.hide();
    	}
    	
    	var deflang = this.storage.get("language", this.lang.getBrowserLanguage());
    	this.lang.init(deflang);
    	
    	switch (this.lang.getIso()) {
    	case "fr":
    		this.$.languageChoice.setContent("Français");
    		break;
    	case "en":
    		this.$.languageChoice.setContent("English");
    	}
    	this.lang.translateControl(this);
    	this.lang.translateControl(this.$.favorites);
    	this.data.setLanguage(this.lang.getIso());
    	var self = this;
    	this.lang.t(this.$.search.placeholder, this.$.search, function(r) {
    		self.$.search.setPlaceholder(r);
    	});
    },
    
    ready: function() { // from here, the data is ready
    	this.$.nutriments.setStorage(this.data);
    	this.$.sheet.setStorage(this.data);
    	
    	this.$.searchResultList.setSpinner();
    },
    
    search: function(inSender, inEvent) {
    	this.setLeftPane("searchresult");
    	this.$.searchResultList.setSpinner();
    	var value = this.$.search.getValue();
    	if (value != "") {
        	var res = this.data.searchFood(value);
    	}
    	this.$.searchResultList.setData(res);
    },
    
    foodSelected: function(inSender, inEvent) {
    	this.$.sheet.addFood(inEvent.originator.getSelectedFood());
    	var bounds = this.getBounds();
    	if (bounds.width < 800) {
    	    this.setIndex(1);
    	}
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
		}
	},
	iconGroupActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.indexInContainer();
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
   	    this.setIndex(0);

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
		this.$.languageChoice.setContent(inEvent.content);
		this.lang.setLanguage(inEvent.originator.lng);
		this.databaseLanguage = inEvent.originator.lng;
		this.data.language = inEvent.originator.lng;
		this.lang.retranslateAll();
		this.storage.set("language", this.lang.getIso());
		this.$.nutriments.storageChanged();
	},
	
	outputLocaleTemplate: function() {
		if (console && console.log) {
			console.log(this.lang.getTemplate());
		}
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
		this.$.sheet.createTable(inEvent.data);
	}
	
});
