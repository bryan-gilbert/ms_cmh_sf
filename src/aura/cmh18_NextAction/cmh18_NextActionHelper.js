({
	loadNextAction : function(component,helper) {
        var caseId = component.get("v.myCaseId");
        var actionCase = component.get("c.getCase");
		actionCase.setParams({"caseId": caseId});
        actionCase.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
            	var theCase = response.getReturnValue();
                helper.refreshValues(component,helper,theCase);
            }
        });
        $A.enqueueAction(actionCase);
	},
    updateNextAction : function(component,helper) {
        var caseId = component.get("v.myCaseId");
        var actionCase = component.get("c.updateNextAction");
        actionCase.setParams({"caseId": caseId, "nextAction" : component.get("v.nextAction")});
        actionCase.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
            	var theCase = response.getReturnValue();
                helper.refreshValues(component,helper,theCase);   
                console.log("cmh18_NextAction Fire cmh18evt_RefreshFromServer ", caseId);
                var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
                cmh18evt_RefreshFromServer.setParams({"caseId": caseId});
                cmh18evt_RefreshFromServer.fire();        
            }
        });
        $A.enqueueAction(actionCase);
	},
    refreshValues : function(component,helper,theCase) {
        var str = '';
        if(theCase.Next_Action__c){
            //console.log(theCase.Next_Action__c);
            var str = theCase.Next_Action__c;
        }         
        component.set("v.originalText", str);
        component.set("v.nextAction", str);
        component.set("v.theCase", theCase);
        // after load data into UI because the load triggers the modified flag to be true but we need to start with it false;
        component.set("v.modified", false);    
    }
})