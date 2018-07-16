@IsTest
public class cmh18apex_Tests {
    static testmethod void generalTests()
  {
	User user = cmh18apex_Server.fetchUser();
	
	user = cmh18apex_Server.updateUserData('Some data');
     System.assert(user.cmh18_data__c == 'Some data');
	
	cmh18apex_Server.fetchOrgEmail();
	
	Case aCase = new Case();
	aCase.Description = 'Case created as part of unit test';
	insert aCase;
	Attachment attachment = new Attachment();
	attachment.Body = Blob.valueOf('some content');
	attachment.Name = String.valueOf('test.txt');
	attachment.ParentId = aCase.Id; 
	insert attachment;
	
	ContentVersion cv = new ContentVersion();
	cv.ContentLocation = 'S';
	cv.VersionData = EncodingUtil.base64Decode('some content');
	cv.Title = 'filename';
	cv.PathOnClient = 'filename';
	insert cv;

	ContentDocumentLink cdl = new ContentDocumentLink();
	cdl.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id].ContentDocumentId;
	cdl.LinkedEntityId = aCase.Id;
	cdl.ShareType = 'V';
	insert cdl;

	cmh18apex_Server.getCase(aCase.Id);
	cmh18_AttachmentsController.getAttachmentsForCase(aCase.Id);
	cmh18_AttachmentsController.getDocumentsForCase(aCase.Id);
	List<ContentDocumentLink> linksForCase = cmh18_AttachmentsController.getDocumentLinksForCase(aCase.Id);
    List<Id> ids = new List<Id>();
    for (ContentDocumentLink aLink : linksForCase) {
        ids.add(aLink.ContentDocumentId);
    }        
    cmh18_AttachmentsController.getContentVersionList(ids);
	
	cmh18apex_Server.getEmailMessageList(aCase.Id);

    cmh18apex_Server.getCaseCommentList(aCase.Id);

      
             
    cmh18apex_Server.sendToTriage(aCase.Id);
    cmh18apex_Server.takeOwnerShip(aCase.Id);
    cmh18apex_Server.sendToTrash(aCase.Id);
    String segs = cmh18apex_Server.getCaseSegments();
    System.debug('getCaseSegments ' + segs);   

    String status = cmh18apex_Server.getCaseStatuses();
    String types = cmh18apex_Server.getCaseTypes();
    String priorities = cmh18apex_Server.getCasePriorities();
 
      
    cmh18apex_Server.updateCase(aCase.Id, '2018-09-14', extractFirstPick(priorities), extractFirstPick(segs), extractFirstPick(status), extractFirstPick(types));
      
      
	cmh18apex_Server.updateNextAction(aCase.Id, 'some new next action');

    cmh18apex_Server.addCaseComment(aCase.Id, 'some case comment text');

	cmh18apex_Email.getRef(aCase.Id);
    String testId = '500f4000006BPKWAA4';
    String aRef = cmh18apex_Email.getRef(testId);
    System.debug('What ref did we get' + aRef + ' from test id ' + testId); 
    //System.assertEquals(expected, aRef, 'Expected ref ' + expected + ' to match generated ' + aRef);

    String[] toList = new String[]{'foo'};
    String[] ccList = new String[]{'foo'};
    String[] bccList = new String[]{'foo'};
    String fromAddressOptional = null;
    String fromNameOptional = null;
    String caseId = aCase.Id;
    String subject = 'asdasdasda';
    String plainTextBody = 'asdasdasdasdas';
    String htmlBody ='<p>adfadfa</p>';
    String[] attachmentIdList = new String[]{attachment.Id};
    String[] documentIdList = new String[]{cdl.ContentDocumentId};
    cmh18apex_Email.sendEmailMessage(toList
     , ccList, bccList, fromAddressOptional
     , fromNameOptional, caseId, subject, plainTextBody
     , htmlBody, attachmentIdList, documentIdList
                                    );      
    
    EmailMessage em = new EmailMessage(ParentId = aCase.Id);
    insert em;
	cmh18apex_Server.getEmail(em.Id);
      
   	EmailTemplate[] templates = cmh18_EmailTemplatesController.getTemplates();
    cmh18_EmailTemplatesController.getFolders();
      if(templates.size() >0 ) {
          EmailTemplate t = templates[0];
          cmh18_EmailTemplatesController.getTemplate(t.Id,null,null);
      }
              
      
	} // end general tests	
    
    static String extractFirstPick(String picklist) {
        String[] elements = picklist.split(',');
        String[] first = elements[0].split(':');
        return first[0];
    }
}