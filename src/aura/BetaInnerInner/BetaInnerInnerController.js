({
    update : function(component) {
        var newId = Math.floor(Math.random() * Math.floor(10000));
        var globals = {'UserId': newId, 'CaseId' : '0000'};
        component.set("v.propInnerInner", globals);
    }
})