({
	cmh18evt_EmailEdit : function(component, event, helper) {
        var requestedAction = event.getParam("action");
        var emailId = event.getParam("emailId");
        component.set("v.requestedAction", requestedAction);
        if ("view" === requestedAction) {
        component.set("v.isOpen", false);
        } else {
        component.set("v.emailId", emailId);
        console.log("open panel event requestedAction: " + requestedAction + " refId: "+ emailId);		
        component.set("v.isOpen", true);
        }
	},
    // Handle the event an email record has been retrieved
    cmh18_EmailLoadedEvent : function(component, event, helper) {
        var emailData = event.getParam("emailData");
		var requestedAction = component.get("v.requestedAction");
        var globals = component.get("v.globals");
        var orgInfo = globals.orgInfo;
        var userInfo = globals.userInfo;      
        var fromAddress = orgInfo ? orgInfo.Address : userInfo.Email;
        var from = orgInfo ? orgInfo.DisplayName : userInfo.Name;
        console.log("Org wide email " + from + "  " + fromAddress);
        console.log("In edit email panel cmh18_EmailLoadedEvent ", emailData);
        helper.initForm(component);
        if (emailData.error) {
            component.set("v.error", msg);
        } else {
            var theEmail = emailData.data;
            var helperData = {originalSubject: theEmail.subject};

            component.set("v.originalEmail", theEmail);
            component.set("v.id", theEmail.id);
            // TODO need configuration to inject standard reply from address
            component.set("v.fromAdress", "cc@example.com");
            if(requestedAction.includes("reply")) {
                component.set("v.to", theEmail.fromAddress);
                helperData.re = "Re:";
            }
            if ("replyAll" === requestedAction) {
                component.set("v.cc", theEmail.cc);                
            }
            if ("forward" === requestedAction) {
                helperData.re = "Fwd:";
                helperData.body = theEmail.text;
                if(theEmail.html && theEmail.html.length > 0){
                    helperData.body = theEmail.html;
                }
            }
            component.set("v.helperData", helperData);
			helper.updateContent(component);
            component.set("v.isLoaded", true);
            component.set("v.modified", false);
        }     
    },
   
    /**  
     * User selects template from the template picker which fires an event that is handled
     * and that causes a request to the server to render the template. This handler takes 
     * the rendered results and applies them to the email loaded into the form.
     * 
     * TODO add spinner to this area once the template picker has been opened. Close when 
     * the rendered text is ready.
     */
    cmh18_TemplateRenderedEvent: function(component, event, helper) {
        // cmh18_TemplateRenderedEvent sends renderedSubject, renderedText and optionally renderedHtml
        var renderedSubject = event.getParam("renderedSubject");
        var renderedText = event.getParam("renderedText");
        var renderedHtml = event.getParam("renderedHtml");        
        renderedText = renderedText.replace(/\n/g,'<br/>');        
        var body = renderedHtml ? renderedHtml : renderedText;
        console.log("Template has been rendered and will now insert subject: ", renderedSubject, " t: ", renderedText);
        var helperData = component.get("v.helperData");
        helperData.isHtml = renderedHtml ? true : false;
        helperData.renderedSubject = renderedSubject;
        helperData.renderedBody = body;
        component.set("v.helperData", helperData);
        helper.updateContent(component);        
    },    
    cancelEdit:function(component, event, helper) {
        var close = true;
        if( component.get("v.modified")) {
          close = confirm("Are you sure you want lose your edits to this email?")
        }
        if (close) {
            helper.initForm(component);
            component.set("v.isOpen", false);       
        }
    },
    contentChanged : function(component,event, helper){
        component.set("v.modified", true);        
    },
    sendEmail:function(component, event, helper) {
        var emailData = {};
        emailData.toList = [component.get("v.to")];
        emailData.subject = component.get("v.subject");
        var html = component.get("v.body");
        var text = html.replace(/(<\/p>)/g, "\n"); 
        text = text.replace(/(<([^>]+)>)/g, "");           
        emailData.htmlBody = html;
        emailData.plainTextBody = text;
        emailData.ccList = null;
        emailData.fromAddressOptional = null;
        emailData.fromNameOptional = null;
        emailData.caseId = "500f4000006AZsRAAW";
        console.log("Sending email for case ", emailData.caseId);
        var cmh18evt_EmailSend = $A.get("e.c:cmh18evt_EmailSend");
        cmh18evt_EmailSend.setParams({emailData: emailData });
        cmh18evt_EmailSend.fire();            
    },
    // local example of how to handle the email has been sent event ...
    cmh18evt_EmailSent : function(component, event, helper) {
        var results = event.getParam("results");
        if(results.errorMessage) {
            alert(results.errorMessage);
        }
        component.set("v.results", results.errorMessage ? results.errorMessage : results.successMessage);
        console.log("Email sent event ", results.errorMessage, " ", results.successMessage);
    },


})