({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
    	console.log("Init cmh18_EmailListItem ", component.get("v.myCaseId"));
        var email = component.get("v.email");
        var status = helper.convertStatus(email.Status);
        component.set("v.status", status);
	}, 
    generateEvent : function(component, event, helper) {
		var btnClicked = event.getSource();
		var emailId = btnClicked.get("v.value");
		var action = btnClicked.get("v.label");		
        console.log("About to fire view email events with emailId/action " + emailId + "/" + action);
        helper.fireLoadEmailDetailEvent(component,emailId);
        helper.fireCaseEmailEditEvent(component,'open',action,emailId);
        helper.fireCaseEmailDetailEvent(component,emailId);
    },
    viewEmail : function(component, event, helper) {
        var ctarget = event.currentTarget;
        var emailId = ctarget.dataset.value;
        console.log("In email list item view email click handlers with id ", emailId);
        helper.fireLoadEmailDetailEvent(component,emailId);
        helper.fireCaseEmailEditEvent(component,"close",null,emailId);
        helper.fireCaseEmailDetailEvent(component,emailId);
    }, 
})