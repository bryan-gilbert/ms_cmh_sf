({
	setInfo : function(component,event,helper) {
		var params = event.getParam('arguments');
		if (params) {
		    component.set("v.userInfo", params.userInfo);
		    component.set("v.orgInfo", params.orgInfo);
		}
	},
    saveUserData: function(component,event,helper) {
        var userData = component.get("v.userData");
        console.log("Save user data",userData);
        var action = component.get("c.updateUserData");
		action.setParams({"theData": userData});
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("Saved user data", state);
            if (state === "SUCCESS") {                
            	var theUser = response.getReturnValue();
                component.set("v.userInfo", theUser);
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
        
    }
})