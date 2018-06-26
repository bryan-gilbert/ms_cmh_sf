({
	doInit : function(component, event, helper) {
		var emailAddresses = [];
        for(var i = 1; i< 5; i++)  {
            emailAddresses.push('customer'+i+'@customer.com');
        }
        for(var i = 1; i< 5; i++)  {
            emailAddresses.push('orderDesk'+i+'@manufacter.com');
        }
        for(var i = 1; i< 5; i++)  {
            emailAddresses.push('staff'+i+'@mycompany.com');
        }
        var toInput = component.find("toInput");
        var ccInput = component.find("ccInput");
        var bccInput = component.find("bccInput");
        toInput.setList(emailAddresses);
        ccInput.setList(emailAddresses);
        bccInput.setList(emailAddresses);
	},
    bevt_AutocompleteList : function(component,event,helper) {
        var autoCompleteId = event.getParam("autoCompleteId");
        var list = event.getParam("list");
        if(component.get("v.toFieldId") === autoCompleteId) {
            component.set("v.toList",list);            
        }
        if(component.get("v.ccFieldId") === autoCompleteId) {
            component.set("v.ccList",list);            
        }
        if(component.get("v.bccFieldId") === autoCompleteId) {
            component.set("v.bccList",list);            
        }

    }
})