({
    // Handle request to open email viewer.  Fire the event to load an email record
	cmh18evt_EmailView : function(component, event, helper) {
        component.set("v.isLoaded", false);
        console.log("In CMH 18 Email Detail event handler");
        var emailId = event.getParam("emailId");        
        component.set('v.emailId', emailId);
//        var cmh18_LoadEmailEvent = $A.get("e.c:cmh18_LoadEmailEvent");
//        cmh18_LoadEmailEvent.setParams({"emailId": emailId});
//        cmh18_LoadEmailEvent.fire();
	},
    // Handle the event an email record has been retrieved
    cmh18_EmailLoadedEvent : function(component, event, helper) {
        var emailData = event.getParam("emailData");
        console.log("In email viewer cmh18_EmailLoadedEvent ", emailData);
        if (emailData.error) {
            component.set("v.error", msg);
        } else {
            var theEmail = emailData.data;
            component.set("v.id", theEmail.id);
            component.set("v.to", theEmail.to);
            component.set("v.cc", theEmail.cc);
            component.set("v.from", theEmail.from);
            component.set("v.fromAdress", theEmail.fromAddress);
            component.set("v.date", theEmail.date);
            component.set("v.hasAttachments", theEmail.hasAttachment);
            component.set("v.status", theEmail.status);
            component.set("v.subject", theEmail.subject);
            if(theEmail.html && theEmail.html.length > 0){
                component.set("v.body", theEmail.html);
            }
            else {
                component.set("v.body", theEmail.text);
            }
            component.set("v.isLoaded", true);
        }     
    }
})