public with sharing class cmh18_EmailTemplatesController {
   @AuraEnabled
 public static List<EmailTemplate> getTemplates() {
  List <EmailTemplate> templates = [
  	SELECT Id, BrandTemplateId, FolderId, Name, OwnerId, Subject, LastModifiedDate, TemplateStyle, TemplateType, UiType from EmailTemplate
  ];
  return templates;
 }

   @AuraEnabled
 public static List <Folder> getFolders() {
	List <Folder> folders = [SELECT Id, Name from Folder Where Type = 'Email' ];
	return folders;
 }

   @AuraEnabled
 public static List<String> getTemplate(String templateId, Id whoId, Id whatId) {
    // If rendering succeeds the results will contain the rendered Subject, Text Body and the optional Html Body
    List <String> results = new List<String>();
    system.debug(LoggingLevel.Debug,'cmh18_EmailTemplatesController.getTemplate t-w-w' +  templateId + ' - ' + whoId + ' - ' + whatId);
    List <EmailTemplate> templateList = [select TemplateType, Subject, Body, HtmlValue from EmailTemplate where Id = :templateId];
    if (templateList.isEmpty()) {
        system.debug(LoggingLevel.Debug,'cmh18_EmailTemplatesController.getTemplate empty' +  templateId);
        return null;
    }	
    EmailTemplate t = templateList[0];
    system.debug(LoggingLevel.Debug,'cmh18_EmailTemplatesController.getTemplate ' +  t.TemplateType);
    List <String> bodies = new List<String>();
    bodies.add(t.Subject);  
    bodies.add(t.Body);  
    if (t.TemplateType == 'html') {
        bodies.add(t.HtmlValue);
        system.debug(LoggingLevel.Debug,'cmh18_EmailTemplatesController have html content');
    }           
    system.debug(LoggingLevel.Error,'cmh18_EmailTemplatesController render ... ');
    List<Messaging.RenderEmailTemplateBodyResult> resList = Messaging.renderEmailTemplate(whoId, whatId, bodies);
    system.debug(LoggingLevel.Debug,'cmh18_EmailTemplatesController render list ' + resList.size());
    for(integer i = 0; i<resList.size();i++){
        Messaging.RenderEmailTemplateBodyResult result = resList[i];
        system.debug(LoggingLevel.Debug,'cmh18_EmailTemplatesController results ' + i + ': ' + result.getSuccess());
        if(result.getSuccess()) {
            results.add(result.getMergedBody());
        } else {
            String errMsg = '';
            List<Messaging.RenderEmailTemplateError> errs = result.getErrors();
            for (Messaging.RenderEmailTemplateError err : errs) {
                errMsg += err.getMessage() + '. ';
            }
            system.debug(LoggingLevel.Error,'getTemplate- errors ' + errMsg);
        }
    }
    return results;
 }
 
}