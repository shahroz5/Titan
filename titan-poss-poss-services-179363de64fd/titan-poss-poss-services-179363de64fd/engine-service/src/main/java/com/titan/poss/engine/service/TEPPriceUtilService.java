/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.engine.dto.TepConfigurations;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("tEPPriceUtilService")
public interface TEPPriceUtilService {

	/**
	 * @param priceResponseData
	 * @return
	 */
	public TepPriceResponseDto getFinalPrice(TepPriceResponseDto priceResponseData);

	/**
	 * @param locationCode
	 * @param itemDto
	 * @param priceResponseData
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param standardPrice
	 */
	public TepPriceResponseDto plainVCalculation(String locationCode, ItemDao itemDto,
			TepPriceResponseDto priceResponseData, Map<String, StandardPriceResponseDto> standardPrice);

	/**
	 * @param priceResponseData
	 * @param locationCode
	 * @return
	 */
	public TepPriceResponseDto studdedF1Calculation(TepPriceResponseDto priceResponseData, String locationCode,
			CashMemoDetailsDao cashMemo, TepConfigurations tepCofigReponse);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 */
	public void applyUCPCMDeduction(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, ItemDao itemdto);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 */
	public void getFlatItemExceptionValue(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, BigDecimal stdWeight, BigDecimal measuredWeight);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 * @param priceResponseData
	 */
	public void applyStoneLevelException(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 * @param priceResponseData
	 * @param cashMemo
	 * @param itemDto
	 * @param measuredWeight
	 */
	public void setInitialResponse(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, ItemDao itemDto, BigDecimal measuredWeight);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 * @param priceResponseData
	 * @param cashMemoDetailsId
	 * @param itemDto
	 * @param cashMemo 
	 * @param measuredWeight
	 */
	public void calculateUCPStdValue(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, ItemDao itemDto, TepPriceRequest tepRequest, CashMemoDetailsDao cashMemo);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 * @param priceResponseData
	 * @param cashMemoDetailsId
	 * @param itemDto
	 */
	public void applyStuddedCMDeduction(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, CashMemoDetailsDao cashMemo, ItemDao itemDto);

	/**
	 * @param tepCofigReponse
	 * @param priceResponseData
	 */
	public void applyMetalDeductions(TepConfigurations tepCofigReponse, TepPriceResponseDto priceResponseData);

	/**
	 * @param tepCofigReponse
	 * @param priceResponseData
	 */
	public void applyUCPCFADeductions(TepConfigurations tepCofigReponse, TepPriceResponseDto priceResponseData);

	/**
	 * @param locationCode
	 * @param tepCofigReponse
	 * @param priceResponseData
	 */
	public void applyItemLevelExceptionPercentage(TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData);

	/**
	 * @param itemDto
	 * @param priceResponseData
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param cashMemo
	 */
	public void calculateStdWeight(ItemDao itemDto, TepPriceResponseDto priceResponseData, BigDecimal measuredWeight,
			Short measuredQuantity, TepConfigurations tepConfig);

	/**
	 * @param priceResponseData
	 * @param itemDto
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param locationCode
	 * @param standardPrice
	 * @return
	 */
	public TepPriceResponseDto studdedVCalculation(TepPriceResponseDto priceResponseData, ItemDao itemDto,
			BigDecimal measuredWeight, Short measuredQuantity, String locationCode,
			Map<String, StandardPriceResponseDto> standardPrice);

	public PriceResponseDto getPriceDetails(CashMemoDetailsDao cashMemo);

	/**
	 * @param cashMemo
	 * @param priceResponseData
	 * @param tepConfig
	 */
	public void setUCPCMValue(CashMemoDetailsDao cashMemo, TepPriceResponseDto priceResponseData,
			TepConfigurations tepConfig);

	/**
	 * @param cashMemo
	 * @param priceResponseData
	 */
	public void setCMData(CashMemoDetailsDao cashMemo, TepPriceResponseDto priceResponseData);

	/**
	 * @param priceResponseData
	 * @param itemDto
	 * @param tepRequest
	 * @param tepConfig
	 * @param standardPrice
	 * @return
	 */
	public TepPriceResponseDto applyStoneDeductions(TepPriceResponseDto priceResponseData, ItemDao itemDto,
			TepPriceRequest tepRequest, TepConfigurations tepConfig,
			Map<String, StandardPriceResponseDto> standardPrice);

	/**
	 * @param tepConfig
	 * @param priceResponseData
	 */
	public void applyPjwsStoneDeductions(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData);

	/**
	 * @param itemDto
	 * @param priceResponseData
	 * @param locationCode
	 * @param cashMemo
	 * @param tepConfig
	 * @return
	 */
	public TepPriceResponseDto pjwsF1Calculation(ItemDao itemDto, TepPriceResponseDto priceResponseData,
			String locationCode, CashMemoDetailsDao cashMemo, TepConfigurations tepConfig);

	public void applyRefundDeductions(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData);

	public TepPriceResponseDto plainF2Calculation(TepPriceResponseDto priceResponseData, String locationCode,
			CashMemoDetailsDao cashMemo, TepConfigurations tepConfig, ItemDao itemDto);

	public TepPriceResponseDto getF2JsonData(String complexityCode, String priceGroup, TepPriceResponseDto priceResponseData);

	public TepPriceResponseDto studdedF2Calculation(TepPriceResponseDto priceResponseData, String locationCode,
			CashMemoDetailsDao cashMemo, TepConfigurations tepConfig, ItemDao itemDto);

	public void applyPjwsCMDeduction(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData);

	public void multiMetalVCalculation(String locationCode, ItemDao itemDto, BigDecimal measuredWeight, Short measuredQuantity,TepPriceResponseDto priceResponseData,
			Map<String, StandardPriceResponseDto> standardPrice, CashMemoDetailsDao cashMemo,TepConfigurations tepCofigReponse);

	public void applyUCPDiscountRecovery(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig, TepPriceRequest tepRequest);

	public void applyPjwsAndStuddedDiscountRecovery(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig,
			TepPriceRequest tepRequest, CashMemoDetailsDao cashMemo);

	public void ftepDiscountRecovery(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig,
			TepPriceRequest tepRequest);

	public void calculateUCPStdWeight(ItemDao itemDto, TepPriceResponseDto priceResponseData, BigDecimal measuredWeight,
			Short measuredQuantity, TepConfigurations tepConfig, CashMemoDetailsDao cashMemo);

	public void setStoneDetails(TepPriceRequest tepRequest, TepPriceResponseDto priceResponseData,
			TepConfigurations tepCofig);
}
