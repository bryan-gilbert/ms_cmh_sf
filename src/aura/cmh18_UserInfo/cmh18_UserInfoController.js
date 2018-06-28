({
	setInfo : function(component,event,helper) {
		var params = event.getParam('arguments');
		if (params) {
		    component.set("v.userInfo", params.userInfo);
		    component.set("v.orgInfo", params.orgInfo);
		}
	},
})