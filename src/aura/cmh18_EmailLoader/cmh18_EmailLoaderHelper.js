({
	convertStatus : function(status) {
        var inx = status * 1;
        var values = ["New","Read","Replied","Sent","Forwarded","Draft"];
        return values[inx];
	}
})