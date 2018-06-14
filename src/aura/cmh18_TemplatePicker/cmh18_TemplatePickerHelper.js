({
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
})