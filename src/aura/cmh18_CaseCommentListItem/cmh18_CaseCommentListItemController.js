({
    doInit : function(component, event, helper) {


	}, 
    viewComment : function(component, event, helper) {
		var comment = component.get("v.comment");
        console.log("Case comment list item view comment click handler");
		var caseCommentId = comment.Id;
		var myEvent = $A.get("e.c:cmh18evt_EmailView");
		myEvent.setParams({"emailId": undefined});
		myEvent.setParams({"caseCommentId": caseCommentId});
		myEvent.setParams({"caseComment": comment});
		myEvent.fire();
    }, 
})