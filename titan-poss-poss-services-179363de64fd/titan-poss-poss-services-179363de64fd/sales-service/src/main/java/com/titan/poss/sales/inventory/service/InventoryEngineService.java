
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.inventory.service;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.inventory.constant.DocTypeEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface InventoryEngineService {

	Map<String, String> getProductGroups(String isPlainStudded);

	Map<String, String> getProductCategories();

	ItemLiteDto getItemDetails(String itemCode);


	Object getRuleFieldValues(String ruleType, RuleRequestListDto ruleRequestListDto);

	void checkWeightToleranceValue(String productGroupCode, BigDecimal availableWeight, BigDecimal measuredWeight,
			short availableQuantity, short measuredQuantity);

	String getCurrencyCode(String locationCode);

	LocationCacheDto getLocationDetail(String locationCode);

	String getLotNumber(DocTypeEnum docType);
}
