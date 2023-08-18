/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.KapSMSService;
import com.titan.poss.integration.service.SMSService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class SMSFactory {

	@Autowired
	private KapSMSService kapSMSService;

	public SMSService getSMSService(VendorDao vendor) {
		SMSService smsService = null;
		String vendorCode = vendor.getVendorCode();
		if (vendorCode.equalsIgnoreCase("SMS_KAP")) {
			smsService = kapSMSService;
		} else {
			throw new ServiceException("Type is not registered", "ERR-INT-001", vendor.getVendorCode());
		}
		return smsService;
	}
}
