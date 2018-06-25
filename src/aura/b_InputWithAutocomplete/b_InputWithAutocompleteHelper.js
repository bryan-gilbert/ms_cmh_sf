({
	searchHelper : function(component,event,searchTerm) {
		// to do search for searchTerm in a list of entries 
        var list = component.get("v.activeList");
        var selectedList = list.filter(function(elem) {
            console.log("test includes ", elem);
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
    }
	
})