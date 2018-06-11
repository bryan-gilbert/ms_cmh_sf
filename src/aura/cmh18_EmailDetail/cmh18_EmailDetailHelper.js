({
	helperMethod : function(component, data) {
		console.log("Load email record", data);
        var action = component.get("c.getEmail");
		action.setParams({"id": data});
        action.setCallback(this, function(response){
            var state = response.getState();
			component.set("v.isLoaded", false);
			var msg = "";
            if (state === "SUCCESS") {                
				component.set("v.isLoaded", true);
            	var theEmail = response.getReturnValue();
				component.set("v.id", theEmail.Id);
				component.set("v.to", theEmail.ToAddress);
				component.set("v.cc", theEmail.CcAddress);
				component.set("v.from", theEmail.FromName);
				component.set("v.fromAdress", theEmail.FromAddress);
				component.set("v.date", theEmail.MessageDate);
				component.set("v.hasAttachments", theEmail.HasAttachment);
				component.set("v.status", theEmail.Status);
				component.set("v.subject", theEmail.Subject);
                if(theEmail.HtmlBody && theEmail.HtmlBody.length > 0){
					component.set("v.body", theEmail.HtmlBody);
                }
                else {
                    var text = theEmail.TextBody.replace(/\n/g,"<br/>");
					component.set("v.body", text);
                }
            } else if (state === "ERROR") {
                msg = "Error";
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    msg = errors[0].message;
                }
            }
            component.set("v.error", msg);
        });
        $A.enqueueAction(action);		        
	}
})