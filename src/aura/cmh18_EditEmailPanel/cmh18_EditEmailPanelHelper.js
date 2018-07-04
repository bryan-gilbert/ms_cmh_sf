({
    initForm : function(component) {
        component.set("v.to", "");
        component.set("v.from", "");
        component.set("v.fromAdress", "");
        component.set("v.subject", "");
        component.set("v.cc", "");
        component.set("v.body", "");  
    },
    setupContent : function(component,helper,theEmail) {
      var globals = component.get("v.globals");
        var addresses = globals.addresses;
        var orgInfo = globals.orgInfo;
        var userInfo = globals.userInfo;   
        var caseNumber = globals.caseNumber;
        var fromAddress = orgInfo ? orgInfo.Address : userInfo.Email;
        var from = orgInfo ? orgInfo.DisplayName : userInfo.Name;
        var toInput = component.find("toInput");
        var ccInput = component.find("ccInput");
        var bccInput = component.find("bccInput");
        toInput.setLists(addresses);
        ccInput.setLists(addresses);
        bccInput.setLists(addresses);
        
        console.log("Org wide email " + from + "  " + fromAddress);
        helper.initForm(component);
        var helperData = {caseNumber: caseNumber};
        if(theEmail) {
            helperData.originalSubject = theEmail.subject;
            component.set("v.originalEmail", theEmail);
            component.set("v.id", theEmail.id);
        }
        var requestedAction = component.get("v.requestedAction");
        if ("replyAll" === requestedAction) {
            var parts=[];
            if(theEmail.to){
                var toparts = theEmail.to.split(";");
                parts.push.apply(parts, toparts);
            }
            if(theEmail.cc){
                var ccparts = theEmail.cc.split(";");
                parts.push.apply(parts, ccparts);
            }
            if(parts.length > 0){
                parts = parts.map(function(a) { return a.trim();});
                parts.sort();
                var filtered = parts.filter(function(item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
                ccInput.setLists(addresses,filtered);                                    
            }
        }
        var preData = [];
        var brkLf = '<br clear="none" />';
        preData.push(brkLf);            
        helperData.re = undefined;
        if(requestedAction.includes("reply")) {
            if(theEmail.fromAddress) {
                toInput.setLists(addresses,[theEmail.fromAddress]);                    
            }
            if (! theEmail.subject.trim().startsWith("Re:"))
            	helperData.re = "Re:";
            preData.push('--------------- Original Message ---------------'+brkLf);
        }
        if ("forward" === requestedAction) {
            if (! theEmail.subject.trim().startsWith("Fwd:"))
            	helperData.re = "Fwd:";
            preData.push('---------- Forwarded message ---------'+brkLf);
        }
        if ("new" === requestedAction) {
            helperData.body = "new email";
        } else {
            var dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric', timeZoneName: 'short'};
            var theDate = new Date(theEmail.date);
            var formatedDate = theDate.toLocaleDateString('en-US', dateFormatOptions);
            preData.push('<b>From:</b> '+theEmail.fromAddress + brkLf);
            preData.push('<b>Sent:</b> '+ formatedDate + brkLf);
            preData.push('<b>To:</b> '+theEmail.to+brkLf);
            preData.push('<b>Cc:</b> '+theEmail.cc+brkLf);
            preData.push('<b>Subject:</b> '+theEmail.subject+brkLf);
            preData.push(brkLf);
            helperData.preBody = preData.join('\n');                        
            if(theEmail.html && theEmail.html.length > 0){
                helperData.body = theEmail.html;
            } else {
                helperData.body = theEmail.text;            
            }
        }        
        component.set("v.helperData", helperData);
		helper.updateContent(component);
        component.set("v.isLoaded", true);
        component.set("v.modified", false);  
        //console.log("for some reason when the action is new the cmp is null unless we introduce a slight delay");
        window.setTimeout(
            $A.getCallback(function() {
                var cmp = component.find("iBody");
                if (cmp && cmp.isValid()) {
                    cmp.focus();
                }
            }), 100
        );    
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
        if (helperData.preBody) {
            body += helperData.preBody;
            body += helperData.isHtml ? "<br/>" : "";
            body += "\n";
        } 
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