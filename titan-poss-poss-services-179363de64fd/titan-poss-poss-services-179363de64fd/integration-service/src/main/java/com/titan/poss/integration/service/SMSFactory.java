/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

import java.util.Set;

import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.intg.dao.SMSIntgAudit;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface SMSFactory {

	SMSIntgAudit sendSMS(String mobileNo, String content, VendorDao integration, SMSIntgAudit smsIntgAudit);

	Set<String> checkIfRequiredFieldsAreThere(VendorDao intg);
}
