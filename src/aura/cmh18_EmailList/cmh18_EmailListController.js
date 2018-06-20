({
	doInit : function(component, event, helper) {
        helper.loadList(component,event,helper);
	},
    refresh : function(component, event, helper) {
        helper.loadList(component,event,helper);
	}, 	
    cmh18evt_EmailView : function(component, event, helper) {
        var emailId = event.getParam("emailId");
        component.set("v.selectedEmail", emailId);
        //console.log("Set selectedEmail", emailId);
        helper.emailSelected(component,event,helper);
	}, 	

 
})