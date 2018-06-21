({
	cmh18_AttachmentsLoadedEvent : function(component, event, helper) {
        var attachmentsData = event.getParam("attachmentsData");        
        var attachments = attachmentsData.attachments;
        attachments.forEach(function(a) {
            a.isSelected = false;
            a.isChecked = false;
        })
        component.set("v.attachments", attachments);
        component.set("v.count", attachments.length);
        component.set("v.emailId", '');
        helper.selectSort(component,event,helper);
        helper.fireLoadEmailDetailEvent(component);        
	},
    cmh18evt_EmailView : function(component, event, helper) {
        var emailId = event.getParam("emailId");
        component.set("v.emailId", emailId);
        console.log("Attachment list respond to view email event", emailId);
        helper.selectSort(component,event,helper);
        helper.fireLoadEmailDetailEvent(component);        
    },
	cmh18evt_EmailEdit : function(component, event, helper) {
        var direction = event.getParam("direction");
        component.set("v.showCheckBoxes", direction === 'open');
        if(direction === 'close') {
            console.log("TODO implement spinner and show until list is loaded.")
        }
	},    
    onCheckbox : function(component, event, helper) {
        var ctarget = event.currentTarget;
        var attachmentId = ctarget.dataset.value;        
        console.log("In on check box", attachmentId,         ctarget.checked);
        var attachments = component.get("v.attachments");
        var attachment = attachments.find(function(a) {
            return a.Id === attachmentId;
        })
        if(!attachment) {
            console.error("Can't find attachment for checkbox ", attachmentId);
        } else {
            attachment.isChecked = !attachment.isChecked;
            ctarget.checked = attachment.isChecked;
        }
        component.set("v.attachments", attachments);
        helper.fireLoadEmailDetailEvent(component);
    },
    
})