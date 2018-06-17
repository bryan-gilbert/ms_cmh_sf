({
	doInit : function(component, event, helper) {
        var caseId = component.get("v.caseId");
        var action = component.get("c.getList");
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	console.log("Get emails ", theList);
				component.set("v.emails", theList);
				component.set("v.count", theList.length);                
            }
        });
        $A.enqueueAction(action);		
	}, 	
 
})