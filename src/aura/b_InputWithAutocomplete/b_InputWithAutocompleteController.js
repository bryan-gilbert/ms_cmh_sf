({  
    doInit : function(component, event, helper) {
      var list = component.get("v.listForAutocomplete");
      console.log("Init has list ", list);
    },
	keyPressController : function(component, event, helper) {
		var searchTerm = component.get("v.searchTerm");
        var id = 'searchRes' + component.get("v.autoCompleteId");
        //var searchBox = component.find(id); // returns more than one 
        var searchBox = document.getElementById (id);
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
  
  // function for clear the selection 
	clear :function(component,event,helper){
        var ctarget = event.currentTarget;
        var pill = ctarget.dataset.value; 
        var pills = component.get("v.selectedPills");
        var newPills = pills.filter(function(p) {
            return p !== pill;
        })
        console.log("clear pill ", pill, newPills);
        component.set("v.selectedPills" , newPills); 
	},
    
    // Called when the user selects an iter from the list.   
	bevt_AutocompleteSelect : function(component, event, helper) {
		var thisAutoCompleteId = component.get("v.autoCompleteId");
		var entry = event.getParam("entry");
		var autoCompleteId = event.getParam("autoCompleteId");
		if( thisAutoCompleteId === autoCompleteId ) {
            var pills = component.get("v.selectedPills");
            pills.push(entry);
			component.set("v.selectedPills" , pills); 
            component.set("v.searchTerm","");            
			helper.close(component.find("searchRes"));
		}
	},
   
})