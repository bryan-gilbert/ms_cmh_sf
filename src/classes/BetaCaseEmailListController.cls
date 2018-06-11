public with sharing class BetaCaseEmailListController {
    @AuraEnabled
    public static EmailMessage[] getList(Id caseId) {
    	System.Debug(LoggingLevel.Info,'>>>>>> inside BetaCaseEmailListController "' + caseId  + '"');
    	//EmailMessage[] messages = [select Id, ParentId, Status, Subject, ToAddress, ValidatedFromAddress from EmailMessage WHERE ParentId = :caseId];
    	EmailMessage[] messages = [select Id, ParentId, Status, Subject, ToAddress, ValidatedFromAddress from EmailMessage
    	WHERE ParentId = :caseId
    	];
        return messages;    
    }
}