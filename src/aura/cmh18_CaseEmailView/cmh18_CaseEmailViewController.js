({
	doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        component.set("v.message", "The rId is" + recordId);
        var action = component.get("c.getList");
		action.setParams({"caseId": recordId});
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
	generateCaseEmailDetailEvent : function(component, event, helper) {
		var btnClicked = event.getSource();
		var emailId = btnClicked.get("v.value");
        helper.fireCaseEmailEditEvent("Close");
        helper.fireCaseEmailDetailEvent(emailId);
    },
	generateCaseEmailEditEvent : function(component, event, helper) {
		var btnClicked = event.getSource();
		var emailId = btnClicked.get("v.value");		
		var action = btnClicked.get("v.label");		
        helper.fireCaseEmailDetailEvent(emailId);
        helper.fireCaseEmailEditEvent(action, emailId);
    },
    
})