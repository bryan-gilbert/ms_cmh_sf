public with sharing class cmh18_AttachmentsController {
    @AuraEnabled
    public static Attachment[] getAttachmentsForCase(Id caseId) {
    	System.Debug(LoggingLevel.Info,'>>>>>> inside getAttachmentsForCase "' + caseId  + '"');
        Attachment[] attachments = [select Id, ParentId,  Name, Description, BodyLength, OwnerId, LastModifiedDate 
			from Attachment WHERE ParentId in
(select Id from EmailMessage where ParentId = :caseId)
    	];
        return attachments;    
    }
}