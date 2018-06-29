@IsTest
public class cmh18apex_Tests {
    static testmethod void generalTests()
  {
	cmh18apex_Server.fetchUser();
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
	cmh18_AttachmentsController.getDocumentLinksForCase(aCase.Id);
	
	cmh18apex_Server.getEmailMessageList(aCase.Id);

    cmh18apex_Server.getCaseCommentList(aCase.Id);

	cmh18apex_Email.getRef(aCase.Id);
      

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
    
    EmailMessage em = new EmailMessage();
    insert em;
	cmh18apex_Server.getEmail(em.Id);
      
   	EmailTemplate[] templates = cmh18_EmailTemplatesController.getTemplates();
    cmh18_EmailTemplatesController.getFolders();
      if(templates.size() >0 ) {
          EmailTemplate t = templates[0];
          cmh18_EmailTemplatesController.getTemplate(t.Id,null,null);
      }
              
      
	} // end general tests	
}