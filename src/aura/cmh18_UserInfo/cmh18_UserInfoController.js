({
	setInfo : function(component,event,helper) {
		var params = event.getParam('arguments');
		if (params) {
		    component.set("v.userInfo", params.userInfo);
		    component.set("v.orgInfo", params.orgInfo);
		}
	},
    cmh18evt_UserDataSave : function(component,event,helper) {
        var key = event.getParam("key");
        var value = event.getParam("value");
        console.log("update user data["+key+"] ", value);
        var globals = component.get("v.globals");
        var userInfo = globals.userInfo;
        console.log("update userInfo ", userInfo);
        var cmh18_data__c = userInfo.cmh18_data__c;
        var dataObj = cmh18_data__c && cmh18_data__c.length>0 ?  JSON.parse(cmh18_data__c) : {};
        console.log("update user data["+key+"] old/new ", dataObj[key] , value);
        dataObj[key] = value;
        cmh18_data__c = JSON.stringify(dataObj);
        var action = component.get("c.updateUserData");
		action.setParams({"theData": cmh18_data__c});
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("Saved user data", state);
            if (state === "SUCCESS") {                
            	var theUser = response.getReturnValue();
                component.set("v.userInfo", theUser);
                globals.userInfo = theUser;
                var data = globals.userInfo.cmh18_data__c;
                console.log("Data sent / saved: ", cmh18_data__c, data);
				globals.userInfo.userData = data && data.length>0 ?  JSON.parse(data) : {};
                console.log("cmh18evt_UserDataSave globals.userInfo.userData", globals.userInfo.userData);
            } else if (state === "ERROR") {                
                var error = "Unknown Error";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
					error = errors[0].message;
                }
                console.error(error);
                alert(error);
            }            
        });                
        $A.enqueueAction(action);        
    },
   saveUserData: function(component,event,helper) {
    var key = component.get("v.key");
    var value = component.get("v.value");
    var cmh18evt_UserDataSaveAction = $A.get("e.c:cmh18evt_UserDataSave");
    cmh18evt_UserDataSaveAction.setParams({"key": key, "value" : value});
    cmh18evt_UserDataSaveAction.fire();
   },
    cmh18evt_GlobalDataChange : function(component, event, helper) {
        console.log("cmh18_UserInfo cmh18evt_GlobalDataChange " + component.get("v.version"));
        var globals = event.getParam("globals");
        component.set("v.globals", globals);
        component.set("v.userInfo", globals.userInfo);
        component.set("v.orgInfo", globals.orgInfo);
    }, 
})