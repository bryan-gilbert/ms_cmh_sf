({
	cmh18_AttachmentsLoadedEvent : function(component, event, helper) {
        var attachmentsData = event.getParam("attachmentsData");        
        var attachments = attachmentsData.attachments;
        attachments.forEach(function(a) {
            a.isSelected = true;
        })
        component.set("v.attachments", attachments);
        component.set("v.count", attachments.length);
	},
    showMore : function(component) {
        var limit = component.get('v.listLimit');
    	component.set('v.listLimit', limit + 5);
    },
    cmh18evt_EmailView : function(component, event, helper) {
        var emailId = event.getParam("emailId");
        console.log("Attachment list respond to view email event", emailId);
        var attachments = component.get("v.attachments");
        attachments.forEach(function(a) {
            a.isSelected = emailId === a.ParentId;
        })        
        component.set("v.attachments", attachments);
    },

})