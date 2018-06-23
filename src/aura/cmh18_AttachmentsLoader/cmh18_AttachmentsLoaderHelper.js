({
    origloadList: function(component,helper) {
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
                data.attachments = theList;
                // Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
            } else if (state === "ERROR") {
                data.error = "Unknown Error";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
					data.error = errors[0].message;
                }
            }
            var loadedEvent = $A.get("e.c:cmh18_AttachmentsLoadedEvent");
            loadedEvent.setParams({"attachmentsData": data});
            loadedEvent.fire();
        });
        $A.enqueueAction(action);        
    },
    loadList: function(action,caseId,callback) {
		action.setParams({"caseId": caseId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                callback(null,response.getReturnValue());
            } else if (state === "ERROR") {
                var error = "Unknown Error";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
					error = errors[0].message;
                }
                callback(error);
            }
        });
        $A.enqueueAction(action);        
    },  
    loadLists: function(component,helper) {
        var caseId = component.get("v.caseId");
        var action1 = component.get("c.getAttachmentsForCase");
        var action2 = component.get("c.getDocumentsForCase");
        var responses = 0;
        var data = {};
        helper.loadList(action1,caseId,function(err,list){
            responses++;
            if(err) {
                return errHandler(err);
            }
            else {
                data.attachments = list;
            }
            if(responses>1) {
                helper.finish(data);
            }    
        });
        helper.loadList(action2,caseId,function(err,list){
            responses++;
            if(err) {
                return errHandler(err);
            }
            else {
                data.documents = list;
            }
            if(responses>1) {
                helper.finish(data);
            }    
        });        
    },  
    finish : function(data){
        // Attachments: Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
        // Documents:  Id, ContentDocumentId, Title, PathOnClient, ContentSize
        //     , Checksum, FileExtension, FileType, LastModifiedDate FROM ContentVersion
        var merged = [];
        data.attachments.forEach(function(a) {
            merged.push({Id: a.Id, Name: a.Name, LastModifiedData: a.LastModifiedData, Size: a.BodyLength});
        })
        data.documents.forEach(function(d) {
            merged.push({Id: d.Id, Name: d.PathOnClient, LastModifiedData: d.LastModifiedData, Size: d.ContentSize});
        })
        data.allDocs = merged;
        var loadedEvent = $A.get("e.c:cmh18_AttachmentsLoadedEvent");
        loadedEvent.setParams({"attachmentsData": data});
        loadedEvent.fire();
    },
    errHandler : function(err){
        console.err("Attachment loaded had error", err);
        alert(err);
    }

})