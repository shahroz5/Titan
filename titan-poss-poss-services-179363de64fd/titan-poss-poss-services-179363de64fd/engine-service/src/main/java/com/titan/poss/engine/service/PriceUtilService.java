/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;
import com.titan.poss.product.dao.ItemDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface PriceUtilService {

	/**
	 * @param locationCode
	 * @param metalTypeCode
	 * @param applicableDate
	 * @return materialPrice(BigDecimal)
	 */
	public BigDecimal getTodaysMaterialPrice(String locationCode, String metalTypeCode, BusinessDateDto applicableDate);

	/**
	 * @param locationCode
	 * @param priceGroupType
	 * @return priceGroup
	 */
	public String getPriceGroup(String locationCode, String priceGroupType);

	/**
	 * @param metalTypeCode
	 * @param purity
	 * @param karat
	 * @return offset(BigDecimal)
	 */
	public BigDecimal getOffset(String metalTypeCode, BigDecimal purity, BigDecimal karat);

	/**
	 * @param itemCode
	 * @return studdedMakkingCharges(BigDecimal)
	 */
	public BigDecimal getStuddedMakingChargesOld(String itemCode);

	/**
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param inventoryDto
	 * @return measuredStandardWeight(BigDecimal)
	 */
	public BigDecimal getMeasuredStandardWeight(String locationCode, BigDecimal measuredWeight, Short measuredQuantity,
			InventoryDetailsDao inventoryDto);

	/**
	 * @param itemCode
	 * @param lotNumber
	 * @return stoneCharges(BigDecimal)
	 */
	public BigDecimal getStandardStoneCharges(String itemCode, String lotNumber, PriceResponseDto priceResponseData);

	/**
	 * @param complexityCode
	 * @param priceGroup
	 * @param priceResponseDto
	 * @return PriceResponseDto
	 */
	public PriceResponseDto getF2JsonData(String complexityCode, String priceGroup, PriceResponseDto priceResponseDto);

	/**
	 * @param materialMap
	 * @param locationCode
	 * @param itemDto
	 * @param priceResponseData
	 * @return PriceResponseDto
	 */
	public PriceResponseDto getMultiMetalVJsonData(Map<String, BigDecimal> materialMap, String locationCode,
			ItemDao itemDto, PriceResponseDto priceResponseData, Map<String, StandardPriceResponseDto> standardPrice);

	/**
	 * @param itemDto
	 * @param price
	 * @param priceResponseData
	 * @param purity
	 * @param karat
	 * @return PriceResponseDto
	 */
	public PriceResponseDto getMetalVJsonData(ItemDao itemDto, BigDecimal price, PriceResponseDto priceResponseData,
			BigDecimal purity, BigDecimal karat, String locationCode, BigDecimal offset);

	/**
	 * @param priceResponseData
	 * @param itemDto
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param inventoryDto
	 * @param locationCode
	 * @param standardPrice
	 * @return PriceResponseDto
	 */
	public PriceResponseDto studdedVCalculation(PriceResponseDto priceResponseData, ItemDao itemDto,
			BigDecimal measuredWeight, Short measuredQuantity, InventoryDetailsDao inventoryDto, String locationCode,
			Map<String, StandardPriceResponseDto> standardPrice);

	/**
	 * @param priceResponseData
	 * @param inventoryDetail
	 * @return PriceResponseDto
	 */
	public PriceResponseDto studdedF1Calculation(PriceResponseDto priceResponseData,
			InventoryDetailsDao inventoryDetail, String locationCode);

	/**
	 * @param priceResponseData
	 * @param inventoryDto
	 * @return PriceResponseDto
	 */
	public PriceResponseDto studdedF2Calculation(PriceResponseDto priceResponseData, ItemDao itemDto,
			String locationCode,InventoryDetailsDao inventoryDetail);

	/**
	 * @param locationCode
	 * @param itemDto
	 * @param priceResponseData
	 * @return PriceResponseDto
	 */
	public PriceResponseDto plainF2Calculation(String locationCode, ItemDao itemDto,
			PriceResponseDto priceResponseData);

	/**
	 * @param locationCode
	 * @param inventoryDto
	 * @param itemDto
	 * @param priceResponseData
	 * @param measuredWeight
	 * @param quantity
	 * @return PriceResponseDto
	 */
	public PriceResponseDto multiMetalVCalculation(String locationCode, InventoryDetailsDao inventoryDto,
			ItemDao itemDto, PriceResponseDto priceResponseData, BigDecimal measuredWeight, Short quantity,
			Map<String, StandardPriceResponseDto> standardPrice);

	/**
	 * @param priceResponseData
	 * @return PriceResponseDto
	 */
	public PriceResponseDto plainF1Calculation(PriceResponseDto priceResponseData);

	/**
	 * @param locationCode
	 * @param inventoryDto
	 * @param itemDto
	 * @param priceResponseData
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param standardPrice
	 * @return PriceResponseDto
	 */
	public PriceResponseDto plainVCalculation(String locationCode, InventoryDetailsDao inventoryDto, ItemDao itemDto,
			PriceResponseDto priceResponseData, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> standardPrice);

	/**
	 * @param priceResponseData
	 * @return PriceResponseDto
	 */
	public PriceResponseDto getFinalPrice(PriceResponseDto priceResponseData);

	/**
	 * @param gepPriceRequest
	 * @param gepPriceResponseDto
	 * @param businessDate
	 * @return GepPriceResponseDto
	 */
	GepPriceResponseDto calculateGepPrice(GepPriceRequest gepPriceRequest, GepPriceResponseDto gepPriceResponseDto,
			Date businessDate);

	/**
	 * @param standardPrice
	 * @param metalTypeCode
	 * @return
	 */
	BigDecimal getMaterialPrice(Map<String, StandardPriceResponseDto> standardPrice, String metalTypeCode);


}
