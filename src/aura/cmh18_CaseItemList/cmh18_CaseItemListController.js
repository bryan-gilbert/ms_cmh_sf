({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
    	console.log("Init cmh18_CaseItemList ", component.get("v.myCaseId"));
    },   
	cmh18evt_GlobalDataChange : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var globals = event.getParam("globals");
        component.set('v.globals', globals);
        console.log("CaseItemList GLOBALS changed mainId: " + globals.mainId + " ... now loadList");
        helper.loadList(component,helper);
	},
    refresh : function(component, event, helper) {
    	console.log("Fire cmh18evt_RefreshFromServer ", component.get("v.myCaseId"));
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
        cmh18evt_RefreshFromServer.setParams({"caseId": component.get("v.myCaseId")});
        cmh18evt_RefreshFromServer.fire();        
	}, 	
    cmh18evt_EmailView : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var emailId = event.getParam("emailId");
        var caseCommentId = event.getParam("caseCommentId");
        if(emailId) {
	        component.set("v.selectedItemId", emailId);
        }
        if(caseCommentId) {
	        component.set("v.selectedItemId", caseCommentId);
        }
        helper.itemSelected(component,event,helper);
	}, 	
    cmh18evt_RefreshFromServer : function(component,event,helper) {
    	console.log("cmh18_CaseItemList handle cmh18evt_RefreshFromServer ", event.getParam("caseId"), component.get("v.myCaseId"));
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
	  helper.loadList(component,helper);       
    },
    cmh18evt_EmailEdit : function(component,event,helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var direction = event.getParam("direction");
        // open when editor is closed. close when editor is not closed.
        component.set("v.isOpen", direction === 'close')        
    },
 	fireNewEmailEditEvent : function(component,event,helper) {
    	console.log("Fire cmh18evt_EmailEdit ", component.get("v.myCaseId"));
        var myEvent = $A.get("e.c:cmh18evt_EmailEdit");
        myEvent.setParams({"action": "new", "direction" : "open", "caseId": component.get("v.myCaseId")});
        myEvent.fire();
    },
})