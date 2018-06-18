({
    doInit : function(component, event, helper) {
        var action = component.get("c.getRef");		
        action.setParams({'caseId' : component.get("v.caseId")});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theResponse = response.getReturnValue();
                component.set('v.caseRef', theResponse);
            }
        });
        $A.enqueueAction(action);        
    },
	sendEmail : function(component, event, helper) {
        var action = component.get("c.sendEmailMessage");		
        //String[] toList, String[] ccList, String fromAddressOptional, String fromNameOptional,
        //String caseId, String ref, String subject, String plainTextBody, String htmlBody)
        var params = {};
        params.toList = component.get("v.toList");
        params.ccList = null;
        params.fromAddressOptional = null;
        params.fromNameOptional = null;
        params.caseId = component.get("v.caseId");
        params.ref = component.get("v.caseRef");
        params.subject = component.get("v.subject");
        params.plainTextBody = component.get("v.plainText");
        params.htmlBody = component.get("v.htmlBody");
		action.setParams(params);
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theResponse = response.getReturnValue();
                if (theResponse.includes('ERROR')) {
                    component.set('v.errorMessage', theResponse);
                } else {
                    component.set('v.resultMessage', theResponse);                    
                }
            	console.log("Send email response '", theResponse, "'");
            }
            else if (state === "INCOMPLETE") {
                console.error("Call to server to send email comes back incomplete. What happened?")
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
	}
})