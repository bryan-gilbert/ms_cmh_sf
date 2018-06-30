({
    updateGlobals : function(component, helper, globals) {
		component.set("v.globals", globals);
		component.set("v.caseNumber",globals.theCase.CaseNumber);
        console.log("fire_GlobalDataChange", globals.caseId);
        var cmh18evt_GlobalDataChange = $A.get("e.c:cmh18evt_GlobalDataChange");
        cmh18evt_GlobalDataChange.setParams({"globals" : globals});
        cmh18evt_GlobalDataChange.fire();
        
        var userInfo = component.find("userInfo");
        userInfo.setInfo(globals.userInfo, globals.orgInfo);
    },
	loadGlobalData : function(component, helper) {	
        var caseId = component.get("v.recordId");
        var version = component.get("v.version");
        console.log("Main Case Email View loadGlobalData " + version);
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        var globals = {'userId': userId, 'caseId' : caseId};
	
        var resultCount = 0;
        var actionUser = component.get("c.fetchUser");
        actionUser.setCallback(this, function(response) {
            var state = response.getState();
            resultCount++;
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log("Got current user information", storeResponse);
            	globals.userInfo = storeResponse;
                if(resultCount===3) 
                	helper.updateGlobals(component,helper,globals);

            }
        });
        
        /* select Id, Address, DisplayName from OrgWideEmailAddress 
        */
        var actionOrg = component.get("c.fetchOrgEmail");
        actionOrg.setCallback(this, function(response) {
            var state = response.getState();
            resultCount++;
            if (state === "SUCCESS") {
                var list = response.getReturnValue();
                var orgInfo = (list && list.length > 0) ? list[0] : undefined;
                if(orgInfo) {
                	console.log("Got orgInfo", orgInfo);
                	globals.orgInfo = orgInfo;
                    if(resultCount===3) 
                    	helper.updateGlobals(component,helper,globals);
                }
            }
        });

        var actionCase = component.get("c.getCase");
		actionCase.setParams({"caseId": caseId});
        actionCase.setCallback(this, function(response){
            var state = response.getState();
            resultCount++;
            if (state === "SUCCESS") {                
            	var theCase = response.getReturnValue();
                console.log("In getCase callback with userId and caseId", userId, caseId);
                globals.theCase = theCase;
                globals.caseNumber = theCase.CaseNumber;
                if(theCase.Next_Action__c){
                 globals.nextAction = theCase.Next_Action__c;
                 component.set("v.nextAction", theCase.Next_Action__c);
                }
                if(resultCount===3) 
                    helper.updateGlobals(component,helper,globals);
                
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
        $A.enqueueAction(actionCase);        
        $A.enqueueAction(actionUser);        
        $A.enqueueAction(actionOrg);
    },
})