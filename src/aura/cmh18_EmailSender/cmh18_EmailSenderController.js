({
	cmh18evt_EmailSend : function(component, event, helper) {
        var action = component.get("c.sendEmailMessage");	
        var params = event.getParams("emailData");
        var eventData = params.emailData;
		action.setParams(eventData);
		// if there is no plain text body and there is an html body then create a plain text body from html
        if(!eventData.plainTextBody && eventData.htmlBody) {
            var text = eventData.htmlBody;
            // replace all closing paragraph tags with a line feed
            text = text.replace(/(<\/p>)/g, "\n");
            // replace all closing div tags with a line feed
            text = text.replace(/(<\/div>)/g, "\n");
            // remove all remaining html tags
            text = text.replace(/(<([^>]+)>)/g, "");
            console.log(text);
            eventData.plainTextBody = text;
        }
        console.log("Send email ... ", eventData.caseId, eventData.subject);
        action.setCallback(this, function(response){
            var state = response.getState();
            var results = {};
            if (state === "SUCCESS") {
            	var theResponse = response.getReturnValue();
                if (theResponse.includes('ERROR')) {
                    results.errorMessage = theResponse;
                } else {
                    results.successMessage = theResponse;
                }
            }
            else if (state === "INCOMPLETE") {
                results.errorMessage = "Call to server to send email comes back incomplete. What happened?";
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                    results.errorMessage ="Error message: " + errors[0].message;
                    }
                } else {
                    results.errorMessage ="Unknown error";
                }
            }
            console.log("Emit email has been sent event ", params);
            var cmh18evt_EmailSent = $A.get("e.c:cmh18evt_EmailSent");
            cmh18evt_EmailSent.setParams({results: results});
            cmh18evt_EmailSent.fire();            
        });
        $A.enqueueAction(action);
	},
    // local example of how to handle the email has been sent event ...
    cmh18evt_EmailSent : function(component, event, handler) {
        var results = event.getParam("results");
        component.set("v.results", results);
        console.log("Handle email sent event error: ", results.errorMessage, " success: ", results.successMessage);
    },   
    doInit : function(component, event, helper) {
    	console.log("Load cmh18_EmailSender component ", component.get("v.version"));
    },    
})