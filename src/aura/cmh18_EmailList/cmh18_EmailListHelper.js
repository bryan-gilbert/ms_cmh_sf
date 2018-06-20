({
	loadList : function(component, event, helper) {
        var caseId = component.get("v.caseId");
        var action = component.get("c.getList");
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	//console.log("Get emails ", theList);
				component.set("v.emails", theList);
				component.set("v.count", theList.length); 
                helper.emailSelected(component,event,helper);
            }
        });
        $A.enqueueAction(action);		
	},
	emailSelected : function(component, event, helper) {
        var selectedEmail = component.get("v.selectedEmail");
        //console.log("selectedEmail", selectedEmail);        
        var theList = component.get("v.emails");
        theList.forEach(function(email) {
            email.displayClass = selectedEmail === email.Id ? 'selected_row' : 'unselected_row';
            //console.log("email id", email.Id , "vs", selectedEmail, " ", email.displayClass);
        });
        component.set("v.emails",theList);
	}, 	
    
})