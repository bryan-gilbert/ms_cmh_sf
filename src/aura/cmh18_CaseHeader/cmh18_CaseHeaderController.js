({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.recordId"));
        helper.load(component,helper);       
	}, 
    cmh18evt_RefreshFromServer : function(component,event,helper){
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        helper.load(component,helper);               
    },
    invokeToTriage : function(component,event,helper){
        console.log("Init cmh18_CaseHeader sendToTriage", component.get("v.myCaseId"));    
        var caseId = component.get("v.myCaseId");        
        var action = component.get("c.sendToTriage");
		action.setParams({"caseId": caseId});
        helper.doAction(component,helper,action);
    },
    invokeTakeOwnership : function(component,event,helper){
        console.log("Init cmh18_CaseHeader takeOwnership", component.get("v.myCaseId"));    
        var caseId = component.get("v.myCaseId");        
        var action = component.get("c.takeOwnerShip");
		action.setParams({"caseId": caseId});
        helper.doAction(component,helper,action);
    },
    invokeTrash : function(component,event,helper){
        console.log("Init cmh18_CaseHeader sendTotrash", component.get("v.myCaseId"));    
        var caseId = component.get("v.myCaseId");        
        var action = component.get("c.sendToTrash");
		action.setParams({"caseId": caseId});
        helper.doAction(component,helper,action);
    },
    editPriority : function(component,event,helper){
        var allowEmpty = false;
        helper.editProperty(component,helper,'c.getCasePriorities', 'priority', 'priorities', allowEmpty, function() {
            var theCase = component.get("v.theCase");
            component.set("v.selectedPriority", theCase.Priority);
            component.set("v.modified",true);
        });
    },
    editSegment : function(component,event,helper){
        var allowEmpty = true;
        helper.editProperty(component,helper,'c.getCaseSegments', 'segment', 'segments', allowEmpty, function() {
            var theCase = component.get("v.theCase");
            component.set("v.selectedSegment", theCase.Segment__c);
            component.set("v.modified",true);
        });
    },
    editStatus : function(component,event,helper){
        var allowEmpty = false;
        helper.editProperty(component,helper,'c.getCaseStatuses', 'status', 'statuses', allowEmpty, function() {
            var theCase = component.get("v.theCase");
            component.set("v.selectedStatus", theCase.Status);
            component.set("v.modified",true);
        });
    },
    editType : function(component,event,helper){
        var allowEmpty = true;
        helper.editProperty(component,helper,'c.getCaseTypes', 'type', 'types', allowEmpty, function() {
            var theCase = component.get("v.theCase");
            component.set("v.selectedType", theCase.Type);
            component.set("v.modified",true);
        });
    },
    editFollowUp : function(component,event,helper){
        var theCase = component.get("v.theCase");
        var fD = theCase.Follow_up_date__c;
        var d = fD ? (new Date(fD)) : (new Date());
        var datestring = helper.stringifyDate(d);
        component.set("v.selectedFollowUp",datestring);
        console.log("cmh18_CaseHeader selectedFollowUp",theCase.Follow_up_date__c, datestring)
        helper.activateEditor(component,'followUp');
        component.set("v.modified",true);
    },
    cancelEdit : function(component,event,helper){
        component.set("v.modified",false);
        component.set("v.activeEditors",{});
    },     
    saveEdit : function(component,event,helper){
        helper.update(component,helper);
        component.set("v.modified",false);
        component.set("v.activeEditors",{});
    },    
    
})