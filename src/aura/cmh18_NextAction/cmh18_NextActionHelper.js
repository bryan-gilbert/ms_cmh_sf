({
	loadNextAction : function(component,helper) {
        var caseId = component.get("v.recordId");
        var actionCase = component.get("c.getCase");
		actionCase.setParams({"caseId": caseId});
        actionCase.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
            	var theCase = response.getReturnValue();
                if(theCase.Next_Action__c){
var re = /(.*)\n/g;
console.log("FOOOOOOO")
                    console.log(theCase.Next_Action__c);
var htmlStr = theCase.Next_Action__c.replace(re, '<p>$1</p>');                    
                    console.log(htmlStr);
                 component.set("v.nextAction", htmlStr);
                }                
            }
        });
        $A.enqueueAction(actionCase);
	}
})