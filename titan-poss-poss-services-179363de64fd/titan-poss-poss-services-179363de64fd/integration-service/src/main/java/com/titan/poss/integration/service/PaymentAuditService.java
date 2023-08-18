/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.integration.dao.VendorDao;

/**
 * The Interface UnipayAuditService.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentAuditService {

    PaymentAuditDto savePaymentAuditData(VendorDao vendor, PaymentAuditDto paymentAuditDto);
}
