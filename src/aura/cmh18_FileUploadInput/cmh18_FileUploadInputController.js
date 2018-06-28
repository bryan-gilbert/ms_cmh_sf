({
    handleUploadFinished: function (cmp, event) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        var cmh18evt_RefreshFromServer = $A.get("e.c:cmh18evt_RefreshAttachments");
        cmh18evt_RefreshFromServer.fire();          
        //alert("Files uploaded : " + uploadedFiles.length);
    }
})