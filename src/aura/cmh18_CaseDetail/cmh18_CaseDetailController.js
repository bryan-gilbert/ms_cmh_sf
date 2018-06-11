({
	doInit : function(component, event, helper) {
        var action = component.get("c.getCase");
		action.setParams({"id": component.get("v.recordId")});
        action.setCallback(this, function(response){
            var state = response.getState();
            component.set("v.message", state);
            if (state === "SUCCESS") {
            	var theCase = response.getReturnValue();
				component.set("v.theCase", theCase);
				var properties =  [];
				properties.push({ 'label' : 'CaseNumber', 'value': theCase.CaseNumber});
				properties.push({ 'label' : 'Subject', 'value': theCase.Subject});
				properties.push({ 'label' : 'Status', 'value': theCase.Status});
				properties.push({ 'label' : 'Parent', 'value': theCase.Parent});
				properties.push({ 'label' : 'IsClosed', 'value': theCase.IsClosed});
				component.set("v.properties", properties);
            }
        });
        $A.enqueueAction(action);		
	}, 
})