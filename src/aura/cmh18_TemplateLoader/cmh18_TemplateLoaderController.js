({
     /**  
     * Handle cmh18_PickTemplateEvent
     * get the rendered email template subject, text and optional html body.
     * fire cmh18_TemplateRenderedEvent when these are ready.
     */
    cmh18_PickTemplateEvent: function(component, event) {
        var templateId = event.getParam("templateId");
        var globals = component.get("v.globals");
        var whoId = globals.userId;
        var whatId = globals.caseId;
        console.log("In template loader cmh18_PickTemplateEvent " + templateId + " user: " + whoId + " case: " + whatId);
        // public class cmh18_EmailTemplatesController  ...
        //  public static List<String> getTemplate(Id templateId, Id whoId, Id whatId)
        //  returns one or two strings. if present the second is the html body
        var action = component.get("c.getTemplate");
		action.setParams({"templateId": templateId, "whoId": whoId, "whatId": whatId});
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("In rendered template callback id/status: " + templateId + "/" + status);
            if (state === "SUCCESS") {                
            	var list = response.getReturnValue();
                if (list && list.length > 0) {
                    console.log("In callback with response to get rendered template", list);
                    var renderedHtml = list.length > 2 ? list[2] : /* html is optional */ undefined;
                    var renderedText = list.length > 1 ? list[1] : "empty text body";
                    var renderedSubject = list.length > 0 ? list[0] : "empty subject";
                    var cmh18_TemplateRenderedEvent = $A.get("e.c:cmh18_TemplateRenderedEvent");
                    cmh18_TemplateRenderedEvent.setParams({"renderedHtml": renderedHtml});
                    cmh18_TemplateRenderedEvent.setParams({"renderedText": renderedText});
                    cmh18_TemplateRenderedEvent.setParams({"renderedSubject": renderedSubject});
                    cmh18_TemplateRenderedEvent.fire();
                } else {
                    console.error("Error. No rendered data received.")
                    console.error("Template Id: " + templateId + " User id: " + whoId + " Case id: " + whatId);                    
                }
            } else if (state === "ERROR") {
                // https://developer.salesforce.com/blogs/2017/09/error-handling-best-practices-lightning-apex.html
                let errors = response.getError();
                let message = 'Unknown error'; // Default error message
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error(message);                
                console.error("Template Id: " + templateId + " User id: " + whoId + " Case id: " + whatId);                    
            }
        });
        $A.enqueueAction(action);	        
	}
})