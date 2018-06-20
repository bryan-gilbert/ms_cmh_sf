({
    doInit : function(component, event, helper) {
        var email = component.get("v.email");
        var status = helper.convertStatus(email.Status);
        email.Status = status;
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
    viewEmail : function(component, event, helper) {
        var target = event.target;
        var emailId = target.getAttribute("id");
        helper.fireLoadEmailDetailEvent(emailId);
        helper.fireCaseEmailEditEvent("view",emailId);
        helper.fireCaseEmailDetailEvent(emailId);
    }, 
})