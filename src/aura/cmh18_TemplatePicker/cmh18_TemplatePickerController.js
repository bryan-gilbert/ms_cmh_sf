({
    doInit : function(component, event, helper) {
        var existingTemplates = helper.getStashedTemplates(component);
        if (existingTemplates && existingTemplates.length > 1) {
            console.log("use templates loaded before");
            helper.mergeFavorites(component,helper,existingTemplates);
            helper.searchController(component,helper);                  
            component.set("v.spinner", false);            
            return;
        }
        component.set("v.spinner", true);
        var responseCnt = 0;
        var getTemplatesAction = component.get("c.getTemplates");
        var getFoldersAction = component.get("c.getFolders");
        var doneWait = function(response, propName) {
            var state = response.getState();
            if (state === "SUCCESS") {
				component.set(propName, response.getReturnValue());
                responseCnt++;
                if(responseCnt === 2) {
                    var folders = component.get("v.folders");
                    var templates = component.get("v.templates");                  
                    templates = helper.combineData(component, templates, folders);
                    helper.stashTemplates(component, templates);
                    helper.mergeFavorites(component,helper,templates);                    
                    helper.searchController(component,helper);                  
                    component.set("v.spinner", false);
                }            
            }
        }
        getTemplatesAction.setCallback(this, function(response){
            return doneWait(response,"v.templates");
        });
        getFoldersAction.setCallback(this, function(response){
            return doneWait(response,"v.folders");
        });
        $A.enqueueAction(getFoldersAction);		
        $A.enqueueAction(getTemplatesAction);		
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
    }
})