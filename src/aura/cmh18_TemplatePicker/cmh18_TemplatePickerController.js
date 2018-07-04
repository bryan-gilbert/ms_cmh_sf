({
    doInit : function(component, event, helper) {
        helper.loadTemplates(component,helper);
	},
	loadTemplateBody : function(component, event, handler) {
        var templateId, whoId, whatId;
    },
    keyPressController : function(component, event, helper) {
        helper.searchController(component,helper);
	},
    trClickHandler : function(component, event, helper) {
        var target = event.target;
        var rowId = target.getAttribute("id");
        console.log("In template selection click handler with template id: ", rowId);
        var pickevent = $A.get("e.c:cmh18evt_PickTemplate");
        pickevent.setParams({"templateId": rowId});
        pickevent.fire();
        // store the favorite
        helper.addMruTemplateIds(component,helper, rowId);        
    },
    cmh18evt_RefreshFromServer : function(component,event,helper) {
        console.log("template picker handle event cmh18evt_RefreshFromServer");
        helper.clearStash(component,helper);       
        helper.loadTemplates(component,helper);
    },    
})