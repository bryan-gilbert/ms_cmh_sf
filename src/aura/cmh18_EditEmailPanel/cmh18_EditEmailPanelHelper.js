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
        /*
                 helperData.renderedSubject = renderedSubject;
        helperData.renderedBody = body;

         */
        var subject = helperData.renderedSubject ? helperData.renderedSubject + " - " : "";
            subject += helperData.re + " " + helperData.originalSubject;
		component.set("v.subject", subject);
        var body = "";
        if(helperData.renderedBody) {
            body = helperData.renderedBody;
            body += helperData.isHtml ? "<br/>" : "";
            body += "\n";
        }
        body += helperData.body; 
        component.set("v.body", body);
	}
})