({
	doInit : function(component, event, helper) {
        var caseId = component.get("v.recordId");
        var version = component.get("v.version");
        console.log("Init Main email tab component. CaseId " + caseId + " version " + version);
        var action = component.get("c.getCase");
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
            	var theCase = response.getReturnValue();
                var userId = $A.get("$SObjectType.CurrentUser.Id");
                var globals = {'userId': userId, 'caseId' : caseId};
                console.log("In getCase callback with userId and caseId", userId, caseId);
                globals.theCase = theCase;
                globals.caseNumber = theCase.CaseNumber;
                component.set("v.globals", globals);
                component.set("v.caseNumber",theCase.CaseNumber);
                helper.fire_GlobalDataChange(component, globals);
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
    openUserInfo : function(component, event, helper) {
        component.set("v.showInfo", true);
    },
    closeUserInfo : function(component, event, helper) {
        component.set("v.showInfo", false);
    }

})