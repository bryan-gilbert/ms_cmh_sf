({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_AttachmentList ", component.get("v.myCaseId"));    
    },   
    cmh18evt_GlobalDataChange : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var globals = event.getParam("globals");
        var eventCaseId = event.getParam("caseId");
        component.set("v.caseNumber", globals.caseNumber);
        var fileInput = component.find("fileUploadInput")
        fileInput.set("v.recordId", globals.caseId);
    },
	cmh18evt_AttachmentsLoaded : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var attachmentsData = event.getParam("attachmentsData");        
        var eventCaseId = event.getParam("caseId");
        var allDocs = attachmentsData.allDocs;
        var attachmentRecords = attachmentsData.attachments;
        var links = attachmentsData.links;
        allDocs.forEach(function(a) {
            a.isSelected = false;
            a.isChecked = false;
            //console.log("attachment: " + a.name + " parent: " + a.parentIsCase + " link: " + a.isDocument + " attach: " + a.isAttachment + " parent: " + a.parentId);
            //console.log("attachment.lastModifiedDate " + a.lastModifiedDate)
        })
        console.log("cmh18_AttachmentList cmh18evt_AttachmentsLoaded "+ allDocs.length + " attachments");
        component.set("v.attachments", allDocs);
        component.set("v.count", allDocs.length);
        component.set("v.emailId", '');
        helper.selectSort(component,event,helper);
        helper.fireAttachmentListEvent(component);        
	},   
    cmh18evt_EmailView : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var emailId = event.getParam("emailId");
        var eventCaseId = event.getParam("caseId");
        // no need to get the event's caseCommentId
        component.set("v.emailId", emailId);
        console.log("Attachment list respond to view email event", emailId);
        helper.selectSort(component,event,helper);
        if(emailId) {
        	helper.fireAttachmentListEvent(component);
        }        
    },
	cmh18evt_EmailEdit : function(component, event, helper) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var direction = event.getParam("direction");
        component.set("v.emailEditMode", direction === 'open');
        if(direction === 'close') {
            console.log("TODO cmh18evt_EmailEdit do we need anything on the close event?")
        } else {
            var requestedAction = event.getParam("action");
            console.log("cmh18evt_EmailEdit action: ", requestedAction, " showing checkboxes? ", component.get("v.emailEditMode"))
            component.set("v.checkSelected",'forward' === requestedAction); 
            helper.selectSort(component,event,helper);
            helper.fireAttachmentListEvent(component);   
        }
	}, 
    onCheckbox : function(component, event, helper) {
        var ctarget = event.currentTarget;
        var attachmentId = ctarget.dataset.value;        
        console.log("In on check box", attachmentId,         ctarget.checked);
        var attachments = component.get("v.attachments");
        var attachment = attachments.find(function(a) {
            return a.id === attachmentId;
        })
        if(!attachment) {
            console.log("Can't find attachment for checkbox ", attachmentId);
        } else {
            attachment.isChecked = !attachment.isChecked;
            ctarget.checked = attachment.isChecked;
        }
        component.set("v.attachments", attachments);
        helper.fireAttachmentListEvent(component);
    },
})