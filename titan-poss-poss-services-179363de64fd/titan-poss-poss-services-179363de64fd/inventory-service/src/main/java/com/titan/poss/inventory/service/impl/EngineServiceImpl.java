/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CustomLotMasterDto;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.service.EngineService;

import feign.Response;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service
public class EngineServiceImpl implements EngineService {

	@Autowired
	EngineServiceClient engineClient;

	@Override
	public Map<String, String> getProductGroups(String plainStudded, String transactionType) {

		return engineClient.getProductGroupList(plainStudded, null);

	}

	@Override
	public Map<String, String> getProductCategories() {
		return engineClient.getProductCategoryList();

	}

	// this method should not be cached
	@Override
	public ItemLiteDto getItemDetails(String itemCode) {
		List<String> itemCodes = new ArrayList<>();
		itemCodes.add(itemCode);
		ListResponse<ItemLiteDto> itemLiteList = engineClient.getItemList(itemCodes);
		return itemLiteList.getResults().get(0);
	}

	@Override
	public void checkWeightToleranceValue(String productGroupCode, BigDecimal availableWeight,
			BigDecimal measuredWeight, short availableQuantity, short measuredQuantity) {

		Response response = engineClient.getWeightToleranceValue(productGroupCode, availableWeight, measuredWeight,
				availableQuantity, measuredQuantity);

		if (response.status() == 400) {
			throw new ServiceException("Measured weight is exceeding weight tolerance limit", "ERR-INV-028");
		}

	}

	@Override
	public Object getRuleFieldValues(String ruleType, RuleRequestListDto ruleRequestListDto) {

		Object response = engineClient.getRuleValues(ruleType, ruleRequestListDto);
		if (response == null) {
			throw new ServiceException("Response is Empty.Please set Configurations for Rule:" + ruleType + " ",
					"Error-Code");
		}

		return response;
	}

	@Override
	public LocationCacheDto getLocationDetail(String locationCode) {
		return engineClient.getStoreLocation(locationCode);
	}

	@Override
	public StorePrintDetailsDto getLocationDetailWithTaxCode(String locationCode) {
		return engineClient.getStoreLocationWithTaxCode(locationCode);
	}

	@Override
	public String getCurrencyCode(String locationCode) {
		return getLocationDetail(locationCode).getStockCurrency();
	}

	@Override
	public String getLotNumber(DocTypeEnum docType) {
		CustomLotMasterDto customLotMasterDto = engineClient.generateLotNumber(docType.toString());
		return customLotMasterDto.getLotNumber();
	}

	@Override
	public CountryDetailsDto getCountryDetails(String locationCode) {
		return engineClient.getCountryDetails(locationCode);
	}

	@Override
	public BusinessDayDto getBusinessDay(String locationCode) {
		return engineClient.getBusinessDay(locationCode);
	}

	@Override
	public BrandDto getBrand(String brandCode) {
		return engineClient.getBrand(brandCode);

	}

	@Override
	public Date getBusinessDayScheduler(String locationCode) {
		return engineClient.getBusinessDayInProgress(locationCode).getBusinessDate();
	}

	@Override
	public Map<String, ItemDetailsDto> listItemDetails(List<String> itemCodes) {

		return engineClient.listItemDetails(itemCodes);
	}

	@Override
	public void clearLocationCache(String cacheValue, String cacheKey) {
		engineClient.clearCache(cacheValue, cacheKey);

	}

	public List<DiscountItemMapiingDto> getDiscountItemMappingDetails(String itemCode, String lotNumber,
			String locationCode) {
		// TODO Auto-generated method stub

		return engineClient.getDiscountItemMappingDetails(itemCode, lotNumber, locationCode);
	}

	@Override
	public List<ItemGroupMappingDto> discountIBTTansfer(List<ItemGroupMappingDto> discountItemMappingDaos) {
		// TODO Auto-generated method stub
		return engineClient.discountIBTTansfer(discountItemMappingDaos);
	}
}
