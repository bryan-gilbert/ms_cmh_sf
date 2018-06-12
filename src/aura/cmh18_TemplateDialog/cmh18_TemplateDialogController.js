({
   openModel: function(component, event, helper) {
      component.set("v.isOpen", true);
   }, 
   cancelModel: function(component, event, helper) {
      component.set("v.isOpen", false);
   }, 
   doneModal: function(component, event, helper) {
    component.set("v.isOpen", false);
   },
    /**  
     * get the template id once the template picker fires it's done event
     */
    getTemplateIdFromEvent: function(component, event) {
        var templateId = event.getParam("templateId");
        component.set("v.templateId", templateId);
        component.set("v.isOpen", false);
    },    
})