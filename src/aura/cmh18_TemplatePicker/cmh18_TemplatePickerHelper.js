({
MRU_MAX : 7,
    loadTemplates : function(component, helper) {
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
        console.log("Loading templates calling server ....");
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
                    console.log("... templates loaded from server");
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
    
    mergeFavorites: function(component,helper,templates) {
        var mruIds = helper.getMruTemplateIds(component,helper);
        console.log("merge most recently used  ", mruIds);
        var mruTemplates = [];
        var others = templates.slice(0,templates.length);
        others.forEach(function(t) {
            t.isMru=false;
        })
        mruIds.forEach(function(t10) {
            var closureIndex;
            var closureTemplate;
            var found = others.find(function(t,indx){
                var r = false;
                if( t.Id === t10 ) {
                    closureIndex = indx;
                    closureTemplate = t;
                    r = true
                }
                return r;
            });
            if(found) {
                closureTemplate.isMru = true;
                mruTemplates.push(closureTemplate);
                others.splice(closureIndex,1);
            } 
        });
        var merged = mruTemplates.concat(others);
        component.set("v.templates", merged);  
    },
    getMruTemplateIds : function(component,helper) {
        var globals = component.get("v.globals");
        var data = globals.userInfo.cmh18_data__c
        console.log("TPH userData. based on ", data);
        var userData = data && data.length>0 ?  JSON.parse(data) : {};
        console.log("TPH userData.mruTemplates", userData.mruTemplates);
        return userData.mruTemplates;        
    },
    addMruTemplateIds : function(component,helper, id) {
        var mruIds = helper.getMruTemplateIds(component,helper);
        console.log("Before unshift", mruIds);
        mruIds.unshift(id); // add to the beginning
        console.log("After unshift", mruIds);
        while(mruIds.length > this.MRU_MAX) mruIds.pop();
        var cmh18evt_UserDataSaveAction = $A.get("e.c:cmh18evt_UserDataSave");
        cmh18evt_UserDataSaveAction.setParams({"key": "mruTemplates", "value" : mruIds});
        cmh18evt_UserDataSaveAction.fire();        
        return mruIds;        
    },   
    combineData : function(component, templates, folders) {
        // This is O(N x M) but N = 138 and M = 20 so ....
        var combined = templates.map(function(template) {
            var folder = folders.filter(function(fldr){
                var result = fldr.Id === template.FolderId;
                return result;
            })
            if(folder && folder.length>0) {
                template.FolderName = folder[0].Name;
            } else {
                template.FolderName = "";
            }
           	template._name = template.Name.toLowerCase();
           	template._folder = template.FolderName.toLowerCase();
           	template._subject = template.Subject.toLowerCase();
            //console.log(template._name, "-=-=-=-=-", template._folder,"-=-=-=-=-", template._subject)
            return template;
        })
		return combined;
    },
    loadTemplateBody : function(component, handler, templateId, whoId, whatId) {
        var action = component.get("c.getTemplate");
        // Id templateId, Id whoId, Id whatId
		action.setParams({"templateId": templateId});
		action.setParams({"whoId": whoId});
		action.setParams({"whatId": whatId});
        action.setCallback(this, function(response){
            // TODO process array of string results
        });
    },
	searchHelper : function(sName, sFolder, sSubject, templates) {
        function toL(str) {return str && str.length > 0 ? str.toLowerCase() : null;}
        var sName = toL(sName);
        var sFolder = toL(sFolder);
        var sSubject = toL(sSubject);
        var selected = templates.filter(function(tmplt) {
            var result =  sName ? tmplt._name.includes(sName) : true;
            return result;
        })
        //console.log("after sName", sName, selected.length);
		selected = selected.filter(function(tmplt) {
            var result =  sFolder ? tmplt._folder.includes(sFolder) : true;
            return result;
        })
        //console.log("after sFolder", sFolder, selected.length);
		selected = selected.filter(function(tmplt) {
            var result =  sSubject?  tmplt._subject.includes(sSubject) : true;
            return result;
        })
        //console.log("after sSubject", sSubject, selected.length);
        return selected;
	}, 
    searchController : function(component, helper) {
        var sName = component.get("v.searchName");
        var sFolder = component.get("v.searchFolder");
        var sSubject = component.get("v.searchSubject");
		var templates = component.get("v.templates");
        var selected = helper.searchHelper(sName, sFolder, sSubject, templates);
        var cnt = selected.length;
        var msg = "Search found " + cnt + " records";
        //console.log(msg);
        component.set("v.listOfSearchRecords", selected);
        component.set("v.message", msg);
        component.set("v.selectedCount", cnt);
	},
    getStashedTemplates : function (component) {
        var globals = component.get("v.globals");
        var templates = globals.templates;
        //console.log("getting existing templates", templates);
        return templates;
    },
    stashTemplates : function (component, templates) {
        var globals = component.get("v.globals");
		globals.templates = templates;
        //console.log("stashing templates", templates);
    },  
    clearStash : function(component){
        var globals = component.get("v.globals");
		globals.templates = undefined;        
        console.log("clearing the templates stash");
    },
})