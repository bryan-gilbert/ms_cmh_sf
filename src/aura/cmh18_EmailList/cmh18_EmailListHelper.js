({
	loadList : function(component, helper) {
        var caseId = component.get("v.caseId");
        var action = component.get("c.getEmailMessageList");
        console.log("email list invoke load ...")
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	console.log("email list ... loaded callback ", theList);
				component.set("v.emails", theList);
				component.set("v.count", theList.length); 
                helper.emailSelected(component,helper);
                helper.collectAddress(component,helper);
            }
        });
        $A.enqueueAction(action);		
	},
	emailSelected : function(component, helper) {
        var selectedEmail = component.get("v.selectedEmail");
        console.log("selectedEmail", selectedEmail);        
        var theList = component.get("v.emails");
        theList.forEach(function(email) {
            email.displayClass = selectedEmail === email.Id ? 'selected_row' : 'unselected_row';
            //console.log("email id", email.Id , "vs", selectedEmail, " ", email.displayClass);
        });
        component.set("v.emails",theList);
	}, 	
    collectAddress : function(component,helper){
        var theList = component.get("v.emails");
        var all = "";
        theList.forEach(function(email) {
            all += email.ToAddress ? email.ToAddress +';': "";
            all += email.CcAddress ? email.CcAddress +';': "";
            all += email.FromAddress ? email.FromAddress +';': "";
        })
        var parts = all.split(';');
        parts = parts.map(function(a) {
            return a.trim();
        })
        parts.sort();
        var addresses = parts.filter(function(item, pos, ary) {
	        return !pos || item != ary[pos - 1];
	    });
        console.log("Add address", addresses);
        component.set("v.addresses",addresses);
        var globals = component.get("v.globals");
		globals.addresses = addresses;
    },
    
})