({
	loadEmailDetails : function(component, event, helper) {
	console.log("In BetaEmailDetail event handler");
        var emailId = event.getParam("emailId");

        helper.helperMethod(emailId);
		
	}
})