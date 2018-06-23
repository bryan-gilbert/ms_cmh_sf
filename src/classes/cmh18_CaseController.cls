public with sharing class cmh18_CaseController {
    @AuraEnabled
    public static Case getCase(String caseId) {
Case aCase = [
select Id, ParentId
, CaseNumber
, CreatedDate
, Description
, IsClosed
, IsDeleted
, Origin
, OwnerId
, Priority
, Reason
, Status
, Subject
, Type
, ClosedDate
, AccountId
, ContactId
 from Case
WHERE Id = :caseId
];
        return aCase;
    }
}