({
    // handles a email load request event. Fire cmh18_EmailLoadedEvent when done.
	cmh18_LoadEmailEvent : function(component, event, helper) {
        var emailId = event.getParam("emailId");
        console.log("In email loader event handler id: ", emailId);
        var action = component.get("c.getEmail");
		action.setParams({"id": emailId});
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("In email loaded callback id/status: " + emailId + "/" + status);
            var emailData = {"emailId": emailId, "data": undefined};
            if (state === "SUCCESS") {                
            	var theEmail = response.getReturnValue();
                emailData.data = {};
                var ed = emailData.data;
				ed.id = theEmail.Id;
				ed.to = theEmail.ToAddress;
				ed.cc = theEmail.CcAddress;
				ed.from = theEmail.FromName;
				ed.fromAddress = theEmail.FromAddress;
				ed.date = theEmail.MessageDate;
				ed.hasAttachment = theEmail.HasAttachment;
				ed.status = theEmail.Status;
				ed.subject = theEmail.Subject;
				ed.html = theEmail.HtmlBody;
                var text = theEmail.TextBody ? theEmail.TextBody.replace(/\n/g,"<br/>") : "";
				ed.text = text;
            } else if (state === "ERROR") {
                emailData.error = "Error: ";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    emailData.error += errors[0].message;
                }
            }
            var loadedEvent = $A.get("e.c:cmh18_EmailLoadedEvent");
            loadedEvent.setParams({"emailData": emailData});
            loadedEvent.fire();
        });
        $A.enqueueAction(action);	        
	}
})