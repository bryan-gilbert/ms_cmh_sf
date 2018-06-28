({
	doInit : function(component, event, helper) {
		helper.loadGlobalData(component,helper);
	}, 	
    openUserInfo : function(component, event, helper) {
        component.set("v.showInfo", true);
    },
    closeUserInfo : function(component, event, helper) {
        component.set("v.showInfo", false);
    }

})