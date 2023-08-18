/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.integration.intg.dao.LoyaltyAuditDao;
import com.titan.poss.integration.intg.repository.LoyaltyAuditRepository;
import com.titan.poss.integration.service.NetcarrotsErrorService;
import com.titan.poss.integration.util.ApplicationIntgPropertiesUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("IntegrationNetcarrotsErrorService")
public class NetcarrotsErrorServiceImpl implements NetcarrotsErrorService {

	@Autowired
	private LoyaltyAuditRepository loyaltyAuditRepository;

	/**
	 * Check error code.
	 *
	 * @param errorCode the error code
	 */
	@Override
	public UlpBaseResponseDto handleErrorCode(String errorCode, LoyaltyAuditDao loyaltyAudit,
			Integer httpResponseCode) {
		String errorMessage = ApplicationIntgPropertiesUtil.getValue("NC" + errorCode);
		loyaltyAudit.setHttpStatus(httpResponseCode);
		loyaltyAudit.setResponseTime(CalendarUtils.getCurrentDate());
		loyaltyAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - loyaltyAudit.getRequestTime().getTime());
		loyaltyAudit.setResponse("Netcarrot Error: " + errorMessage);
		loyaltyAudit.setTransactionStatus(false);
		loyaltyAuditRepository.save(loyaltyAudit);
		UlpBaseResponseDto ulpBaseResponseDto = new UlpBaseResponseDto();
		if (errorCode.equalsIgnoreCase("-1027")) {
			ulpBaseResponseDto.setResponseCode("ERR-INT-037");
		} else {
			ulpBaseResponseDto.setResponseCode("ERR-INT-026");
		}
		ulpBaseResponseDto.setResponseMessage(errorMessage + " (" + errorCode + ")");
		return ulpBaseResponseDto;
	}
}
