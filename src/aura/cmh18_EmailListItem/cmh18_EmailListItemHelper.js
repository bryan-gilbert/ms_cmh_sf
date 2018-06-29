({
    fireCaseEmailDetailEvent : function(emailId) {
		console.log("fireCaseEmailDetailEvent emailId", emailId);
        var myEvent = $A.get("e.c:cmh18evt_EmailView");
        myEvent.setParams({"emailId": emailId});
        myEvent.setParams({"caseCommentId": undefined});        
        myEvent.fire();
    },
	fireCaseEmailEditEvent : function(direction,action, emailId) {
        console.log("fireCaseEmailEditEvent emailId: " + emailId + " direction/action: " + direction + "/" + action);
        var myEvent = $A.get("e.c:cmh18evt_EmailEdit");
        myEvent.setParams({"emailId": emailId, "action": action, "direction" : direction});
        myEvent.fire();
    },
	fireLoadEmailDetailEvent : function(emailId) {
        console.log("fireLoadEmailDetailEvent emailId: " + emailId);
        var cmh18evt_LoadEmail = $A.get("e.c:cmh18evt_LoadEmail");
        cmh18evt_LoadEmail.setParams({"emailId": emailId});
        cmh18evt_LoadEmail.fire();
	}, 
	convertStatus : function(status) {
        var inx = status * 1;
        var values = ["New","Read","Replied","Sent","Forwarded","Draft"];
        return values[inx];
	}    
})