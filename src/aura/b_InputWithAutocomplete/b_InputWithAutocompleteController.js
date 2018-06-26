({  
    doInit : function(component, event, helper) {
      var list = component.get("v.originalList");
      console.log("Init has list ", list);
    },
	keyPressController : function(component, event, helper) {
		var searchTerm = component.get("v.searchTerm");
        var searchBox = helper.findSearchBox(component);
		if( searchTerm.length > 0 ){
            console.log("keyPressController open with ", searchTerm);
			helper.show(searchBox);
			helper.searchHelper(component,event,searchTerm);
		}
		else{  
            console.log("keyPressController close");
			helper.hide(searchBox);
		}         
	},
    setLists : function(component,event,helper) {
        var params = event.getParam('arguments');
        if (params) {
            var list = params.newList;
            list.sort();            
            component.set("v.originalList", list);
            component.set("v.activeList", list);            
            console.log("setList with new list ", list);
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
            helper.addEntry(component, helper, entry);
            // clear the search field and hide the search drop down
            component.set("v.searchTerm","");            
            var searchBox = helper.findSearchBox(component);
			helper.hide(searchBox);
		}
	},
   
})