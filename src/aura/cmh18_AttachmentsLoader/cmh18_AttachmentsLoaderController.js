({
	doInit : function(component, event, helper) {
        helper.load(component,event,helper);
	},
	refresh : function(component, event, helper) {
        helper.load(component,event,helper);
	},
    showMore : function(component) {
        var limit = component.get('v.listLimit');
    	component.set('v.listLimit', limit + 5);
    }
})