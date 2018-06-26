({
	cmh18evt_GlobalDataChange : function(component, event, helper) {
        console.log("cmh18_UserInfoController cmh18evt_GlobalDataChange " + component.get("v.version"));
        /*
        select Id
        ,Name,TimeZoneSidKey,Username
        , Alias,Country,Email,FirstName,LastName,IsActive
        , UserRoleId, UserType
        , SmallBannerPhotoUrl
        , SmallPhotoUrl
        , ProfileId =
        */
        var resultCount = 0;
        var action = component.get("c.fetchUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            resultCount++;
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log("Got current user information", storeResponse);
                component.set("v.userInfo", storeResponse);
                if(resultCount===2) 
                    helper.updateGlobals(component,helper);
            }
        });
        
        /* select Id, Address, DisplayName from OrgWideEmailAddress 
        */
        var actionOrg = component.get("c.fetchOrgEmail");
        actionOrg.setCallback(this, function(response) {
            var state = response.getState();
            resultCount++;
            if (state === "SUCCESS") {
                var list = response.getReturnValue();
                console.log("Got org email info", list);
                var orgInfo = (list && list.length > 0) ? list[0] : undefined;
                if(orgInfo) {
                    component.set("v.orgInfo", orgInfo);
                    if(resultCount===2) 
                        helper.updateGlobals(component,helper);
                }
            }
        });
        $A.enqueueAction(action);        
        $A.enqueueAction(actionOrg);
    }
})