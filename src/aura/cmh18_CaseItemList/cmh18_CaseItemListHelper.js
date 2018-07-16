({
	loadList : function(component, helper) {
        var caseId = component.get("v.caseId");
        console.log("Email and CaseComment list invoke load ...", caseId)
        var actionEmails = component.get("c.getEmailMessageList");
        var actionComments = component.get("c.getCaseCommentList");
		actionEmails.setParams({"caseId": caseId});
		actionComments.setParams({"caseId": caseId});
        var responseCnt = 0;
        actionEmails.setCallback(this, function(response){
            var state = response.getState();
            responseCnt++;
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	console.log("email list ... loaded callback ", theList);
				component.set("v.emails", theList);
                helper.collectAddress(component,helper);
                if(responseCnt == 2){
                    helper.mergeLists(component,helper);
                }
            }
        });
        actionComments.setCallback(this, function(response){
            var state = response.getState();
            responseCnt++;
            if (state === "SUCCESS") {
            	var theList = response.getReturnValue();
            	console.log("comments list ... loaded callback ", theList);
                helper.modifyCaseComments(component,helper,theList);
                if(responseCnt == 2){
                    helper.mergeLists(component,helper);
                }
            }
        });
        $A.enqueueAction(actionComments);		
        $A.enqueueAction(actionEmails);		
	},
    mergeLists : function(component,helper) {
        console.log("mergeLists emails and comments");
		var comments = component.get("v.comments");
		var emails = component.get("v.emails");
        var merged = [];
        emails.forEach(function(a) {
            a.isEmail = true;
            a.date = a.MessageDate;
            merged.push(a);
        });
        comments.forEach(function(a) {
            a.isEmail = false;
            a.date = a.LastModifiedDate;
            merged.push(a);
        });
        merged.sort(function(a,b){
         return new Date(b.date) - new Date(a.date);            
        })
        component.set("v.items", merged);
        component.set("v.count", merged.length); 
        helper.itemSelected(component,helper);
 
    },
	itemSelected : function(component, helper) {
        var selectedItemId = component.get("v.selectedItemId");
        console.log("selectedItemId", selectedItemId);        
        var theList = component.get("v.items");
        theList.forEach(function(item) {
            item.displayClass = selectedItemId === item.Id ? 'selected_row' : 'unselected_row';
            //console.log("email id", email.Id , "vs", selectedEmail, " ", email.displayClass);
        });
        component.set("v.items",theList);
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
	        return item.length > 0 && (!pos || item != ary[pos - 1]);
	    });
        console.log("Add address", addresses);
        component.set("v.addresses",addresses);
        var globals = component.get("v.globals");
		globals.addresses = addresses;
    },
    modifyCaseComments : function(component,helper,theList) {
        var re = /(.*)\n/g;
        var shortLineLimit= 4;
        theList.forEach(function(comment){
            var parts = comment.CommentBody.split('\n');
            var short = parts.slice(0,shortLineLimit);
            if(parts.length>shortLineLimit){
                short.push("...");
            }
            comment.firstLine = short.shift();
            comment.shortBody = short.join('\n').replace(re, '<p>$1</p>');;
            var htmlBody = comment.CommentBody.replace(re, '<p>$1</p>'); 
            comment.htmlBody = htmlBody;            
        })
        component.set("v.comments", theList);
        
    }
    
})