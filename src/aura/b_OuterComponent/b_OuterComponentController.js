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
	}
})