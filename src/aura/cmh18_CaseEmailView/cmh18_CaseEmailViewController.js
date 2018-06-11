({
	doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        component.set("v.message", "The rId is" + recordId);
        var action = component.get("c.getList");
		action.setParams({"caseId": recordId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	console.log("Get emails ", theList);
				component.set("v.emails", theList);
				component.set("v.count", theList.length);                
            }
        });
        $A.enqueueAction(action);		
	}, 
	fireCaseEmailDetailEvent : function(component, event, helper) {
		var btnClicked = event.getSource();
		var emailId = btnClicked.get("v.value");		
		console.log("fileCaseEmailDetailEvent emailId", emailId);
        var myEvent = $A.get("e.c:cmh18_CaseEmailDetailEvent");
		console.log("fileCaseEmailDetailEvent myEvent", myEvent);
        myEvent.setParams({"emailId": emailId});
        myEvent.fire();
    },
    /**  
     * get the template id once the template picker fires it's done event
     */
    getTemplateIdFromEvent: function(component, event) {
        var templateId = event.getParam("templateId");
        component.set("v.templateId", templateId);
    }
})