({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_AttachemntsLoader ", component.get("v.myCaseId"));    
    },   
    cmh18evt_GlobalDataChange : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var globals = event.getParam("globals");
        component.set('v.globals', globals);
        helper.loadLists(component, helper);
    },
    cmh18evt_RefreshFromServer : function(component,event,helper) {
	  helper.loadLists(component,helper);       
    }
})