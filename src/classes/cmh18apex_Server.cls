public with sharing class cmh18apex_Server {
    @AuraEnabled
    public static EmailMessage[] getEmailMessageList(Id caseId) {
    	System.Debug(LoggingLevel.Info,'>>>>>> inside cmh18_CaseEmailListController "' + caseId  + '"');
        EmailMessage[] messages = [select Id, MessageDate, Subject, HasAttachment, Incoming
                                   , Status, FromAddress, FromName, ToAddress, CcAddress, BccAddress, IsDeleted
                                   , RelatedToId
            from EmailMessage WHERE ParentId = :caseId ORDER BY MessageDate DESC
    	];
        return messages;    
    }
    
    @AuraEnabled
    public static CaseComment[] getCaseCommentList(Id caseId) {
        CaseComment[] comments = [select Id, CommentBody, LastModifiedDate, LastModifiedBy.Name, ParentId from CaseComment WHERE ParentId = :caseId ORDER BY LastModifiedDate DESC
    	];
        if(comments.size() > 0)
        System.debug('Case comments' + comments[0]);
        return comments;    
    }
    
        @AuraEnabled
    public static Case getCase(String caseId) {
		Case aCase = [
			select Id, Next_Action__c, ParentId, CaseNumber, CreatedDate, Description, IsClosed, IsDeleted, Origin, OwnerId, Priority
			, Reason, Status, Subject, Type, ClosedDate, AccountId, ContactId from Case WHERE Id = :caseId
		];
        return aCase;
    }
    
   @AuraEnabled 
    public static user fetchUser(){
     // query current user information  
      User oUser = [select Id
        ,Name,TimeZoneSidKey,Username
        , cmh18_data__c
        , Alias,Country,Email,FirstName,LastName,IsActive
        , UserRoleId, UserType , SmallBannerPhotoUrl, SmallPhotoUrl, ProfileId
        FROM User Where Id =: userInfo.getUserId()];
        return oUser;
    }
    
    @AuraEnabled 
    public static user updateUserData( String theData) {       
    try {
        User user = [SELECT Id, cmh18_data__c FROM User WHERE Id =: userInfo.getUserId()];
        System.debug('updateUserData ' + userInfo.getUserId() + ' old/new ' + user.cmh18_data__c +'/' +theData);
	    user.cmh18_data__c = theData;
	    update user;
	    return cmh18apex_Server.fetchUser();
    } catch(DmlException e) {
        System.debug('An unexpected error has occurred: ' + e.getMessage());
        return null;
    }        
    }
    
   @AuraEnabled 
    public static List<OrgWideEmailAddress> fetchOrgEmail(){
    // query first OrgWideEmailAddress
        List<OrgWideEmailAddress> orgEmail = [ select Id, Address, DisplayName from OrgWideEmailAddress];
        return orgEmail;
    }    
    
        @AuraEnabled
    public static EmailMessage getEmail(Id id) {
	EmailMessage eMsg = [
	select Id, ToAddress, FromAddress, FromName, CcAddress, HasAttachment, MessageDate, Status, Subject, HtmlBody, TextBody from EmailMessage 	WHERE Id = :id	];
    return eMsg;
    }
}