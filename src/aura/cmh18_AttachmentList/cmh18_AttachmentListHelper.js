({
    selectSort : function(component, event, helper) {
        var emailId = component.get("v.emailId");
        var elements = document.getElementsByClassName("attachment-checkbox");
        for (var i=0; i<elements.length; i++) {
            var ctarget = elements[i];
            ctarget.checked = false;
        }        
        
        console.log("Attachment list respond to view email event", emailId);
        var attachments = component.get("v.attachments");
        attachments.forEach(function(a) {
            a.isSelected = emailId && emailId === a.ParentId;
        })   
        attachments.sort(function(a,b) {
            var result = 0;
            if ((a.isSelected && b.isSelected) || (!a.isSelected && !b.isSelected)) {
                var d1 = new Date(a.LastModifiedDate);
                var d2 = new Date(b.LastModifiedDate);
                //console.log("d1/d2", d1, d2);
                result = d1.getTime() - d2.getTime();  
                //console.log("sort", result, a.LastModifiedDate, b.LastModifiedDate);
            } else {
                result = (a.isSelected ? -1 : 1);
            }
            return result;
            
        })        
        var checkboxes = document.getElementsByClassName("attachment-checkbox");
        for (var i=0; i<checkboxes.length; i++) {
            var ctarget = checkboxes[i];
            var attachmentId = ctarget.dataset.value; 
            var attachment = attachments.find(function(a) {
                return a.Id === attachmentId;
            })
            if(!attachment) {
                console.error("Can't find attachment for checkbox ", attachmentId);
            } else {
				ctarget.checked = attachment.isSelected; 
                attachment.isChecked = ctarget.checked;
            }
        }  
        // all work is done ... now update the UI by reloading the list into the component
        component.set("v.attachments", attachments);
    },
    fireLoadEmailDetailEvent : function(component) {
        var cmh18evt_AttachmentList = $A.get("e.c:cmh18evt_AttachmentList");
        var attachments = component.get("v.attachments");
        cmh18evt_AttachmentList.setParams({"attachments": attachments});
        cmh18evt_AttachmentList.fire();
	}, 
})