/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.integration.intg.dao.LoyaltyAuditDao;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface NetcarrotsErrorService {

	/**
	 * Reads the error message from the Netcarrots Error Codes file and throws the
	 * exception
	 *
	 * @param errorCode the error code
	 */
	UlpBaseResponseDto handleErrorCode(String errorCode, LoyaltyAuditDao intgAudit, Integer httpResponseCode);
}
