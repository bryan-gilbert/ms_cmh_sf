({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_TemplateDialog ", component.get("v.myCaseId"));    
    },   
   openModal: function(component, event, helper) {
      component.set("v.isOpen", true);
   }, 
   cancelModal: function(component, event, helper) {
      component.set("v.isOpen", false);
   }, 
   doneModal: function(component, event, helper) {
    component.set("v.isOpen", false);
   },
    /**  
     * get the template id once the template picker fires it's done event
     */
    cmh18evt_PickTemplate: function(component, event) {
        if (event.getParam("caseId") !== component.get("v.myCaseId")) {
            return;
        }
        var templateId = event.getParam("templateId");
        console.log("Template dialog has template choosen and will now close", templateId);
        component.set("v.templateId", templateId);
        component.set("v.isOpen", false);
    },    
})