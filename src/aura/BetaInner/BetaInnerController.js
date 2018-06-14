({
	doInit : function(component, event, helper) {
		var prop1 =   component.get("v.prop1");

		console.log("In inner with prop1", prop1);
       	component.set("v.message", JSON.stringify(prop1));
		
	}
})