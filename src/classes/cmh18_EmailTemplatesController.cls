public class cmh18_EmailTemplatesController {
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
 public static List<String> getTemplate(Id templateId, Id whoId, Id whatId) {
	List <EmailTemplate> templateList = [select TemplateType, Body, HtmlValue from EmailTemplate where Id = :templateId];
	if (templateList.isEmpty())
	{
		return null;
	}	
	EmailTemplate t = templateList[0];
	system.debug('getTemplate ' +  t.TemplateType);
	List <String> bodies = new List<String>();
  	bodies.add(t.Body);  
  	if (t.TemplateType == 'html') {
  		bodies.add(t.HtmlValue);
  	}           
	List<Messaging.RenderEmailTemplateBodyResult> resList = Messaging.renderEmailTemplate(whoId, whatId, bodies);
	List <String> results = new List<String>();
	 for(integer i = 0; i<resList.size();i++){
	 	Messaging.RenderEmailTemplateBodyResult result = resList[i];
	 	system.debug('getTemplate-2 ' + i + ': ' + result.getSuccess());
	 	if(result.getSuccess()) {
	 		results.add(result.getMergedBody());
	 	} else {
	 		String errMsg = '';
	 		List<Messaging.RenderEmailTemplateError> errs = result.getErrors();
	 		for (Messaging.RenderEmailTemplateError err : errs) {
	 			errMsg += err.getMessage() + '. ';
	 		}
	 		system.debug('getTemplate- errors ' + errMsg);
	 	}
	 }
 	return results;
 }
 
}