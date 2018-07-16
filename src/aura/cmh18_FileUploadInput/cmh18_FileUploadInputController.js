({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_FileUploadInput ", component.get("v.myCaseId"));    
    },   
    handleUploadFinished: function (component, event) {
    	console.log("Fire cmh18evt_RefreshFromServer ", component.get("v.myCaseId"));
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshAttachments");
        cmh18evt_RefreshFromServer.setParams({"caseId": component.get("v.myCaseId")});
        cmh18evt_RefreshFromServer.fire();          
    }
})