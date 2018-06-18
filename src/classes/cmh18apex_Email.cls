public with sharing class cmh18apex_Email {
    @AuraEnabled
    public static String getRef(String caseId) {   
        return '[ ref:_'
     + UserInfo.getOrganizationId().left(5)
     + UserInfo.getOrganizationId().mid(11,4) + '._'
     + caseId.left(5)
     + caseId.mid(10,5) + ':ref ]';
    }  
    
    @AuraEnabled
    public static String sendEmailMessage(
        String[] toList, String[] ccList, String fromAddressOptional, String fromNameOptional,
        String caseId, String ref, String subject, String plainTextBody, String htmlBody) {   
        try{
        System.debug(Logginglevel.ERROR,'In cmh18apex_Email with ' + caseId + ' ' + subject
            + 'toList[0] ' + toList[0]
            + ' plainTextBody ' + plainTextBody);
        
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage m = new Messaging.SingleEmailMessage();
        m.setToAddresses(toList);
        if( ccList.size() > 0)
            m.setCcAddresses(ccList);

        String fromAddress = fromAddressOptional;
        String fromName = fromNameOptional;
        if(fromAddress == null) {
            // Send from the org wide email address ... later add from address
            List<OrgWideEmailAddress >   owdlist = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress limit 1];
            m.setOrgWideEmailAddressId(owdlist[0].id); // the org wide email address has been verified.
            fromAddress = owdlist[0].Address;
            fromName = owdlist[0].DisplayName;                
        }
        System.debug(Logginglevel.ERROR,'cmh18apex_Email fromAddress ' + fromAddress + ' ' + fromName);        
        
        if(plainTextBody != null && !plainTextBody.contains(ref)) {
            plainTextBody += '\n'+ ref + '\n';
        }
        System.debug(Logginglevel.ERROR,'cmh18apex_Email plainTextBody ' + plainTextBody);
        if( htmlBody != null && !htmlBody.contains(ref)) {
            htmlBody += '\n<p>'+ ref + '</p>';
        }
        System.debug(Logginglevel.ERROR,'cmh18apex_Email htmlBody ' + htmlBody);
        m.setSubject(subject);
        m.setPlainTextBody(plainTextBody); 
        m.setHtmlBody(htmlBody);
        messages.add(m);
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        String result = 'Sent message:' + htmlBody;
        if (results[0].success) {
            System.debug('The email was sent successfully.');
            // Created a EmailMessage and copy all details.
            EmailMessage emailMsg = new EmailMessage(); 
            emailMsg.MessageDate = system.now(); 
			// convert the incoming to array into a string for the email message record
            emailMsg.ToAddress = String.join(toList,';');
            emailMsg.FromAddress = fromAddress;
            emailMsg.FromName = fromName;
            emailMsg.CcAddress = String.join(ccList,';');
            //emailMsg.BccAddress = 
            
            emailMsg.Subject = subject;
            emailMsg.TextBody = plainTextBody;
            emailMsg.HtmlBody = htmlBody;
            // HasAttachment is not writable
            //emailMsg.HasAttachment = false;
            emailMsg.Incoming = false;
            emailMsg.ParentId = caseId;
            //emailMsg.ReplyToEmailMessageId = 
            emailMsg.Status = '3';// sent
            Insert emailMsg;
            
        } else {
            result = 'The email failed to send: ' + results[0].errors[0].message;
            System.debug(Logginglevel.ERROR,result);
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
            return 'ERROR: ' + error.getMessage();
        }
    }
}