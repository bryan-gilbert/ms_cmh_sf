({
	selectEntry : function(component, event, helper){      
		var autoCompleteId = component.get("v.autoCompleteId");
		var entry = component.get("v.entry");
        console.log("Lookup item selected ", entry);
		var compEvent = component.getEvent("bevt_AutocompleteSelect");
		compEvent.setParams({"autoCompleteId" : autoCompleteId, "entry" : entry });  
		compEvent.fire();
	},
    focusEntry : function(component, event, helper){      
		var autoCompleteId = component.get("v.autoCompleteId");
		var entry = component.get("v.entry");
        console.log("Lookup item selected ", entry);
		var compEvent = component.getEvent("bevt_AutocompleteSelect");
        compEvent.setParams({"autoCompleteId" : autoCompleteId, "entry" : entry, "eventType": "focus" });  
		compEvent.fire();
	},
    onKeyUp : function(component,event,helper) {
		var autoCompleteId = component.get("v.autoCompleteId");
		var entry = component.get("v.entry");
        console.log("In lookup result component key up", entry);
        var keyCode = event.keyCode;
        console.log("lookup results event with keycode", keyCode);
        if(keyCode === 27) {
            var compEvent = component.getEvent("bevt_AutocompleteSelect");
            compEvent.setParams({"autoCompleteId" : autoCompleteId, "entry" : entry, "eventType": "escape" });  
            compEvent.fire();
            // escape
			return;
        }        
    }
})