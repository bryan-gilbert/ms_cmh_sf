({
    selectSort : function(component, event, helper) {
        var emailId = component.get("v.emailId");
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
                console.log("d1/d2", d1, d2);
                result = d1.getTime() - d2.getTime();  
                console.log("sort", result, a.LastModifiedDate, b.LastModifiedDate);
            } else {
                result = (a.isSelected ? -1 : 1);
            }
            return result;
            
        })
        component.set("v.attachments", attachments);
    },
})