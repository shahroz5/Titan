/*  
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.EmailService;
import com.titan.poss.integration.service.GmailEmailService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class EmailFactory {

	@Autowired
	private GmailEmailService gmailEmailService;

	public EmailService getEmailService(VendorDao vendor) {
		EmailService emailService = null;
		String vendorCode = vendor.getVendorCode();
		if (vendorCode.equalsIgnoreCase("EMAIL_GMAIL")) {
			emailService = gmailEmailService;
		} else {
			throw new ServiceException("Type is not registered", "ERR-INT-001", vendor.getVendorCode());
		}
		return emailService;
	}
}
