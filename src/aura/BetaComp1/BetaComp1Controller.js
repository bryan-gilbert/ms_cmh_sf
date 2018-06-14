({
    doInit: function(component) {
            var userId = $A.get("$SObjectType.CurrentUser.Id");
        var CurrentUser =$A.get("$SObjectType.CurrentUser");
            var userName = $A.get("$SObjectType.CurrentUser.Name");
        console.log("user name?");
component.set("v.userName", userName);
        var globals = {'UserId': userId, 'CaseId' : '0987'};
        component.set("v.globals", globals);
    },
    update : function(component) {
        var newId = Math.floor(Math.random() * Math.floor(10000));
        var globals = {'UserId': newId, 'CaseId' : '0000'};
        component.set("v.globals", globals);
    }
})