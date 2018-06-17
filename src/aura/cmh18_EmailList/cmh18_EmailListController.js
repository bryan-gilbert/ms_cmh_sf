({
	doInit : function(component, event, helper) {
        var caseId = component.get("v.caseId");
        var action = component.get("c.getList");
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	console.log("Get emails ", theList);
				component.set("v.emails", theList);
				component.set("v.count", theList.length);                
            }
        });
        $A.enqueueAction(action);		
	}, 	
	generateEvent : function(component, event, helper) {
		var btnClicked = event.getSource();
		var emailId = btnClicked.get("v.value");
		var action = btnClicked.get("v.label");		
        console.log("About to fire view email events with emailId/action " + emailId + "/" + action);
        helper.fireLoadEmailDetailEvent(emailId);
        helper.fireCaseEmailEditEvent(action,emailId);
        helper.fireCaseEmailDetailEvent(emailId);
    }, 
})