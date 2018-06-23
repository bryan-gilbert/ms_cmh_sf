({
    /*
     * Events
     * 1. The edit event arrives with open/close for direction.  
     * If close then hide the edit panel. Close happens when a user views an email. It also happens
     * when this panel emits the close (cancel or send success).
     * 
     * If open then replay, reply all, forward or new.
     * 
     * 2. Attachment List event arrives with list of attachments to be sent with this email (isChecked)
     * 
     * 3. Email is loaded event. Fill the form.
     * 
     * 4. When attachment list is ready to indicate which attachments are to be sent with this email. 
     * This event can happen several time.
     * 
     * 5. Template rendered event happens if a user selects a template and it is rendered by the server.
     * 
     * 6. Emit email send event if user sends email.
     * Or emit email edit event with close if user cancels.
     * 
     * 7. Receive email sent event. If error display it. Otherwise ...
     * 
     * 8. Emit edit event with close. (See 1 above)
     */
    
    cmh18evt_GlobalDataChange : function(component,event,helper) {
        var globals = event.getParam("globals");
        component.set("v.globals", globals);
    },
    
	cmh18evt_EmailEdit : function(component, event, helper) {
        var direction = event.getParam("direction");
        console.log("TODO implement action new");
        console.log("TODO implement spinner to be active until email load event")
        if ("open" === direction) {
            var requestedAction = event.getParam("action");
            var emailId = event.getParam("emailId");
	        console.log("open email edit form : " + requestedAction + " refId: "+ emailId);		
	        component.set("v.isOpen", true);
	        component.set("v.emailId", emailId);
            component.set("v.requestedAction", requestedAction);
        } else {
            // about to hide the form but just to be clean erase form content.
            helper.initForm(component);
        	component.set("v.isOpen", false);
        }
	},
    // Handle the event an email record has been retrieved
    cmh18_EmailLoadedEvent : function(component, event, helper) {
        if(!component.get("v.isOpen")) {
            return; // do nothing
        }
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
            console.error("Error in edit panel cmh18_EmailLoadedEvent ", emailData.error);
            component.set("v.error", emailData.error);
        } else {
            var theEmail = emailData.data;
            var helperData = {originalSubject: theEmail.subject};
            component.set("v.originalEmail", theEmail);
            component.set("v.id", theEmail.id);
            component.set("v.fromAdress", "cc@example.com");
            if ("replyAll" === requestedAction) {
                component.set("v.cc", theEmail.cc);                
            }            
            var preData = [];
            preData.push('<p>&nbsp;</p>\n');            
            preData.push('<p>&nbsp;</p>\n');            
            if(requestedAction.includes("reply")) {
                component.set("v.to", theEmail.fromAddress);
                helperData.re = "Re:";
                preData.push('<p>--------------- Original Message ---------------</p>\n');
            }
            if ("forward" === requestedAction) {
                helperData.re = "Fwd:";
                preData.push('<p>---------- Forwarded message ---------</p>\n');
            }
            preData.push('<p>From: '+theEmail.fromAddress+'</p>\n');
            preData.push('<p>Sent: '+theEmail.date+'</p>\n');
            preData.push('<p>To: '+theEmail.to+'</p>\n');
            preData.push('<p>Cc: '+theEmail.cc+'</p>\n');
            preData.push('<p>Subject: '+theEmail.subject+'</p>\n');
            preData.push('<p></p>\n');
            helperData.preBody = preData.join('\n');                
            
            if(theEmail.html && theEmail.html.length > 0){
                helperData.body = theEmail.html;
            } else {
	            helperData.body = theEmail.text;
                
            }
            
            component.set("v.helperData", helperData);
			helper.updateContent(component);
            component.set("v.isLoaded", true);
            component.set("v.modified", false);
            
component.find("iBody").focus();            
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
            helper.sendCloseEvent(component,helper);
            helper.sendRefreshEvent(component,helper);
        }
    },
    contentChanged : function(component,event, helper){
        component.set("v.modified", true);        
    },
    sendEmail:function(component, event, helper) {
        var emailData = {};
        emailData.toList = [component.get("v.to")];
        console.log("TODO handle list of to addresses");
        emailData.subject = component.get("v.subject");
        var html = component.get("v.body");
        var text = html.replace(/(<\/p>)/g, "\n"); 
        text = text.replace(/(<([^>]+)>)/g, "");           
        emailData.htmlBody = html;
        emailData.plainTextBody = text;
        emailData.ccList = null;
        emailData.fromAddressOptional = null;
        emailData.fromNameOptional = null;
        var globals = component.get("v.globals");        
        emailData.caseId = globals.caseId;
        console.log("Sending email for case ", emailData.caseId);
        var includedAttachments = component.get("v.includedAttachments"); 
        emailData.attachmentIdList=[];
        for(var i = 0; i< includedAttachments.length; i++ ){
            var a = includedAttachments[i];
            var id = a.Id;
            emailData.attachmentIdList.push(id);
        }
        var cmh18evt_EmailSend = $A.get("e.c:cmh18evt_EmailSend");
        cmh18evt_EmailSend.setParams({emailData: emailData });
        cmh18evt_EmailSend.fire();            
    },
    // local example of how to handle the email has been sent event ...
    cmh18evt_EmailSent : function(component, event, helper) {
        var results = event.getParam("results");
        if(results.errorMessage) {
            alert(results.errorMessage);
            component.set("v.results", results.errorMessage);
            return;
        }
        console.log("Email sent event ", results.successMessage);
        helper.sendCloseEvent(component,helper);
        helper.sendRefreshEvent(component,helper);
    },
    cmh18evt_AttachmentList : function(component,event,helper) {
        var attachments = event.getParam("attachments");
        var includedAttachments = [];
        console.log("cmh18evt_AttachmentList in edit panel", attachments);
        if(!attachments) {
            console.error("cmh18evt_AttachmentList in edit panel and could not get attachmentlist from event");
            return;
        }
        attachments.forEach(function(a) {
            if(a.isChecked) {
                console.log("atachment ", a.Id);
                includedAttachments.push(a);
            }
        })
        component.set("v.includedAttachments",includedAttachments);        
    }
})