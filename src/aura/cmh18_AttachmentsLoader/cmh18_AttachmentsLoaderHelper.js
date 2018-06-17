({
	load : function(component, event, helper) {
        var caseId = component.get("v.caseId");
        console.log("In attachment loader init id: ", caseId);
        var action = component.get("c.getAttachmentsForCase");
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("In attachments loaded callback id/status: " + caseId + "/" + status);
            var data = {};
            if (state === "SUCCESS") {                
            	var theList = response.getReturnValue();
                var eMap = {};
                data.attachments = theList;
                data.emailToAttachmentMap = eMap;
                theList.forEach(function(attachment) {
                    var eList = eMap[attachment.ParentId] || [];
                    eList.push(attachment);
                    eMap[attachment.ParentId] = eList;
                })
                data.count = theList.length;
            } else if (state === "ERROR") {
                data.error = "Unknown Error";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
					data.error = errors[0].message;
                }
            }
            var globals = component.get("v.globals");
            globals.attachmentsData = data;
            console.log("mmaps", globals.attachmentsData.emailToAttachmentMap);
            component.set("v.attachments", globals.attachmentsData.attachments);
            component.set("v.count", globals.attachmentsData.count);
            var loadedEvent = $A.get("e.c:cmh18_AttachmentsLoadedEvent");
            loadedEvent.setParams({"attachmentsData": data});
            loadedEvent.fire();
        });
        $A.enqueueAction(action);	        
	},
})