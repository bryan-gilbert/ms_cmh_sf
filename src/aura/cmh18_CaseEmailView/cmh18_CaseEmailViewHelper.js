({
    fire_GlobalDataChange : function(component, globals) {
        console.log("fire_GlobalDataChange", globals.caseId);
        var cmh18evt_GlobalDataChange = $A.get("e.c:cmh18evt_GlobalDataChange");
        cmh18evt_GlobalDataChange.setParam("globals", globals);
        cmh18evt_GlobalDataChange.fire();
    }
})