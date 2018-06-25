({
    selectSort : function(component, event, helper) {
        var emailId = component.get("v.emailId");
        var checkSelected = component.get("v.checkSelected");
        var elements = document.getElementsByClassName("attachment-checkbox");
        for (var i=0; i<elements.length; i++) {
            var ctarget = elements[i];
            ctarget.checked = false;
        }        
        
        console.log("Attachment list respond to view email event", emailId);
        var attachments = component.get("v.attachments");
        attachments.forEach(function(a) {
            a.isSelected = emailId && emailId === a.parentId;
            if(checkSelected) {
                a.isChecked = a.isSelected;
            }
        })   
        attachments.sort(function(a,b) {
            var result = 0;
            if ((a.isSelected && b.isSelected) || (!a.isSelected && !b.isSelected)) {
                var d1 = new Date(a.lastModifiedDate);
                var d2 = new Date(b.lastModifiedDate);
                //console.log("d1/d2", d1, d2);
                result = d1.getTime() - d2.getTime();  
                //console.log("sort", result, a.LastModifiedDate, b.LastModifiedDate);
            } else {
                result = (a.isSelected ? -1 : 1);
            }
            return result;
            
        })        
        var checkboxes = document.getElementsByClassName("cev_attachment_checkbox");
        console.log("In attachment list and have how many checkboxes? ", checkboxes.length);
        for (var i=0; i<checkboxes.length; i++) {
            var ctarget = checkboxes[i];
            var attachmentId = ctarget.dataset.value; 
            var attachment = attachments.find(function(a) {
                return a.id === attachmentId;
            })
            if(!attachment) {
                console.error("Can't find attachment for checkbox ", attachmentId);
            } else {
				ctarget.checked = attachment.isChecked; 
            }
        }  
        // all work is done ... now update the UI by reloading the list into the component
        component.set("v.attachments", attachments);
        var show = component.get("v.showCheckBoxes");
        component.set("v.showCheckBoxes", ! show);
        component.set("v.showCheckBoxes", show);
    },
    fireAttachmentListEvent : function(component) {
        var cmh18evt_AttachmentList = $A.get("e.c:cmh18evt_AttachmentList");
        var attachments = component.get("v.attachments");
        cmh18evt_AttachmentList.setParams({"attachments": attachments});
        cmh18evt_AttachmentList.fire();
	}, 
    checkboxesDisplay : function(component,helper){
        var checkboxes = document.getElementsByClassName("cev_attachment_checkbox");
        var show = component.get("v.showCheckBoxes");
        console.log("In checkboxesDisplay" + show + " have how many checkboxes? ", checkboxes.length);
        for (var i=0; i<checkboxes.length; i++) {
            var ctarget = checkboxes[i];
            //console.log("ctarget ", ctarget.getAttribute("data-value"));
            if(show)
            ctarget.removeAttribute("disabled");            
            else 
            ctarget.setAttribute("disabled", "disabled");            
        }         
    }, 
})