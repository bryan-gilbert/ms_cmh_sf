public  class CaseUtilities {
  
  /*
  * caseIds: Ids of all Cases that have changed next action. We'll create a case comment with the content of the next action to
  * record this important information.  Next_Action_c is a long text field and Salesforce History tracking can only record
  * changes on this field, not content.  Since the content is important we want a case comment.
  */
  public static void handleNextActionChange(Set<Id> caseIds)
  {
    if(!caseIds.isEmpty()) {          
      List<CaseComment> newComments = new List<CaseComment>();
      String qString = 'Select Id, CaseNumber, Next_Action__c From Case c where c.Id in :caseIds';
      Case[] objects = Database.query(qString);    
      for (Case aCase : objects) { 
      	String body = 'Changed Next Action\n' + aCase.Next_Action__c;
        CaseComment cc = new CaseComment(CommentBody=body,ParentID=aCase.Id);
        newComments.add(cc);
		system.debug(Logginglevel.ERROR,'handleNextActionChange : case number: ' + aCase.CaseNumber + '\n');        
      }  
      insert newComments;
    }
  }  
  /*
  * caseIds: Ids of all Cases that have new parentId
  * newParentIds: Ids of all Cases that have new parentId
  */
  public static void handleCaseDuplicate(Set<Id> caseIds,Map<Id, Id> newParentIds)
  {
    if(!caseIds.isEmpty()) {          
      List<CaseComment> newComments = new List<CaseComment>();
      List<Attachment>  attachmentsToUpdate = new List<Attachment>();
	  List<ContentDocumentLink>  theContentDocumentLinkList2Insert = new List<ContentDocumentLink>();         
      String qString = 'Select Id, CaseNumber, '+ //
      '(Select Id, ParentId, TextBody, Subject, FromName, FromAddress, ToAddress, '+//
      'CcAddress, BccAddress, Incoming,  MessageDate  From EmailMessages) ' + // 
      ' From Case c where c.Id in :caseIds';
      Case[] objects = Database.query(qString);    
      for (Case aCase : objects) 
      { 
        Id newParentId = newParentIds.get(aCase.Id);

  
        String str = 'Case ' + aCase.CaseNumber  //
          + ' has been added as a child case (see related cases below).\n';
        
        // copy attachment records  
        List<Attachment>  attachments = [Select id, ParentId, Name, CreatedDate, IsPrivate, ContentType, Body, OwnerId from Attachment where ParentId = :aCase.Id and IsDeleted = false];
        str +=   'Plus ' + attachments.size() + ' attached files have been moved to this case: \n';
        for(Attachment a : attachments){
          Attachment a2 = new Attachment(
          ParentId = newParentId, 
          Name = a.Name, 
          IsPrivate = a.IsPrivate, 
          ContentType = a.ContentType, 
          Body  = a.Body, 
          OwnerId = a.OwnerId
          );
          attachmentsToUpdate.add(a2);
          str += 'Name: "' + a.Name + '"  Created on: ' + a.CreatedDate + '\n'; 
        }
          
        // link file records  
        List<ContentDocumentLink>  theContentDocumentLinkList = new List<ContentDocumentLink>([SELECT Id, LinkedEntityId, ContentDocumentId, ShareType, Visibility FROM ContentDocumentLink WHERE LinkedEntityId = :aCase.Id and IsDeleted = false]);
        str +=   'Plus ' + theContentDocumentLinkList.size() + ' files have been linked to this case: \n';
        for(ContentDocumentLink a : theContentDocumentLinkList){
          ContentDocumentLink a2 = new ContentDocumentLink(
          LinkedEntityId = newParentId, 
          ContentDocumentId = a.ContentDocumentId, 
          ShareType = a.ShareType, 
          Visibility  = a.Visibility
          );
          theContentDocumentLinkList2Insert.add(a2); 
        }         

        str = str + '______________________________________________________________________\n';
        str +=   'Here are snippets of the emails attached to this case.\n\n';      

        for (EmailMessage msg : aCase.EmailMessages) { 
          str = str + '______________________________________________________________________\n';
          str = str +  EmailUtilities.emailToString(msg) + '\n\n';
        }
        
        
        // http://www.salesforce.com/us/developer/docs/api/Content/sforce_api_objects_casecomment.htm
        // The maximum size of the comment body is 4000 bytes.
        str = StringUtils.topLines(str, 2000, 3900);
        CaseComment cc = new CaseComment(CommentBody=str,ParentID=newParentId);
        newComments.add(cc);
system.debug(Logginglevel.ERROR,'handleCaseDuplicate : case number: ' + aCase.CaseNumber + '\n' + str);
        
      }  
      insert newComments;
      insert attachmentsToUpdate;
      insert theContentDocumentLinkList2Insert;
    }
  }
  
}