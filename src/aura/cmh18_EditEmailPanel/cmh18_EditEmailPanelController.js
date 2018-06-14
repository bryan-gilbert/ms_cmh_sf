({
	openEditEmailPanelFromEvent : function(component, event, helper) {
        var action = event.getParam("action");
        var emailId = event.getParam("emailId");
        component.set("v.action", action);
        if ("view" === action) {
        component.set("v.isOpen", false);
        } else {
        component.set("v.emailId", emailId);
        console.log("open panel event action: " + action + " refId: "+ emailId);		
        component.set("v.isOpen", true);
        }
	},
    // Handle the event an email record has been retrieved
    cmh18_EmailLoadedEvent : function(component, event, helper) {
        var emailData = event.getParam("emailData");
		var action = component.get("v.action");
        var globals = component.get("v.globals");
        var orgInfo = globals.orgInfo;
        var userInfo = globals.userInfo;      
        var fromAddress = orgInfo ? orgInfo.Address : userInfo.Email;
        var from = orgInfo ? orgInfo.DisplayName : userInfo.Name;
        console.log("Org wide email " + from + "  " + fromAddress);
        console.log("In edit email panel cmh18_EmailLoadedEvent ", emailData);
        component.set("v.to", from);
        component.set("v.from", fromAddress);
        component.set("v.fromAdress", fromAddress);
        component.set("v.subject", "");
        component.set("v.cc", "");
        component.set("v.body", "");
        if (emailData.error) {
            component.set("v.error", msg);
        } else {
            var theEmail = emailData.data;
            component.set("v.id", theEmail.id);
            // TODO need configuration to inject standard reply from address
            component.set("v.fromAdress", "cc@example.com");
            if(action.includes("reply")) {
                component.set("v.to", theEmail.fromAddress);
            }
            if ("replyAll" === action) {
                component.set("v.cc", theEmail.cc);                
            }
            if (action.includes("reply") || "forward" === action) {
                component.set("v.subject", theEmail.subject);
                if(theEmail.html && theEmail.html.length > 0){
                    component.set("v.body", theEmail.html);
                }
                else {
                    component.set("v.body", theEmail.text);
                }                
            }
            component.set("v.isLoaded", true);
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
    cmh18_TemplateRenderedEvent: function(component, event) {
        // cmh18_TemplateRenderedEvent sends renderedSubject, renderedText and optionally renderedHtml
        var renderedSubject = event.getParam("renderedSubject");
        var renderedText = event.getParam("renderedText");
        var renderedHtml = event.getParam("renderedHtml");
        renderedText = renderedText.replace(/\n/g,'<br/>');
        var body = renderedHtml ? renderedHtml : renderedText;
        component.set("v.subject", renderedSubject);
        component.set("v.body", body);
    }

})