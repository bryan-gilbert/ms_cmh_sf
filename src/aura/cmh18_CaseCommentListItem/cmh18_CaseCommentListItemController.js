({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_CaseCommentListItem ", component.get("v.myCaseId"));    
    },   
    viewComment : function(component, event, helper) {
		var comment = component.get("v.comment");
        console.log("Case comment list item view comment click handler");
		var caseCommentId = comment.Id;
    	console.log("Fire cmh18evt_EmailView ", component.get("v.myCaseId"));
		var myEvent = $A.get("e.c:cmh18evt_EmailView");
		myEvent.setParams({"emailId": undefined,"caseCommentId": caseCommentId,"caseComment": comment, "caseId": component.get("v.myCaseId")});
		myEvent.fire();
    }, 
})