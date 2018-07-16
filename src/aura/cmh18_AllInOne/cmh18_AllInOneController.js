({
	doInit : function(component, event, helper) {
        // stash a copy of the incoming record ID on initialization. This is because
        // the recordIs property is bound to a property outside this component and will
        // change when the user navigates to another record.
        component.set("v.myCaseId", component.get("v.recordId"));
		helper.loadGlobalData(component,helper);
	}, 	
    openUserInfo : function(component, event, helper) {
        component.set("v.showInfo", true);
    },
    closeUserInfo : function(component, event, helper) {
        component.set("v.showInfo", false);
    },

})