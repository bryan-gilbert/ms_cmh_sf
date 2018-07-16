({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_EmailDetail ", component.get("v.myCaseId"));    
    },   
    // Handle request to open email viewer.  Fire the event to load an email record
	cmh18evt_EmailView : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        component.set("v.isLoaded", false);
        console.log("In CMH 18 Email Detail event handler");
        var emailId = event.getParam("emailId");        
        // var caseCommentId = event.getParam("caseCommentId");
        // no need here for case comment id. if email id is undefined or define it will be fine
        component.set('v.emailId', emailId);
	},
    // Handle the event an email record has been retrieved
    cmh18evt_EmailLoaded : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var emailData = event.getParam("emailData");
        console.log("In email viewer cmh18evt_EmailLoaded ", emailData);
        if (emailData.error) {
            component.set("v.error", emailData.error);
        } else {
            var theEmail = emailData.data;
            component.set("v.id", theEmail.id);
            component.set("v.to", theEmail.to);
            component.set("v.cc", theEmail.cc);
            component.set("v.from", theEmail.from);
            component.set("v.fromAdress", theEmail.fromAddress);
            component.set("v.date", theEmail.date);
            component.set("v.hasAttachments", theEmail.hasAttachment);
            component.set("v.status", theEmail.status);
            component.set("v.subject", theEmail.subject);
            if(theEmail.html && theEmail.html.length > 0){
                component.set("v.body", theEmail.html);
            }
            else {
                component.set("v.body", theEmail.text);
            }
            component.set("v.isLoaded", true);
        }     
    },
    cmh18evt_AttachmentList : function(component,event,helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var attachments = event.getParam("attachments");
        var includedAttachments = [];
        console.log("In email detail attachment list handler")
        if(!attachments) {
            return;
        }
        attachments.forEach(function(a) {
            // the edit panel filters isChecked. Here we filter isSelected.
            if(a.isSelected) {
                console.log("Include a ", a);
                includedAttachments.push(a);
            }
        })
        component.set("v.includedAttachments",includedAttachments);        
    },
})