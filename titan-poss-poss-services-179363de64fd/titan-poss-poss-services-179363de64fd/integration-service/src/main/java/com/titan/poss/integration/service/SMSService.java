/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import java.util.List;
import java.util.Set;

import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.SMSDto;
import com.titan.poss.integration.intg.dao.SMSIntgAudit;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface SMSService {

	public void sendSmsNotification(VendorDao vendor, SMSDto smsDto, List<SMSIntgAudit> smsIntgAud);

	Set<String> checkIfRequiredFieldsAreThere(VendorDao vendor);

}
