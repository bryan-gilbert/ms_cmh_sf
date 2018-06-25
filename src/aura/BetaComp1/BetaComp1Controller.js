({
    doInit : function(component,event,helper) {
    },
    click : function(component,event,helper) {
        var list = [];
        var idIndex = component.get("v.idIndex");
        for(var i=0; i < 4; i++) {
            list.push({id: idIndex});
            idIndex++;
        }
        component.set("v.idIndex", idIndex);
        component.set("v.attachments", list);
        var checkboxes = document.getElementsByClassName("cev_attachment_checkbox");
        console.log("In attachment list and have how many checkboxes? ", checkboxes.length);
        for (var i=0; i<checkboxes.length; i++) {
            var ctarget = checkboxes[i];
            console.log("ctarget ", ctarget.getAttribute("data-value"));
            ctarget.setAttribute("disabled", "disabled");            
        }         
    },
    onRender : function(component,event,helper){
        console.log("onRender");
        return;
        var checkboxes = document.getElementsByClassName("cev_attachment_checkbox");
        console.log("In attachment list and have how many checkboxes? ", checkboxes.length);
        for (var i=0; i<checkboxes.length; i++) {
            var ctarget = checkboxes[i];
            console.log("ctarget ", ctarget.getAttribute("data-value"));
            ctarget.setAttribute("disabled", "disabled");            
        }         
    }
})