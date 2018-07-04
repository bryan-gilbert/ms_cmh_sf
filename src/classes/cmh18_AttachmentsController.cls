public with sharing class cmh18_AttachmentsController {
    @AuraEnabled
    public static Attachment[] getAttachmentsForCase(Id caseId) {
    	System.Debug(LoggingLevel.Info,'>>>>>> inside getAttachmentsForCase "' + caseId  + '"');
        Attachment[] attachments = [select Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
			from Attachment WHERE ParentId in (select Id from EmailMessage where ParentId = :caseId)
    	];
        Attachment[] caseAttachments = [select Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
			from Attachment WHERE ParentId = :caseId
       ]; 
        List<Attachment> allAttachments = new List<Attachment>();
        allAttachments.addAll(attachments);
        allAttachments.addAll(caseAttachments);
        return allAttachments;    
    }
    
    @AuraEnabled
    public static ContentDocumentLink[] getDocumentLinksForCase(Id caseId) {        
    	System.Debug(LoggingLevel.Info,'>>>>>> inside getDocumentLinksForCase "' + caseId  + '"');
        List<ContentDocumentLink> caseLinks  = [SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId = :caseId];
        List<ContentDocumentLink> emailLinks = [SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId in (select Id from EmailMessage where ParentId = :caseId)];
        List<ContentDocumentLink> allLinks = new List<ContentDocumentLink>();
        allLinks.addAll(caseLinks);
        allLinks.addAll(emailLinks);       
        return allLinks;    
    }
        
    @AuraEnabled
    public static ContentVersion[] getContentVersionList(List<String> idList) {        
    	System.Debug(LoggingLevel.Info,'>>>>>> inside getDocuments "' + idList.size()  + '"');
        List<ContentVersion> docs = [SELECT Id, ContentDocumentId, Title, PathOnClient, ContentSize
             , Checksum, FileExtension, FileType, LastModifiedDate FROM ContentVersion WHERE ContentDocumentId in :idList];   
        return docs;    
    }
        
    @AuraEnabled
    public static ContentVersion[] getDocumentsForCase(Id caseId) {        
    	System.Debug(LoggingLevel.Info,'>>>>>> inside getDocumentsForCase "' + caseId  + '"');
        List<ContentDocumentLink> cdls = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :caseId];
        List<Id> ids = new List<Id>();
        for (ContentDocumentLink cdl : cdls) {
            ids.add(cdl.ContentDocumentId);
        }        
        List<ContentVersion> docs = [SELECT Id, ContentDocumentId, Title, PathOnClient, ContentSize
             , Checksum, FileExtension, FileType, LastModifiedDate FROM ContentVersion WHERE ContentDocumentId in :ids];   
        return docs;    
    }
    
}