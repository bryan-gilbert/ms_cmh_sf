({
    cmh18evt_GlobalDataChange : function(component, event, helper) {
        console.log("cmh18_AttachmentList cmh18evt_GlobalDataChange " + component.get("v.version"));
        var globals = event.getParam("globals");
        if(globals) {
        component.set("v.caseId", globals.caseId);
        var fileInput = component.find("fileUploadInput")
        fileInput.set("v.recordId", globals.caseId);
        }else {
            alert("Error globals did not come along in the global data change event");
        }
    },
	cmh18_AttachmentsLoadedEvent : function(component, event, helper) {
        var attachmentsData = event.getParam("attachmentsData");        
        var attachments = attachmentsData.allDocs;
        attachments.forEach(function(a) {
            a.isSelected = false;
            a.isChecked = false;
        })
        console.log("cmh18_AttachmentList cmh18_AttachmentsLoadedEvent "+ attachments.length + " attachments");
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
    upload : function(component,event,helper) {
        alert("The file upload feature is under development.");
        // TODO implement file upload.  One possible solution 
        // https://developer.salesforce.com/blogs/developer-relations/2017/05/build-lightning-file-uploader-component.html
    }
})