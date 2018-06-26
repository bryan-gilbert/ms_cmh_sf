({
	updateGlobals : function(component,helper) {
        console.log("UserInfo -- fire_GlobalDataChange");
        var globals = component.get("v.globals");
        globals.userInfo = component.get("v.userInfo");
        globals.orgInfo = component.get("v.orgInfo");
        component.set("v.globals", globals);
        var cmh18evt_GlobalDataChange = $A.get("e.c:cmh18evt_GlobalDataChange");
        cmh18evt_GlobalDataChange.setParam("globals", globals);
        cmh18evt_GlobalDataChange.fire();        
	}
})