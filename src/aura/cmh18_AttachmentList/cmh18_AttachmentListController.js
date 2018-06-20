({
	cmh18_AttachmentsLoadedEvent : function(component, event, helper) {
        var attachmentsData = event.getParam("attachmentsData");        
        var attachments = attachmentsData.attachments;
        attachments.forEach(function(a) {
            a.isSelected = true;
        })
        component.set("v.attachments", attachments);
        component.set("v.count", attachments.length);
        component.set("v.emailId", '');
        helper.selectSort(component,event,helper);
	},
    cmh18evt_EmailView : function(component, event, helper) {
        var emailId = event.getParam("emailId");
        component.set("v.emailId", emailId);
        console.log("Attachment list respond to view email event", emailId);
        helper.selectSort(component,event,helper);
    },

})