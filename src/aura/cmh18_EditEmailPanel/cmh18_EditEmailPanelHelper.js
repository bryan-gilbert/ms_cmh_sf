({
    initForm : function(component) {
        component.set("v.to", "");
        component.set("v.from", "");
        component.set("v.fromAdress", "");
        component.set("v.subject", "");
        component.set("v.cc", "");
        component.set("v.body", "");  
    },
	updateContent : function(component) {
        var helperData = component.get("v.helperData");
        console.log("re data ", helperData.re);
        var subject = helperData.renderedSubject ? helperData.renderedSubject + " - " : "";
            subject += helperData.re ? helperData.re + " " : "";
            subject += helperData.originalSubject;
        var cNumSubject = " Case: " + helperData.caseNumber;
        if(!subject.includes(cNumSubject)) {
            subject += cNumSubject;
        }
		component.set("v.subject", subject);
        var body = "";
        if(helperData.renderedBody) {
            body = helperData.renderedBody;
            body += helperData.isHtml ? "<br/>" : "";
            body += "\n";
        }
        //console.log("prebody", helperData.preBody);
        body += helperData.preBody;
        body += helperData.isHtml ? "<br/>" : "";
        body += "\n";
        body += helperData.body; 
        component.set("v.body", body);
	},
    sendCloseEvent: function(component,helper) {
        var cmh18evt_EmailEdit = $A.get("e.c:cmh18evt_EmailEdit");
        cmh18evt_EmailEdit.setParams({direction: 'close' });
        cmh18evt_EmailEdit.fire(); 
    },
    sendRefreshEvent: function(component,helper) {
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshFromServer");
        cmh18evt_RefreshFromServer.fire(); 
    },
    validateEmailAddressList : function(list, listName) {
        var okToProceed = true;
        if(list.length > 0){
            var invalids = list.filter(function(eadd){
                var position = eadd.search(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
                return position < 0;
            });
            if(invalids.length > 0){
                var strange = invalids[0];
                var msg = "In the "+listName+" the email address '"+strange+"' appears to be invalid. ";
                msg += "Click 'Cancel' to ignore this warning and send the email anyway.";
                msg += "Click 'OK' to return to edit the email.";
                var confirmNoSend = confirm(msg)
                if (confirmNoSend) {
                    okToProceed = false;
                }
            }
        }
        return okToProceed;
    },

})