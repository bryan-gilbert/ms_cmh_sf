({
    load: function(component,helper){
        console.log("Init cmh18_CaseHeader", component.get("v.myCaseId"));    
        var caseId = component.get("v.myCaseId");        
        var actionCase = component.get("c.getCase");
		actionCase.setParams({"caseId": caseId});
        actionCase.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
            	var theCase = response.getReturnValue();
                console.log("In cmh18_CaseHeader callback", theCase.Subject);
                component.set("v.theCase", theCase);
            }
        });                
        $A.enqueueAction(actionCase);          
    },
    update: function(component,helper){
        console.log("cmh18_CaseHeader update", component.get("v.myCaseId"));   
        var caseId = component.get("v.myCaseId"); 
        var theCase = component.get("v.theCase");
        // updateCase(String caseId, String FollowUp, String Priority, String Segment, String Status, String Type) {        
        var params = {"caseId": caseId};
        params.FollowUp = component.get("v.selectedFollowUp") || theCase.Follow_up_date__c;
        params.Priority = component.get("v.selectedPriority") || theCase.Priority;
        params.Segment = component.get("v.selectedSegment") || theCase.Segment;
        params.Status = component.get("v.selectedStatus") || theCase.Status;
        params.Type = component.get("v.selectedType") || theCase.Type;
        var action = component.get("c.updateCase");
		action.setParams(params);
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                console.log("cmh18_CaseHeader Fire cmh18evt_RefreshFromServer ", caseId);
                var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
                cmh18evt_RefreshFromServer.setParams({"caseId": caseId});
                cmh18evt_RefreshFromServer.fire();                   
            }
        });                
        $A.enqueueAction(action);          
    },    
    fireRefresh : function(component, helper) {
    	console.log("cmh18_CaseHeader Fire cmh18evt_RefreshFromServer ", component.get("v.myCaseId"));
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
        cmh18evt_RefreshFromServer.setParams({"caseId": component.get("v.myCaseId")});
        cmh18evt_RefreshFromServer.fire();         
	}, 
    doAction : function(component,helper,action) {
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                var responseValue = response.getReturnValue();
                console.log("In cmh18_CaseHeader callback", responseValue);
                helper.fireRefresh(component,helper);
            }
        });                
        $A.enqueueAction(action); 
    },
    editProperty : function(component,helper, actionName, propName, attributeName,allowEmpty,callback){
        console.log("cmh18_CaseHeader edit property", actionName, propName, attributeName);
        var action = component.get(actionName);
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {  
            	var csvList = response.getReturnValue();
                var elements = csvList.split(",").map(function(elem) {
                    var parts =  elem.split(":");
                    return {"label": parts[0], "value": parts[1]};                    
                });
                if(allowEmpty) {
                    elements.unshift({label:'none', value:''});
                }
                component.set("v."+attributeName,elements);
                helper.activateEditor(component,propName);
                callback();
            }
        });                
        $A.enqueueAction(action); 
    },
    activateEditor : function(component,editorName){
        var activeEditors = component.get("v.activeEditors") || {};
        activeEditors[editorName] = true;
        component.set("v.activeEditors", activeEditors);
    },
    stringifyDate : function(d){
        var datestring = d.getFullYear() 
        + "-" + ("0"+(d.getMonth()+1)).slice(-2) 
        + "-" + ("0" + d.getDate()).slice(-2) ;
        return datestring;
    },
})