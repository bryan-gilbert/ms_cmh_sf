({  
    doInit: function(component,event,helper) {
    	component.set("v.myCaseId", component.get("v.caseId"));
    	var list = component.get("v.originalList");
        console.log("Init b_InputWithAutocomplete ", component.get("v.myCaseId"), list);    
    },
	keyUp : function(component, event, helper) {
		var searchTerm = component.get("v.searchTerm").trim();
        var keyCode = event.getParams().keyCode;
        console.log("b_InputWithAutocomplete kyUp event with keycode", keyCode);
        var searchBox = helper.findSearchBox(component);
        if(keyCode === 27) {
            // escape
            component.set("v.searchTerm","");            
            var searchBox = helper.findSearchBox(component);
            helper.hide(searchBox);
			return;
        }
		if( searchTerm.length > 0 ){
            console.log("b_InputWithAutocomplete keyUp open with ", searchTerm);
			helper.show(searchBox);
			helper.searchHelper(component,event,searchTerm);
            if(keyCode === 13) {
                // user wants to add new entry
                if(searchTerm.length > 0) {
                    helper.addEntry(component,helper,searchTerm);            
                }                
                // clear the search field and hide the search drop down
                component.set("v.searchTerm","");            
                var searchBox = helper.findSearchBox(component);
                helper.hide(searchBox);
            }
		}
		else{  
            console.log("b_InputWithAutocomplete keyUp close");
			helper.hide(searchBox);
		}         
	},
    onblur : function(component,event,helper) {
        console.log("b_InputWithAutocomplete clear the search field and hide the search drop down");
        var entry = component.get("v.searchTerm");
        if(entry.length > 0){
            helper.addEntry(component,helper,entry);
        }
        var searchBox = helper.findSearchBox(component);
        helper.hide(searchBox);
        
    },
    setLists : function(component,event,helper) {
        var params = event.getParam('arguments');
        if (params) {
            var list = params.newList;
            list.sort();            
            component.set("v.originalList", list);
            component.set("v.activeList", list);            
            console.log("b_InputWithAutocomplete setList with new list ", list);
            var prePopList = params.prePopList;
            if(prePopList && prePopList.length>0){
                prePopList.forEach(function(entry){
                    helper.addEntry(component,helper,entry);
                })
            }
        }
    },
  // function for clear the selection 
	clear :function(component,event,helper){
        var ctarget = event.currentTarget;
        var entry = ctarget.dataset.value; 
        helper.removeEntry(component,helper,entry);
	},
    
    // Called when the user selects an iter from the list.   
	bevt_AutocompleteSelect : function(component, event, helper) {
        // My parent component may have a form with many copies of this component.
        // So only act if the event is for me. 
		var thisAutoCompleteId = component.get("v.autoCompleteId");
		var autoCompleteId = event.getParam("autoCompleteId");
		if( thisAutoCompleteId === autoCompleteId ) {
            var entry = event.getParam("entry");
            var eventType = event.getParam("eventType");
            if("focus" === eventType) {
                component.set("v.searchTerm",entry);  
            } else if ("escape" === eventType){
                console.log("b_InputWithAutocomplete lookup item says to exit");
                component.set("v.searchTerm","");            
                var searchBox = helper.findSearchBox(component);
                helper.hide(searchBox);
            } else {
                helper.addEntry(component, helper, entry);
                // clear the search field and hide the search drop down
                component.set("v.searchTerm","");            
                var searchBox = helper.findSearchBox(component);
                helper.hide(searchBox);
            }
		}
	},
   
})