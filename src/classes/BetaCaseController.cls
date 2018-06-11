public with sharing class BetaCaseController {
    @AuraEnabled
    public static Case getCase(Id id) {
Case aCase = [
select Id
, ParentId
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
WHERE Id = :id
];
        return aCase;
    }
}