({    
    loadLists: function(component,helper) {
    try{
        var responses = 0;
        var data = {};
        console.log("load attachment lists");
        var caseId = component.get("v.caseId");
        var action1 = component.get("c.getAttachmentsForCase");
        action1.setParams({"caseId": caseId});
        helper.callAction(action1,function(attachments){
            responses++;
            data.attachments = attachments;
            console.log("Loaded attachments ", attachments.length)
            if(responses === 2) {
                helper.finish(component,data,caseId);
            }    
        });        
        var action2 = component.get("c.getDocumentLinksForCase");
        action2.setParams({"caseId": caseId});
        helper.callAction(action2,function(linkList){
            data.links = linkList;
            console.log("Loaded links ", linkList.length)
            var idList = linkList.map(function(cdLink) {
                return cdLink.ContentDocumentId
            });
            var action3 = component.get("c.getContentVersionList");
            action3.setParams({"idList": idList});
            helper.callAction(action3,function(docsList){
                responses++;
                data.documents = docsList;
                console.log("Loaded documents ", docsList.length)
                
                if(responses === 2) {
                    helper.finish(component,data,caseId);
                }    
            });      
        });   
    } catch(error) {
        console.err("Attachment loaded had error", error);
        alert(error);
    }   
    }, 
    callAction: function(action,callback) {
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                callback(response.getReturnValue());
            } else if (state === "ERROR") {
                var error = "Unknown Error";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
									error = errors[0].message;
                }
                throw error;
            }
        });
        $A.enqueueAction(action);        
    },      
    finish : function(component, data, caseId){
        var merged = [];
        console.log("attachments merge results");
        data.attachments.forEach(function(a) {
            merged.push({id: a.Id, 
                         name: a.Name, 
                         lastModifiedDate: a.LastModifiedDate, 
                         size: a.BodyLength, 
                         parentId: a.ParentId,
                         type: 'attachment',
                         parentIsCase: a.ParentId === caseId,
                         isAttachment: true,
                         isDocument: false
                        });
        })
        data.links.forEach(function(link) {
            // linkedDoc is a ContentVersion record
            var linkedDoc = data.documents.find(function(doc) {
                return doc.ContentDocumentId === link.ContentDocumentId;
            });
            merged.push({id: linkedDoc.Id,  // the id of the ContentVersion is used to send email
                         name: linkedDoc.PathOnClient, 
                         lastModifiedDate: linkedDoc.LastModifiedDate, 
                         size: linkedDoc.ContentSize, 
                         parentId: link.LinkedEntityId,
                         type: 'document',
                         parentIsCase: link.LinkedEntityId === caseId,
                         isAttachment: false,
                         isDocument: true,
                         // need ContentDocumentId to view the file in attachment list
                         contentDocId: linkedDoc.ContentDocumentId
                        });
        })
        data.allDocs = merged;
        console.log("attachments fire loaded event");

    	console.log("Fire cmh18evt_AttachmentsLoaded ", component.get("v.myCaseId"));
        var loadedEvent = $A.get("e.c:cmh18evt_AttachmentsLoaded");
        loadedEvent.setParams({"attachmentsData": data, "caseId": component.get("v.myCaseId")});
        loadedEvent.fire();
    },
/*
 * 
 *This is just a little complicated.  First the simple case is Attachments. These are simple objects that contain the file data
 and have a parent child relationship with Cases and/or Emails.  The server side controller retrieves all Attachments for the given
 Case and all EmailMessages that belong to the Case.

Attachment[] attachments = [select Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
    from Attachment WHERE ParentId in (select Id from EmailMessage where ParentId = :caseId)
];
Attachment[] caseAttachments = [select Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
    from Attachment WHERE ParentId = :caseId
]; 

The second way that SF now stores documents is with the Content Document system.  We start with a search of the ContentDocumentLink
table for all rows that belong to the Case or EmailMessages that belong to the Case.

List<ContentDocumentLink> caseLinks  = [SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId = :caseId];
List<ContentDocumentLink> emailLinks = [SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId in (select Id from EmailMessage where ParentId = :caseId)];

We then create a list of Ids (ContentDocumentId) and ask the server to search the ContentVersion table for all instances that have
ContentDocumentId in our list. 

List<ContentVersion> docs = [SELECT Id, ContentDocumentId, Title, PathOnClient, ContentSize
     , Checksum, FileExtension, FileType, LastModifiedDate FROM ContentVersion WHERE ContentDocumentId in :idList];   
    
We want to combine the Attachment and ContentVersion lists into one table for our user to see. We'll let our users select
any object in the combined table to include in any email they may want to send.  The SendEmail action sends a list of Ids, 
from our combined table.  Our custom email service needs to know 
if the Id belongs to an Attachment or a ContentVersion because it'll need to make a new copy or reference to this file 
and associate the new reference with the Email that is being sent.

In the finishing method we combine the two lists. Placing attachments into the list is easy but to add a 'document' we take
the data from the ContentVersion and use the LinedEntityId from the ContentDocumentLink as the ParentId. We also need
to add something to indicate which table provided the file: 'attachment' or 'document'.
	

*/
})