({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_EmailList ", component.get("v.myCaseId"));    
    },   
	cmh18evt_GlobalDataChange : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var globals = event.getParam("globals");
        component.set('v.globals', globals);
        helper.loadList(component,helper);
	},
    refresh : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
    	console.log("Fire cmh18evt_RefreshFromServer ", component.get("v.myCaseId"));
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
        cmh18evt_RefreshFromServer.setParams({"caseId": component.get("v.myCaseId") });
        cmh18evt_RefreshFromServer.fire();        
	}, 	
    cmh18evt_EmailView : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var emailId = event.getParam("emailId");
        component.set("v.selectedEmail", emailId);
        //console.log("Set selectedEmail", emailId);
        helper.emailSelected(component,event,helper);
	}, 	
    cmh18evt_RefreshFromServer : function(component,event,helper) {
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
 
})