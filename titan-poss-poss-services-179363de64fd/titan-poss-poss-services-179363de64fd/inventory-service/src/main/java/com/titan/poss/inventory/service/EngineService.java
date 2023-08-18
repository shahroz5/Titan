
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.inventory.constant.DocTypeEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface EngineService {

	Map<String, String> getProductGroups(String plainStudded, String transactionType);

	Map<String, String> getProductCategories();

	ItemLiteDto getItemDetails(String itemCode);

	Object getRuleFieldValues(String ruleType, RuleRequestListDto ruleRequestListDto);

	void checkWeightToleranceValue(String productGroupCode, BigDecimal availableWeight, BigDecimal measuredWeight,
			short availableQuantity, short measuredQuantity);

	String getCurrencyCode(String locationCode);

	LocationCacheDto getLocationDetail(String locationCode);

	StorePrintDetailsDto getLocationDetailWithTaxCode(String locationCode);

	String getLotNumber(DocTypeEnum docType);

	CountryDetailsDto getCountryDetails(String locationCode);

	BusinessDayDto getBusinessDay(String locationCode);

	/**
	 * @param brandCode
	 * @return
	 */
	BrandDto getBrand(String brandCode);

	/**
	 * @param locationCode
	 * @return
	 */
	Date getBusinessDayScheduler(String locationCode);

	Map<String, ItemDetailsDto> listItemDetails(List<String> itemCodes);

	void clearLocationCache(String cacheValue, String cacheKey);

	List<DiscountItemMapiingDto> getDiscountItemMappingDetails(String itemCode, String lotNumber, String locationCode);

	List<ItemGroupMappingDto> discountIBTTansfer(List<ItemGroupMappingDto> discountItemMappingDaos);
}
