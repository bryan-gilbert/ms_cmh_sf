({
	doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        var globals = {'userId': userId, 'caseId' : recordId};
        component.set("v.globals", globals);
	}, 	
    openUserInfo : function(component, event, helper) {
        component.set("v.showInfo", true);
    },
    closeUserInfo : function(component, event, helper) {
        component.set("v.showInfo", false);
    }

})