({
    doInit : function(component, event, helper) {
        var existingTemplates = helper.getStashedTemplates(component);
        if (existingTemplates && existingTemplates.length > 1) {
            console.log("use templates loaded before");
            component.set("v.templates", existingTemplates);  
            helper.searchController(component,helper);                  
            component.set("v.spinner", false);            
            return;
        }
		//console.log("Show Spiner");        
        component.set("v.spinner", true);
        var responseCnt = 0;
        var getTemplatesAction = component.get("c.getTemplates");
        var getFoldersAction = component.get("c.getFolders");
        var _this = this;
        var doneWait = function(response, propName) {
            var state = response.getState();
            if (state === "SUCCESS") {
				component.set(propName, response.getReturnValue());
                responseCnt++;
                if(responseCnt === 2) {
                    var folders = component.get("v.folders");
                    var templates = component.get("v.templates");                  
                    templates = helper.combineData(component, templates, folders);
                    component.set("v.templates", templates);  
                    helper.stashTemplates(component, templates);
                    //console.log("Hide Spiner");
                    component.set("v.spinner", false);
                    helper.searchController(component,helper);                  
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
        console.log("In tr click handler with ", rowId);
        var event = $A.get("e.c:cmh18evt_PickTemplate");
        event.setParams({"templateId": rowId});
        event.setParams({"templates": component.get('v.templates')});
        event.fire();        
    }
})