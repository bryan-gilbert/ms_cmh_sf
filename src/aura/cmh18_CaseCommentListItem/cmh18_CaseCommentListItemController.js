({
    doInit : function(component, event, helper) {


	}, 
    viewEmail : function(component, event, helper) {
        var ctarget = event.currentTarget;
        var emailId = ctarget.dataset.value;
        console.log("In case comment list item view click handlers with id ", emailId);
//        helper.fireLoadEmailDetailEvent(emailId);
//        helper.fireCaseEmailEditEvent("close",null,emailId);
//        helper.fireCaseEmailDetailEvent(emailId);
    }, 
})