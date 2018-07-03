public with sharing class cmh18apex_Email {
    
    // ref composition from http://blog.deadlypenguin.com/blog/2015/10/12/email-reference-id-winter-16-changes/
    @testVisible
    private static String shortenOrgId() {
     String part = UserInfo.getOrganizationId().substring(0,15);
     Pattern p = Pattern.compile('^([A-Za-z0-9]{5})([A-Za-z0-9]*)$');
     Matcher m = p.matcher(part);
     if (m.matches()) {
          return  m.group(1) + m.group(2).replace('0', '');
     }
     return '';
    }
    @testVisible
    private static String shortenCaseId(String id) {
         String part = id.substring(0,15);
         Pattern p = Pattern.compile('^([A-Za-z0-9]{5})([A-Za-z0-9]*)([A-Za-z0-9]{5})$');
         Matcher m = p.matcher(part);    
         if (m.matches()) {
              return m.group(1) + m.group(2).replace('0', '') + m.group(3);
         }    
         return '';
    }    
    @AuraEnabled
    public static String getRef(String caseId) {   
        return 'ref:_' + shortenOrgId() + '._' + shortenCaseId(caseId)+ ':ref';
    }  
    
    @AuraEnabled
    public static String sendEmailMessage(
        String[] toList, String[] ccList, String[] bccList, String fromAddressOptional, String fromNameOptional,
        String caseId, String subject, String plainTextBody, String htmlBody, String[] attachmentIdList, String[] documentIdList) 
    {   
        System.debug(Logginglevel.INFO,'In cmh18apex_Email with ' + caseId + ' ' + subject );//+ ' toListString '+ toListString);
        
// List<String> toList = (List<String>)JSON.deserialize(toListString,List<String>.class);
    System.debug(toList);
        
        if (caseId == null || caseId.length() < 10) {
        	return errorMessage('ERROR: Must provide case ID');
        }
        if (toList == null || toList.size() == 0) {
        	return errorMessage('ERROR: Must provide list of to addresses');
        }
        try{
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage m = new Messaging.SingleEmailMessage();
//System.debug(Logginglevel.INFO,'Before m.setToAddresses ' + toList.size());            
//System.debug(Logginglevel.INFO,'toList[0] ' + toList.get(0));
        m.setToAddresses(toList);
//System.debug(Logginglevel.INFO,'After m.setToAddresses ' + toList.size());            
        if( ccList.size() > 0) {
            m.setCcAddresses(ccList);
        }
        if( bccList.size() > 0) {
            m.setBccAddresses(bccList);
        }
        String fromAddress = fromAddressOptional;
        String fromName = fromNameOptional;
        if(fromAddress == null) {
        	System.debug(Logginglevel.INFO,'cmh18apex_Email use org wide email address');  
            // Send from the org wide email address ... later add from address
            List<OrgWideEmailAddress >   owdlist = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress limit 1];
            if (owdlist.size() == 0) {
            	return errorMessage('ERROR: Must provide from address or set up an organization wide address');
            } 
            m.setOrgWideEmailAddressId(owdlist[0].id); 
            fromAddress = owdlist[0].Address;
            fromName = owdlist[0].DisplayName;                
        }
        System.debug(Logginglevel.INFO,'cmh18apex_Email fromAddress ' + fromAddress + ' ' + fromName);        
        
        String ref = getRef(caseId);
	    if(plainTextBody != null && !plainTextBody.contains(ref)) {
            plainTextBody += '\n'+ ref + '\n';
        }
        //System.debug(Logginglevel.FINE,'cmh18apex_Email plainTextBody ' + plainTextBody);
        if( htmlBody != null && !htmlBody.contains(ref)) {
            htmlBody += '\n<p>'+ ref + '</p>';
        }
        //System.debug(Logginglevel.FINE,'cmh18apex_Email htmlBody ' + htmlBody);
        m.setSubject(subject);
        m.setPlainTextBody(plainTextBody); 
		processAttachmentIds(m, attachmentIdList, documentIdList);
		
        m.setHtmlBody(htmlBody);
        messages.add(m);
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        String result = 'Sent message:' + htmlBody;
        if (results[0].success) {
            System.debug(Logginglevel.INFO,'The email was sent successfully.');
            // Created a EmailMessage and copy all details.
            EmailMessage emailMsg = new EmailMessage(); 
            emailMsg.MessageDate = system.now(); 
			// convert the incoming to array into a string for the email message record
            emailMsg.ToAddress = String.join(toList,';');
            emailMsg.FromAddress = fromAddress;
            emailMsg.FromName = fromName;
            emailMsg.CcAddress = String.join(ccList,';');
            emailMsg.BccAddress = String.join(bccList,';');
            emailMsg.Subject = subject;
            emailMsg.TextBody = plainTextBody;
            emailMsg.HtmlBody = htmlBody;
            // HasAttachment is not writable
            // emailMsg.HasAttachment = attachmentCount > 0;
            // Field is not writtable EmailMessage.HasAttachment
            emailMsg.Incoming = false;
            emailMsg.ParentId = caseId;
            //emailMsg.ReplyToEmailMessageId = 
            emailMsg.Status = '3';// sent
            Insert emailMsg;
            
        } else {
            return errorMessage('ERROR: The email failed to send: ' + results[0].errors[0].message);
        }
        return result;
        } catch( Exception error ) {            
            Messaging.SingleEmailMessage errorEmail=new Messaging.SingleEmailMessage();
            String[] toAddresses = new String[] {'bryan.gilbert@gmail.com'};
            errorEmail.setToAddresses(toAddresses);
            errorEmail.setReplyTo('developer@acme.com');
            errorEmail.setSenderDisplayName('Apex error message');
            errorEmail.setSubject('Error from Org : ' + UserInfo.getOrganizationName());
            errorEmail.setPlainTextBody(error.getMessage());
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { errorEmail });
            return errorMessage('ERROR: ' + error.getMessage());
        }
    }
    private static void processAttachmentIds(Messaging.SingleEmailMessage m, String[] attachmentList, String[] documentList ) {
        List<String> entityIds = new List<String>();
        if(attachmentList <> null) {
            System.debug(Logginglevel.INFO,'cmh18apex_Email atachments: '+attachmentList.size() );
            for(Integer indx = 0; indx < attachmentList.size(); indx++){
                String id = attachmentList[indx];
	            String newId = createAttachment(true, id);
	            System.debug(Logginglevel.INFO,'cmh18apex_Email attachment original: ' + id + ' new: ' + newId);
                entityIds.add(newId);
            }
        } else {
            System.debug(Logginglevel.INFO,'cmh18apex_Email no  attachments');
        }    	
        if(documentList <> null) {
            System.debug(Logginglevel.INFO,'cmh18apex_Email documents: '+documentList.size() );
            for(Integer indx = 0; indx < documentList.size(); indx++){
                String id = documentList[indx];
	            String newId = createAttachment(false, id);
	            System.debug(Logginglevel.INFO,'cmh18apex_Email document original: ' + id + ' new: ' + newId);
                entityIds.add(newId);
            }
        } else {
            System.debug(Logginglevel.INFO,'cmh18apex_Email no  attachments');
        }     
        m.setEntityAttachments(entityIds);
    }
    private static Id createAttachment(Boolean isAttachment, String attachmentId) {   
        return attachmentId;
    }  
    
    private static String errorMessage(String msg) {
		System.debug(Logginglevel.ERROR,'cmh18apex_Email ' + msg);  
	    return msg;
    }
}