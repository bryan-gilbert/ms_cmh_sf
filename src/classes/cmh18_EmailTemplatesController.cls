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
 public static List <BrandTemplate> getBrandTemplates() {
	List <BrandTemplate> templates = [ select Id, Name, Description, DeveloperName, IsActive, CreatedById, CreatedDate
, LastModifiedById, LastModifiedDate, Value from BrandTemplate ];
  return templates;
 }
}