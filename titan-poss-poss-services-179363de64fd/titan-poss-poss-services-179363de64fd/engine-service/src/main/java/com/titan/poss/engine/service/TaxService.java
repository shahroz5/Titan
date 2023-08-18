/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.TaxCalculationResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface TaxService {

	/**
	 * This method will give the applicable tax and CESS according to given input.
	 * 
	 * @param srcBtqLocationCode
	 * @param destBtqLocationCode
	 * @param customerId
	 * @param txnType
	 * @param itemCode
	 * @return TaxCalculationResponseDto
	 */
	TaxCalculationResponseDto getTaxValues(String srcBtqLocationCode, String destBtqLocationCode, Integer customerId,
			String txnType, String itemCode,Boolean isfullvalueTep,Boolean isIGST);
	
	void isIGSTAllowedCheck(Boolean isIGST, Integer custId);

}
