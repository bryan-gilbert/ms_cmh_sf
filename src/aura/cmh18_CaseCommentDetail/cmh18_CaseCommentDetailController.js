({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_CaseCommentDetail ", component.get("v.myCaseId"));    
    },   
    // Handle request to open email viewer.  Fire the event to load an email record
	cmh18evt_EmailView : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        component.set("v.isLoaded", false);
        console.log("In CMH 18 Email Detail event handler");
        //var emailId = event.getParam("emailId");        
        var caseCommentId = event.getParam("caseCommentId");
        component.set('v.caseCommentId', caseCommentId);
        var caseComment = event.getParam("caseComment");
        component.set('v.caseComment', caseComment);
        if(caseComment) {
	        component.set("v.isLoaded", true);            
        }
	},

})