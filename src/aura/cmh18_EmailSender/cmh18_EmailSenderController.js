({
    doInit : function(component, event, helper) {
        var params = {};
        params.toList = ['bgil2002@shaw.ca', 'test1@memsharp.com'];
        params.ccList = null;
        params.fromAddressOptional = null;
        params.fromNameOptional = null;
        params.caseId = "500f4000006AZsRAAW";
        params.subject = "Sent from testing";
        params.plainTextBody = "Plain body will get case ref automatically";
        params.htmlBody = "<p>Html body will also get ref automatically</p>";
        params.attachmentIdList = ['00Pf40000047VGZEA2'];  
		component.set("v.emailData", params);
        console.log("ed", params)
    },
    
	cmh18evt_EmailSend : function(component, event, helper) {
        var action = component.get("c.sendEmailMessage");	
        var params = event.getParams("emailData");
        console.log("params", params);
        console.log("p e", params.emailData);
        var eventData = params.emailData;
        /*
        var emailData = {};
       emailData.toList = eventData.toList;
emailData.ccList = eventData.ccList;
emailData.fromAddressOptional = eventData.fromAddressOptional;
emailData.fromNameOptional = eventData.fromNameOptional;
emailData.caseId = eventData.caseId;
emailData.subject = eventData.subject;
emailData.plainTextBody = eventData.plainTextBody;
emailData.htmlBody = eventData.htmlBody;
emailData.attachmentIdList = eventData.attachmentIdList;
 */
		action.setParams(eventData);
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
            console.log("Emit email sent event ", params);
            var cmh18evt_EmailSent = $A.get("e.c:cmh18evt_EmailSent");
            cmh18evt_EmailSent.setParams({results: results});
            cmh18evt_EmailSent.fire();            
        });
        $A.enqueueAction(action);
	},
    cmh18evt_EmailSent : function(component, event, handler) {
        var results = event.getParam("results");
        component.set("v.results", results);
        console.log("Handkle email sent event ", results);
    },
    /*
*/
    sendEmail:function(component, event, handler) {
        var emailData = component.get("v.emailData");
        console.log("Emit email send event caseId: ", emailData.caseId);        
        console.log("Emit email send event subject: ", emailData.subject);
        var cmh18evt_EmailSent = $A.get("e.c:cmh18evt_EmailSend");
        cmh18evt_EmailSent.setParams({emailData: emailData });
        cmh18evt_EmailSent.fire();            
    }
})