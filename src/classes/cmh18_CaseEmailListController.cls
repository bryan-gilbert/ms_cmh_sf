public with sharing class cmh18_CaseEmailListController {
    @AuraEnabled
    public static EmailMessage[] getList(Id caseId) {
    	System.Debug(LoggingLevel.Info,'>>>>>> inside cmh18_CaseEmailListController "' + caseId  + '"');
        EmailMessage[] messages = [select Id, MessageDate, Subject, HasAttachment, Incoming
                                   , Status, FromAddress, FromName, ToAddress, CcAddress, BccAddress, IsDeleted
                                   , RelatedToId
            from EmailMessage WHERE ParentId = :caseId ORDER BY MessageDate DESC
    	];
        return messages;    
    }
}