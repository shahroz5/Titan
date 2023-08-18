/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import java.util.List;
import java.util.Set;

import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.EmailDto;
import com.titan.poss.integration.intg.dao.EmailIntgAudit;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface EmailService {

	void sendEmailNotification(VendorDao vendors, EmailDto emailDto, List<EmailIntgAudit> emailIntgAudits);

	Set<String> checkIfRequiredFieldsAreThere(VendorDao vendor);

}
