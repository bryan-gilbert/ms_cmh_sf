({
	loadEmailDetails : function(component, event, helper) {
	console.log("In CMH 18 Email Detail event handler");
        var emailId = event.getParam("emailId");
        component.set('v.emailId', emailId);
        helper.helperMethod(component, emailId);		
	}
})