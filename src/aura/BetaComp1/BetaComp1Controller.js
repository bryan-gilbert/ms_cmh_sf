({
    doInit : function(component,event,helper) {
        var action = component.get("c.getDocumentsForCase");
        action.setParams({'caseId':'500f4000006Auf8AAC'});
        action.setCallback(this, function(response){
            var state = response.getState();
            var results ={};
            if (state === "SUCCESS") {
                var theResponse = response.getReturnValue();
                console.log("documents: ", theResponse);
            }
            else if (state === "INCOMPLETE") {
                results.errorMessage = "Call to server to send email comes back incomplete. What happened?";
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                    results.errorMessage ="Error message: " + errors[0].message;
                    }
                } else {
                    results.errorMessage ="Unknown error";
                }
            }            
        });
        $A.enqueueAction(action);
    }
})