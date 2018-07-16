({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init b_LookupResult ", component.get("v.myCaseId"));            
    },   
	selectEntry : function(component, event, helper){      
		var autoCompleteId = component.get("v.autoCompleteId");
		var entry = component.get("v.entry");
        console.log("b_LookupResult item selected ", entry);
    	console.log("b_LookupResult Fire bevt_AutocompleteSelect SELECT ", component.get("v.myCaseId"));
		var compEvent = component.getEvent("bevt_AutocompleteSelect");
		compEvent.setParams({"autoCompleteId" : autoCompleteId, "entry" : entry, "caseId": component.get("v.myCaseId")  });  
		compEvent.fire();
	},
    focusEntry : function(component, event, helper){      
		var autoCompleteId = component.get("v.autoCompleteId");
		var entry = component.get("v.entry");
        console.log("b_LookupResult item selected ", entry);
    	console.log("b_LookupResult Fire bevt_AutocompleteSelect ", component.get("v.myCaseId"));
		var compEvent = component.getEvent("bevt_AutocompleteSelect");
        compEvent.setParams({"autoCompleteId" : autoCompleteId, "entry" : entry, "eventType": "focus", "caseId": component.get("v.myCaseId")  });  
		compEvent.fire();
	},
    onKeyUp : function(component,event,helper) {
		var autoCompleteId = component.get("v.autoCompleteId");
		var entry = component.get("v.entry");
        var keyCode = event.keyCode;
        console.log("b_LookupResult key up/code", entry, keyCode);
        if(keyCode === 27) {
        	console.log("b_LookupResult Fire bevt_AutocompleteSelect ESCAPE ", component.get("v.myCaseId"));
            var compEvent = component.getEvent("bevt_AutocompleteSelect");
            compEvent.setParams({"autoCompleteId" : autoCompleteId, "entry" : entry, "eventType": "escape", "caseId": component.get("v.myCaseId")  });  
            compEvent.fire();
            // escape
			return;
        }        
    }
})