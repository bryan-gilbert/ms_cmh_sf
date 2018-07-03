trigger caseNextAction on Case (after update) {
  Set<Id> caseIds = new Set<Id>(); 
  
  for(Case aCase: trigger.new){
    Case beforeUpdate = System.Trigger.oldMap.get(aCase.Id);

    if(aCase.Next_action__c != null && aCase.Next_action__c != beforeUpdate.Next_action__c && !aCase.IsClosed)
    {
       if(!caseIds.contains(aCase.Id))
      {
	      caseIds.add(aCase.Id);
      }          
    }
  }
  if(!caseIds.isEmpty()) {     
  	CaseUtilities.handleNextActionChange(caseIds);
  }    
}