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
    setList : function(component,event,helper) {
        var params = event.getParam('arguments');
        if (params) {
            var list = params.newList;
            list.sort();
            component.set("v.originalList", list);
            component.set("v.activeList", list);            
            console.log("setList with new list ", list);
        }
    },
  // function for clear the selection 
	clear :function(component,event,helper){
        var ctarget = event.currentTarget;
        var pill = ctarget.dataset.value; 
        console.log("clear pill ", pill);
        var pills = component.get("v.selectedPills");
        var newPills = pills.filter(function(p) {
            return p !== pill;
        })
        component.set("v.selectedPills" , newPills);         
        // add the entry back to the active list
        var activeList = component.get("v.activeList");
		activeList.push(pill);
        activeList.sort();
        component.set("v.activeList", activeList);
	},
    
    // Called when the user selects an iter from the list.   
	bevt_AutocompleteSelect : function(component, event, helper) {
        // My parent component may have a form with many copies of this component.
        // So only act if the event is for me. 
		var thisAutoCompleteId = component.get("v.autoCompleteId");
		var autoCompleteId = event.getParam("autoCompleteId");
		if( thisAutoCompleteId === autoCompleteId ) {
            // create a pill with the selected entry
            var pills = component.get("v.selectedPills");
            var entry = event.getParam("entry");
            pills.push(entry);
			component.set("v.selectedPills" , pills); 
            // remove the entry from the active list (can only add entry once)
			var activeList = component.get("v.activeList");
            var filtered = activeList.filter(function(d) {
                return d !== entry;
            })
            component.set("v.activeList", filtered);
            // clear the search field and hide the search drop down
            component.set("v.searchTerm","");            
            var searchBox = helper.findSearchBox(component);
			helper.hide(searchBox);
		}
	},
   
})