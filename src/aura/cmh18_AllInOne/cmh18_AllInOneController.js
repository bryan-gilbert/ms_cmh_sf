({
	doInit : function(component, event, helper) {
        //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        var uid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        var thisId = component.getGlobalId();
        console.log("INITIALIZE AllInOne with THISID " + thisId + " generated uid " + uid);        
		helper.loadGlobalData(component,helper, uid);
	}, 	
    openUserInfo : function(component, event, helper) {
        component.set("v.showInfo", true);
    },
    closeUserInfo : function(component, event, helper) {
        component.set("v.showInfo", false);
    },
    locationChange : function(component,event,helper) {
        var thisId = component.getGlobalId();
        console.log("LOCATIONCHANGE AllInOne with THISID " + thisId );        
    },

})