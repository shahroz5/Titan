/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface OrderPriceUtilService {

	/**
	 * This method will return the measured weight
	 * 
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param inventoryDto
	 * @param productGroupCode
	 * @return measuredStandardWeight(BigDecimal)
	 */
	BigDecimal getMeasuredStandardWeight(BigDecimal measuredWeight, Short measuredQuantity,
			InventoryDetailsDao inventoryDao, String productGroupCode);

	/**
	 * This method will return total metal value for a multi metal item.
	 * 
	 * @param materialMap
	 * @param priceResponseDtoOld
	 * @param priceResponseDataNew
	 * @param metalPriceDetailsOld
	 * @return PriceResponseDto
	 */
	PriceResponseDto getMultiMetalVJsonData(Map<String, BigDecimal> materialMap, PriceDetailsDto priceResponseDtoOld,
			PriceResponseDto priceResponseDataNew, Map<String, MetalPriceDto> metalPriceDetailsOld);

	/**
	 * This method will get metal details for a given item.
	 * 
	 * @param priceResponseData
	 * @param metalTypeCode
	 * @param metalPriceDetails
	 * @return PriceResponseDto
	 */
	PriceResponseDto getMetalVJsonData(PriceResponseDto priceResponseDataNew, String metalTypeCode,
			Map<String, MetalPriceDto> metalPriceDetailsOld);

	/**
	 * This method will calculate metal value for plain items.
	 * 
	 * @param locationCode
	 * @param inventoryDao
	 * @param priceResponseDataOld
	 * @param priceResponseDataNew
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @return PriceResponseDto
	 */
	PriceResponseDto plainVCalculation(InventoryDetailsDao inventoryDao, PriceDetailsDto priceResponseDataOld,
			PriceResponseDto priceResponseDataNew, BigDecimal measuredWeight, Short measuredQuantity);

	/**
	 * This method will copy the stone details.
	 * 
	 * @param priceResponseDataNew
	 * @return PriceResponseDto
	 */
	PriceResponseDto plainF1Calculation(PriceResponseDto priceResponseDataNew);

	/**
	 * This method will calculate MC for plain items.
	 * 
	 * @param priceResponseDtoOld
	 * @param priceResponseDataNew
	 * @return PriceResponseDto
	 */
	PriceResponseDto plainF2Calculation(PriceDetailsDto priceResponseDtoOld, PriceResponseDto priceResponseDtoNew);

	/**
	 * This method will calculate metal value for studded item.
	 * 
	 * @param priceResponseDataOld
	 * @param priceResponseDataNew
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param inventoryDto
	 * @return PriceResponseDto
	 */
	PriceResponseDto studdedVCalculation(PriceDetailsDto priceResponseDataOld, PriceResponseDto priceResponseDataNew,
			BigDecimal measuredWeight, Short measuredQuantity, InventoryDetailsDao inventoryDto);

	/**
	 * This method will copy the stone charge details from Old to New.
	 * 
	 * @param priceResponseDataOld
	 * @param priceResponseDataNew
	 * @return PriceResponseDto
	 */
	PriceResponseDto studdedF1Calculation(PriceDetailsDto priceResponseDataOld, PriceResponseDto priceResponseDataNew);

	/**
	 * This method will calculate MC for studded items.
	 * 
	 * @param priceResponseDataNew
	 * @param orderDetailsConfig
	 * @return PriceResponseDto
	 */
	PriceResponseDto studdedF2Calculation(PriceResponseDto priceResponseDataNew,
			OrderDetailsConfigDaoExt orderDetailsConfig,PriceDetailsDto priceResponseDataOld);

	/**
	 * This method is used to calculate metal value for multi-metal items.
	 * 
	 * @param inventoryDao
	 * @param priceResponseDataOld
	 * @param priceResponseDataNew
	 * @param measuredWeight
	 * @param quantity
	 * @return PriceResponseDto
	 */
	PriceResponseDto multiMetalVCalculation(InventoryDetailsDao inventoryDao, PriceDetailsDto priceResponseDataOld,
			PriceResponseDto priceResponseDataNew, BigDecimal measuredWeight, Short quantity);

	/**
	 * This method will calculate final value(V + F1 + F2)
	 * 
	 * @param priceResponseDataNew
	 * @return PriceResponseDto
	 */
	PriceResponseDto getFinalPrice(PriceResponseDto priceResponseDataNew);

	/**
	 * This method is used to get rate of a particular metal.
	 * 
	 * @param standardPrice
	 * @param metalTypeCode
	 * @return BigDecimal
	 */
	BigDecimal getMaterialPrice(Map<String, StandardPriceResponseDto> standardPrice, String metalTypeCode);

}
