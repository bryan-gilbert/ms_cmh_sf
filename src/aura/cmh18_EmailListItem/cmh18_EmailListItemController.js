({
    doInit : function(component, event, helper) {
        var email = component.get("v.email");
        var status = helper.convertStatus(email.Status);
        email.Status = status;
        component.set("v.email", email);
	}, 
    generateEvent : function(component, event, helper) {
		var btnClicked = event.getSource();
		var emailId = btnClicked.get("v.value");
		var action = btnClicked.get("v.label");		
        console.log("About to fire view email events with emailId/action " + emailId + "/" + action);
        helper.fireLoadEmailDetailEvent(emailId);
        helper.fireCaseEmailEditEvent('open',action,emailId);
        helper.fireCaseEmailDetailEvent(emailId);
    },
    viewEmail : function(component, event, helper) {
        var ctarget = event.currentTarget;
        var emailId = ctarget.dataset.value;
        console.log("In email list item view email click handlers with id ", emailId);
        helper.fireLoadEmailDetailEvent(emailId);
        helper.fireCaseEmailEditEvent("close",null,emailId);
        helper.fireCaseEmailDetailEvent(emailId);
    }, 
})