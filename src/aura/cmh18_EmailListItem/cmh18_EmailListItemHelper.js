({
    fireCaseEmailDetailEvent : function(component,emailId) {
    	console.log("Fire cmh18evt_EmailView ", component.get("v.myCaseId"));
        var myEvent = $A.get("e.c:cmh18evt_EmailView");
        myEvent.setParams({"emailId": emailId,"caseCommentId": undefined, "caseId": component.get("v.myCaseId")});
        myEvent.fire();
    },
	fireCaseEmailEditEvent : function(component,direction,action, emailId) {
    	console.log("Fire cmh18evt_EmailEdit ", component.get("v.myCaseId"));
        console.log("fireCaseEmailEditEvent emailId: " + emailId + " direction/action: " + direction + "/" + action);
        var myEvent = $A.get("e.c:cmh18evt_EmailEdit");
        myEvent.setParams({"emailId": emailId, "action": action, "direction" : direction, "caseId": component.get("v.myCaseId")});
        myEvent.fire();
    },
	fireLoadEmailDetailEvent : function(component,emailId) {
    	console.log("Fire cmh18evt_LoadEmail ", component.get("v.myCaseId"));
        console.log("fireLoadEmailDetailEvent emailId: " + emailId);
        var cmh18evt_LoadEmail = $A.get("e.c:cmh18evt_LoadEmail");
        cmh18evt_LoadEmail.setParams({"emailId": emailId, "caseId": component.get("v.myCaseId")});
        cmh18evt_LoadEmail.fire();
	}, 
	convertStatus : function(status) {
        var inx = status * 1;
        var values = ["New","Read","Replied","Sent","Forwarded","Draft"];
        return values[inx];
	}    
})