({
    fireCaseEmailDetailEvent : function(emailId) {
		console.log("fireCaseEmailDetailEvent emailId", emailId);
        var myEvent = $A.get("e.c:cmh18evt_EmailView");
        myEvent.setParams({"emailId": emailId});
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
        var cmh18_LoadEmailEvent = $A.get("e.c:cmh18_LoadEmailEvent");
        cmh18_LoadEmailEvent.setParams({"emailId": emailId});
        cmh18_LoadEmailEvent.fire();
	}, 
	convertStatus : function(status) {
        var inx = status * 1;
        var values = ["New","Read","Replied","Sent","Forwarded","Draft"];
        return values[inx];
	}    
})