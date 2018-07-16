({
    doInit: function(component,event,helper) {
        component.set("v.myCaseId", component.get("v.caseId"));
        console.log("Init cmh18_NextAction ", component.get("v.myCaseId"));    
		helper.loadNextAction(component,helper);
	}, 
    cmh18evt_RefreshFromServer : function(component,event,helper) {
        helper.loadNextAction(component,helper);
    },
    editNextAction: function(component,event,helper){
      alert("This is a possible new feature to create an edit box and modify the next action") ;
    },
    addComment: function(component,event,helper){
      alert("This is a possible new feature to create an edit box and creat a new case comment");
    },
    saveNextData : function(component, event, helper) {
    	helper.updateNextAction(component,helper);
	},
    nextActionContentChanged : function(component,event,helper) {
        console.log("Init cmh18_NextAction nextActionContentChanged");        
        component.set("v.modified", true);    
    },
    cancelNextData : function(component,event,heleper) {
        var original = component.get("v.originalText");
        console.log("Init cmh18_NextAction reset content",original);        
        component.set("v.nextAction", original);        
        component.set("v.modified", false);    
        
    }, 
})