({
	cmh18evt_GlobalDataChange : function(component, event, helper) {
        var globals = event.getParam("globals");
        component.set('v.globals', globals);
        console.log("CaseItemList GLOBALS changed mainId: " + globals.mainId + " ... now loadList");
        helper.loadList(component,helper);
	},
    refresh : function(component, event, helper) {
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
        cmh18evt_RefreshFromServer.fire();        
	}, 	
    cmh18evt_EmailView : function(component, event, helper) {
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
	  helper.loadList(component,helper);       
    },
    cmh18evt_EmailEdit : function(component,event,helper) {
        var direction = event.getParam("direction");
        // open when editor is closed. close when editor is not closed.
        component.set("v.isOpen", direction === 'close')        
    },
 	fireNewEmailEditEvent : function(component,event,helper) {
        console.log("fireNewEmailEditEvent ");
        var myEvent = $A.get("e.c:cmh18evt_EmailEdit");
        myEvent.setParams({"action": "new", "direction" : "open"});
        myEvent.fire();
    },
})