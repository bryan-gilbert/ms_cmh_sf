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
        var subject = helperData.renderedSubject ? helperData.renderedSubject + " - " : "";
            subject += helperData.re + " " + helperData.originalSubject;
		component.set("v.subject", subject);
        var body = "";
        if(helperData.renderedBody) {
            body = helperData.renderedBody;
            body += helperData.isHtml ? "<br/>" : "";
            body += "\n";
        }
        console.log("prebody", helperData.preBody);
        body += helperData.preBody;
        body += helperData.isHtml ? "<br/>" : "";
        body += "\n";
        body += helperData.body; 
        component.set("v.body", body);
	},
    sendCloseEvent: function(component,helper) {
        var cmh18evt_EmailSend = $A.get("e.c:cmh18evt_EmailEdit");
        cmh18evt_EmailSend.setParams({direction: 'close' });
        cmh18evt_EmailSend.fire(); 
    },
    sendRefreshEvent: function(component,helper) {
        var cmh18evt_EmailSend = $A.get("e.c:cmh18evt_RefreshFromServer");
        cmh18evt_EmailSend.fire(); 
    },

})