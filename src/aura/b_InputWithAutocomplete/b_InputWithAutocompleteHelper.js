({
	searchHelper : function(component,event,searchTerm) {
		// to do search for searchTerm in a list of entries 
        var list = component.get("v.activeList");
        var selectedList = list.filter(function(elem) {
            //console.log("test includes ", elem);
            return elem.includes(searchTerm);
        });
        console.log("searchHelper has list ", list, " searchTerm", searchTerm, " selectedList", selectedList);
        component.set("v.filteredList", selectedList);
	},
	hide : function(element) {
        console.log("hide element ", element);
		$A.util.addClass(element, 'slds-hide');
		$A.util.removeClass(element, 'slds-show');  
	},
	show : function(element) {
        console.log("show element ", element);
		$A.util.addClass(element, 'slds-show');
		$A.util.removeClass(element, 'slds-hide');	
	},
	open : function(element) {
		$A.util.addClass(element, 'slds-is-open');
		$A.util.removeClass(element, 'slds-is-close');
	},
	close : function(element) {
		$A.util.addClass(element, 'slds-is-close');
		$A.util.removeClass(element, 'slds-is-open');
	},
    findSearchBox : function(component){
        var id = 'searchRes' + component.get("v.autoCompleteId");
        //var searchBox = component.find(id); // returns more than one 
        var searchBox = document.getElementById (id);
        return searchBox;
    },
    fireNewListEvent : function(component,helper){
        var autoCompleteId = component.get("v.autoCompleteId");
        var bevt_AutocompleteList = $A.get("e.c:bevt_AutocompleteList");
        var list = component.get("v.selectedList");        
        bevt_AutocompleteList.setParams({"autoCompleteId": autoCompleteId, "list": list});
        bevt_AutocompleteList.fire();        
    },
    addEntry : function (component,helper, entry){
        console.log("add entry ", entry);
        // create a pill with the selected entry
        var pills = component.get("v.selectedList");
        pills.push(entry);
        component.set("v.selectedList" , pills); 
        // remove the entry from the active list (can only add entry once)
        var activeList = component.get("v.activeList");
        var filtered = activeList.filter(function(d) {
            return d !== entry;
        })
        component.set("v.activeList", filtered);
        helper.fireNewListEvent(component,helper); 
    },
    removeEntry : function(component,helper,entry){
        console.log("clear entry ", entry);
        var pills = component.get("v.selectedList");
        var newPills = pills.filter(function(p) {
            return p !== entry;
        })
        component.set("v.selectedList" , newPills);         
        // add the entry back to the active list
        var activeList = component.get("v.activeList");
        activeList.push(entry);
        activeList.sort();
        component.set("v.activeList", activeList);
        helper.fireNewListEvent(component,helper);        
    }
	
})