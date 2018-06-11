({
   openModel: function(component, event, helper) {
      component.set("v.isOpen", true);
   }, 
   cancelModel: function(component, event, helper) {
      component.set("v.isOpen", false);
   }, 
   doneModal: function(component, event, helper) {
      alert('thanks for trying this demo');
      component.set("v.isOpen", false);
   },
})