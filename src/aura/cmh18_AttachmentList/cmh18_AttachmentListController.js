({
	cmh18_AttachmentsLoadedEvent : function(component, event, helper) {
        var attachmentsData = event.getParam("attachmentsData");        
        var attachments = attachmentsData.attachments;
        component.set("v.attachments", attachments);
        component.set("v.count", attachments.length);
	},
    showMore : function(component) {
        var limit = component.get('v.listLimit');
    	component.set('v.listLimit', limit + 5);
    }

})