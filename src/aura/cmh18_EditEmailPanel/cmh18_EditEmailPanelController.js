({
	openEditEmailPanelFromEvent : function(component, event, helper) {
        var action = event.getParam("action");
        var emailId = event.getParam("emailId");
        if ("Close" === action) {
        component.set("v.isOpen", false);
        } else {
        component.set("v.emailId", emailId);
        component.set("v.action", action);
        console.log("open panel event action: " + action + " refId: "+ emailId);		
        component.set("v.isOpen", true);
        }
	},
    blurBody : function () {
        console.log("In blur body");
    },
        blurTo : function (component, event, handler) {
        console.log("In blur to");
            

      var bodyText = component.find("iBody").get("v.value");

console.log('body ', bodyText);

    },

        /**  
     * get the template id once the template picker fires it's done event
     */
    getTemplateIdFromEvent: function(component, event) {
        var templateId = event.getParam("templateId");
        component.set("v.templateId", templateId);
    }

})