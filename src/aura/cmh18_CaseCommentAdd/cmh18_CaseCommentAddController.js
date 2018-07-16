({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        component.set("v.caseComment", "");        
        console.log("Init cmh18_CaseCommentAdd ", component.get("v.myCaseId"));    
	}, 
    save : function(component, event, helper) {
        var body = component.get("v.caseComment");
        if(body && body.length>0) {
            var caseId = component.get("v.myCaseId");
            var actionCase = component.get("c.addCaseComment");
            actionCase.setParams({"caseId": caseId, "commentBody" : body});
            actionCase.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {                
                    console.log("cmh18_CaseCommentAdd Fire cmh18evt_RefreshFromServer ", caseId);
                    var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
                    cmh18evt_RefreshFromServer.setParams({"caseId": caseId});
                    cmh18evt_RefreshFromServer.fire();        
			        component.set("v.caseComment", "");        
                }
            });
            $A.enqueueAction(actionCase);
        }
	},
    changed : function(component,event,helper) {
        console.log("Init cmh18_CaseCommentAdd changed");
        var body = component.get("v.caseComment");
        component.set("v.modified", (body && body.length>0));    
    },
    cancel : function(component,event,heleper) {
        console.log("Init cmh18_CaseCommentAdd reset content");        
        component.set("v.caseComment", "");        
        component.set("v.modified", false);            
    }, 
    toggleEdit : function(component,event,helper) {
        var secId = 'toggledElem';
        var acc = component.find(secId);
        for(var cmp in acc) {
            $A.util.toggleClass(acc[cmp], 'slds-show');  
            $A.util.toggleClass(acc[cmp], 'slds-hide');  
        }        
    },
})