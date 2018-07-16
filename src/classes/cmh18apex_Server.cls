public with sharing class cmh18apex_Server {
    @AuraEnabled
    public static EmailMessage[] getEmailMessageList(Id caseId) {
    	System.Debug(LoggingLevel.Info,'>>>>>> inside cmh18_CaseEmailListController "' + caseId  + '"');
        EmailMessage[] messages = [select Id, MessageDate, Subject, HasAttachment, Incoming
                                   , Status, FromAddress, FromName, ToAddress, CcAddress, BccAddress, IsDeleted
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
			select Id, Next_Action__c, ParentId, CaseNumber, CreatedDate, LastModifiedDate, Description, IsClosed, IsDeleted, Origin, OwnerId,Owner.Name, Priority
			, Reason, Status, Subject, Type, Segment__c , Follow_up_date__c , ClosedDate, AccountId, ContactId from Case WHERE Id = :caseId
		];
        return aCase;
    }
    
        @AuraEnabled
    /*
     * FollowUp: format is yyy-mm-dd or empty or null, All other inputs need to be strings (empty or otherwise)
     */
    public static Case updateCase(String caseId, String FollowUp, String Priority, String Segment, String Status, String Type) {        
		Case aCase = [
			select Id, Follow_up_date__c, Priority, Segment__c, Status, Type from Case WHERE Id = :caseId
		]; 
        aCase.Priority = Priority;
        aCase.Segment__c = Segment;
        aCase.Status = Status;
        aCase.Type = Type;
        if (!String.isBlank(FollowUp)) {
            aCase.Follow_up_date__c = Date.valueOf(FollowUp + ' 00:00:00');
        }
        update aCase;
        return aCase;
    }
    
   // Date fromdate = Date.valueOf('2008-01-01 00:00:00');
    private static String convertPickListToString(Schema.DescribeFieldResult fieldResult) {
        String result = '';
        Boolean needComma = false;
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();		
        for( Schema.PicklistEntry f : ple) {
            result += needComma ? ',':'';
            result += f.getLabel() + ':'+ f.getValue();
            needComma = true;
        }       
        return result;         
    }
    
        @AuraEnabled
    public static String getCaseSegments() {
        Boolean needComma = false;
        System.debug(Logginglevel.ERROR,'cmh18apex_Server getCaseSegments ');
        
	    Schema.DescribeFieldResult fieldResult = Case.Segment__c.getDescribe();
        return convertPickListToString(fieldResult);
    }    

        @AuraEnabled
    public static String getCaseStatuses() {
	    Schema.DescribeFieldResult fieldResult = Case.Status.getDescribe();
        return convertPickListToString(fieldResult);
    }    
        
        @AuraEnabled
    public static String getCaseTypes() {
	    Schema.DescribeFieldResult fieldResult = Case.Type.getDescribe();
        return convertPickListToString(fieldResult);
    }    
        @AuraEnabled
    public static String getCasePriorities() {
	    Schema.DescribeFieldResult fieldResult = Case.Priority.getDescribe();
        return convertPickListToString(fieldResult);
    }    
        
   @AuraEnabled 
    public static String sendToTriage( Id caseId) {       
    try {
        Group[] queues = [select Id, Name from Group where Name = 'Triage'];
        if (queues.size() == 0) {
            return 'There is no triage queue';
        }
        String triageQueueId = queues[0].Id;
        System.debug(Logginglevel.ERROR,'CaseUtilities triage owner ID: ' + triageQueueId);

        Case theCase = [SELECT Id, OwnerId FROM Case WHERE Id = :caseId];
        System.debug('sendToTriage case: ' +caseId + ' triageQueueId: '+ triageQueueId);
	    theCase.OwnerId = triageQueueId;
	    update theCase;
	    return null;
    } catch(DmlException e) {
        return 'An unexpected error has occurred: ' + e.getMessage();
    }        
    }
    
   @AuraEnabled 
    public static String takeOwnerShip( Id caseId) {       
    try {
        String userId = userInfo.getUserId();
        Case theCase = [SELECT Id, OwnerId FROM Case WHERE Id = :caseId];
        System.debug('takeOwnerShip case: ' +caseId + ' userId: '+ userId);
	    theCase.OwnerId = userId;
	    update theCase;
	    return null;
    } catch(DmlException e) {
        return 'An unexpected error has occurred: ' + e.getMessage();
    }        
    } 
    
   @AuraEnabled 
    public static String sendToTrash( Id caseId) {       
    try {
        String userId = userInfo.getUserId();
        Case theCase = [SELECT Id, Type, Status, OwnerId FROM Case WHERE Id = :caseId];
        System.debug('sendToTrash case: ' +caseId + ' userId: '+ userId);
	    theCase.OwnerId = userId;
        theCase.Status = 'Closed';
        theCase.Type = 'Spam';
	    update theCase;
	    return null;
    } catch(DmlException e) {
        return 'An unexpected error has occurred: ' + e.getMessage();
    }        
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
    public static Case updateNextAction( Id caseId, String nextAction) {       
    try {
        Case theCase = [SELECT Id, next_action__c FROM Case WHERE Id = :caseId];
        System.debug('updateNextAction ' +caseId + ' old/new ' + case.next_action__c +'/' +nextAction);
	    theCase.next_action__c = nextAction;
	    update theCase;
	    return theCase;
    } catch(DmlException e) {
        System.debug('An unexpected error has occurred: ' + e.getMessage());
        return null;
    }        
    }
    
    @AuraEnabled 
    public static void addCaseComment( Id caseId, String commentBody) {       
    try {
        CaseComment cc = new CaseComment(CommentBody=commentBody,ParentID=caseId);
        insert(cc);
    } catch(DmlException e) {
        System.debug('An unexpected error has occurred: ' + e.getMessage());
    }        
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