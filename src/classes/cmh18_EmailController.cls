public with sharing class cmh18_EmailController {
    @AuraEnabled
    public static EmailMessage getEmail(Id id) {
	EmailMessage eMsg = [
select 
Id
, ToAddress
, FromAddress
, FromName
, CcAddress
, HasAttachment
, MessageDate
, Status
, Subject
, HtmlBody
, TextBody
 from EmailMessage
 	WHERE Id = :id
	];
    return eMsg;
    }
}