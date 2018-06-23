({
    cmh18evt_GlobalDataChange : function(component, event, helper) {
        var globals = event.getParam("globals");
        component.set('v.globals', globals);
        component.set('v.caseId', globals.caseId);
        helper.loadLists(component, helper);
    },
    cmh18evt_RefreshFromServer : function(component,event,helper) {
	  helper.loadLists(component,helper);       
    }
})