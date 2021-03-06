({
    doInit: function(component,event,helper) {
        var thisId = component.getGlobalId();
        console.log("INITIALIZE attachment list with THISID " + thisId);
    },
    locationChange : function(component,event,helper) {
        var thisId = component.getGlobalId();
        console.log("LOCATIONCHANGE attachment list with THISID " + thisId );        
    },    
    cmh18evt_GlobalDataChange : function(component, event, helper) {
        var thisId = component.getGlobalId();
        var globals = event.getParam("globals");
        if(globals) {
            console.log("cmh18_AttachmentList GLOBALS changed THISID: " + thisId
                        + " mainId: " 
                        + globals.mainId + " V: " + component.get("v.version") + " caseId: " + globals.caseId);
            component.set("v.caseId", globals.caseId);
            component.set("v.caseNumber", globals.caseNumber);
            var fileInput = component.find("fileUploadInput")
            fileInput.set("v.recordId", globals.caseId);
        }else {
            alert("Error globals did not come along in the global data change event");
        }
    },
	cmh18evt_AttachmentsLoaded : function(component, event, helper) {
        var attachmentsData = event.getParam("attachmentsData");        
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
    onRender : function(component,event,helper){
        helper.checkboxesDisplay(component,helper);
    },    
    cmh18evt_EmailView : function(component, event, helper) {
        var emailId = event.getParam("emailId");
        // no need to get the event's caseCommentId
        component.set("v.emailId", emailId);
        console.log("Attachment list respond to view email event", emailId);
        helper.selectSort(component,event,helper);
        if(emailId) {
        	helper.fireAttachmentListEvent(component);
        }        
    },
	cmh18evt_EmailEdit : function(component, event, helper) {
        var direction = event.getParam("direction");
        console.log("TODO cmh18evt_EmailEdit implement spinner and show until list is loaded.")        
        component.set("v.showCheckBoxes", direction === 'open');
        if(direction === 'close') {
            console.log("TODO cmh18evt_EmailEdit do we need anything on the close event?")
        } else {
            var requestedAction = event.getParam("action");
            console.log("cmh18evt_EmailEdit action: ", requestedAction, " showing checkboxes? ", component.get("v.showCheckBoxes"))
            component.set("v.checkSelected",'forward' === requestedAction); 
            helper.selectSort(component,event,helper);
            helper.fireAttachmentListEvent(component);   
            helper.checkboxesDisplay(component,helper);            
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
    upload : function(component,event,helper) {
        alert("The file upload feature is under development.");
        // TODO implement file upload.  One possible solution 
        // https://developer.salesforce.com/blogs/developer-relations/2017/05/build-lightning-file-uploader-component.html
    }
})