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
        console.log("In edit email panel cmh18_EmailLoadedEvent ", emailData);
        component.set("v.to", "");
        component.set("v.from", "");
        component.set("v.fromAdress", "");
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
    
    bodyChanged : function (component) {
        console.log("In bodyChanged");
        //var bodyText = component.find("iBody").get("v.value");
        //console.log('body ', bodyText);        
    },
    blurTo : function (component, event, handler) {
        console.log("In blur to");
    },
    /**  
     * get the template id once the template picker fires it's done event
     */
    getTemplateIdFromEvent: function(component, event) {
        var templateId = event.getParam("templateId");
        component.set("v.templateId", templateId);
        //var bodyText = component.set("v.body","<p>boy this might<b>be easy</b><p>");
    }

})