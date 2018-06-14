public  with sharing  class cmh18_UserInfoServer {
   @AuraEnabled 
    public static user fetchUser(){
     // query current user information  
      User oUser = [select Id
        ,Name,TimeZoneSidKey,Username
        , Alias,Country,Email,FirstName,LastName,IsActive
        , UserRoleId, UserType
        , SmallBannerPhotoUrl
        , SmallPhotoUrl
        , ProfileId
        FROM User Where Id =: userInfo.getUserId()];
        return oUser;
    }
   @AuraEnabled 
    public static List<OrgWideEmailAddress> fetchOrgEmail(){
    // query first OrgWideEmailAddress
        List<OrgWideEmailAddress> orgEmail = [ select Id, Address, DisplayName from OrgWideEmailAddress];
        return orgEmail;
    }    
    

}