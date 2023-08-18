/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.RuleRequestListDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface RuleService {

	public Object ruleValueMappingListBasedOnFilters(String ruleType, RuleRequestListDto ruleRequestListDto);

	public void checkWeightTolerance(String locationCode, String productGroupCode, BigDecimal availableWeight,
			BigDecimal measuredWeight, short availableQuantity, short measuredQuantity);

	public BigDecimal getRefundCashLimitConfig();

}
