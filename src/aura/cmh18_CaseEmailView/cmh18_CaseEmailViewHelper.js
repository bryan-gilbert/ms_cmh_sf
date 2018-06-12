({
    fireCaseEmailDetailEvent : function(emailId) {
		console.log("fireCaseEmailDetailEvent emailId", emailId);
        var myEvent = $A.get("e.c:cmh18_CaseEmailDetailEvent");
        myEvent.setParams({"emailId": emailId});
        myEvent.fire();
    },
	fireCaseEmailEditEvent : function(action, emailId) {
        console.log("fireCaseEmailEditEvent emailId: " + emailId + " action: " + action);
        var myEvent = $A.get("e.c:cmh18_OpenEditEmailPanelEvent");
        myEvent.setParams({"emailId": emailId});
        myEvent.setParams({"action": action});
        myEvent.fire();
    },
})