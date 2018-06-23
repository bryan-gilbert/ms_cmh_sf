public with sharing class cmh18apex_DocumentsController {
    /* cmh18apex_DocumentsController.getAttachmentsForCase('500f4000006Auf8AAC')
     */
    @AuraEnabled
    public static ContentDocument[] getDocumentsForCase(Id caseId) {        
    List<ContentDocumentLink> cdls = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = '500f4000006Auf8AAC'];
        List<Id> ids = new List<Id>();
    for (ContentDocumentLink cdl : cdls) {
    ids.add(cdl.ContentDocumentId);
    }        
    List<ContentDocument> docs = [SELECT Id, Title, ContentModifiedDate, ContentSize, FileExtension, FileType, ParentId FROM ContentDocument WHERE Id in :ids];   
    return docs;    
    }
}