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
        var orgInfo = globals.orgInfo;
        var userInfo = globals.userInfo; 
        var fromList = [];
        if(orgInfo && orgInfo.Address)
            fromList.push(orgInfo.Address);
        if(userInfo && userInfo.Email)
            fromList.push(userInfo.Email);
        component.set("v.fromList", fromList);
    },
    
	cmh18evt_EmailEdit : function(component, event, helper) {
        var direction = event.getParam("direction");
        console.log("TODO implement action new");
        console.log("TODO implement spinner to be active until email load event")
        if ("open" === direction) {
            var requestedAction = event.getParam("action");
	        component.set("v.isOpen", true);
            component.set("v.requestedAction", requestedAction);
            if(requestedAction === 'new') {
		        console.log("open new email edit form ");
		       helper.setupContent(component,helper,null); 		
            } else {
	            var emailId = event.getParam("emailId");
		        console.log("open email edit form : " + requestedAction + " refId: "+ emailId);		
		        component.set("v.emailId", emailId);
            }
        } else {
            // about to hide the form but just to be clean erase form content.
            helper.initForm(component);
        	component.set("v.isOpen", false);
        }
	},
    // Handle the event an email record has been retrieved
    cmh18evt_EmailLoaded : function(component, event, helper) {
        if(!component.get("v.isOpen")) {
            return; // do nothing
        }
        var emailData = event.getParam("emailData");
        if (emailData.error) {
            console.error("Error in edit panel cmh18evt_EmailLoaded ", emailData.error);
            component.set("v.error", emailData.error);
            return;
        }
        var theEmail = emailData.data;
        console.log("Edit email ... setup content ...");
        helper.setupContent(component,helper,theEmail);         
    },
   
    /**  
     * User selects template from the template picker which fires an event that is handled
     * and that causes a request to the server to render the template. This handler takes 
     * the rendered results and applies them to the email loaded into the form.
     * 
     * TODO add spinner to this area once the template picker has been opened. Close when 
     * the rendered text is ready.
     */
    cmh18evt_TemplateRendered: function(component, event, helper) {
        // cmh18evt_TemplateRendered sends renderedSubject, renderedText and optionally renderedHtml
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
    bevt_AutocompleteList : function(component,event,helper) {
        var autoCompleteId = event.getParam("autoCompleteId");
        var list = event.getParam("list");
        if("toFieldId" === autoCompleteId) {
            component.set("v.toList",list);            
        }
        if("ccFieldId" === autoCompleteId) {
            component.set("v.ccList",list);            
        }
        if("bccFieldId" === autoCompleteId) {
            component.set("v.bccList",list);            
        }

    },   
    sendEmail:function(component, event, helper) {
        var emailData = {};
        emailData.toList = component.get("v.toList");
        emailData.ccList = component.get("v.ccList");
        emailData.bccList = component.get("v.bccList");
        console.log("To/cc/bcc",emailData.toList, " -- ", emailData.ccList," -- ", emailData.bccList);
        emailData.subject = component.get("v.subject");
        if(emailData.toList.length === 0 && emailData.ccList.length === 0 ){
            alert("Must provide at least one TO or one CC address");
            return;
        }
        if(!helper.validateEmailAddressList(emailData.toList,"To List")){
            console.log("User says to not send email")
            return;
        }
        if(!helper.validateEmailAddressList(emailData.ccList,"Cc List")){
            console.log("User says to not send email")
            return;
        }
        if(!helper.validateEmailAddressList(emailData.bccList,"Bcc List")){
            console.log("User says to not send email")
            return;
        }
        var html = component.get("v.body");
        var text = html.replace(/(<\/p>)/g, "\n"); 
        text = text.replace(/(<([^>]+)>)/g, "");           
        emailData.htmlBody = html;
        emailData.plainTextBody = text;
        emailData.fromAddressOptional = null;
        emailData.fromNameOptional = null;
        var globals = component.get("v.globals");        
        emailData.caseId = globals.caseId;
        console.log("Sending email for case ", emailData.caseId);
        var includedAttachments = component.get("v.includedAttachments"); 
        emailData.attachmentIdList=[];
        emailData.documentIdList=[];
        for(var i = 0; i< includedAttachments.length; i++ ){
            var a = includedAttachments[i];
            var id = a.id;
            if(a.isAttachment) {
                emailData.attachmentIdList.push(id);
                console.log("EditEmailPanel send Attachment id ", id);
            } else {
                emailData.documentIdList.push(id);  
                console.log("EditEmailPanel send CDL id ", id);
            }
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
                console.log("edit include ", a);
                includedAttachments.push(a);
            }
        })
        component.set("v.includedAttachments",includedAttachments);        
    },
    openTemplatePicker : function(component,event,helper){
        var proceed = true;
        if( component.get("v.modified")) {
            proceed = confirm("Are you sure you want select a new template and lose your edits to this email?")
        }
        if (proceed) {
            component.find("templatePicker").openDialog();       
        }
    },
})