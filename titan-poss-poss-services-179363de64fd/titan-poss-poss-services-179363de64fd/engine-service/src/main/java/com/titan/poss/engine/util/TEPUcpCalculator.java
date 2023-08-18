/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.util;

import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.engine.dto.TepConfigurations;
import com.titan.poss.engine.service.TEPPriceUtilService;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class TEPUcpCalculator extends TEPPriceCalculator {

	/**
	 * @param locationCode
	 * @param itemDto
	 * @param productGroupDetail
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param standardPrice
	 */
	public TEPUcpCalculator(String locationCode, ItemDao itemDto, ProductGroupDao productGroupDetail,
			TepPriceRequest tepPriceRequest, TepConfigurations tepCofigReponse, CashMemoDetailsDao cashMemo) {
		super(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);
	}


	@Override
	void setCMData(TEPPriceUtilService priceUtilService) {
		priceUtilService.setUCPCMValue(cashMemo, priceResponseData, tepConfig);
	}


	@Override
	public void calculateStdValue(TEPPriceUtilService priceUtilService) {
		// in exception and cm
		// in case of ucp only final value to be returned from itemmaster
		if (priceResponseData != null && priceResponseData.getFinalValue() == null) {
			// if ucp cm value or final value from item master
			priceUtilService.calculateUCPStdValue(locationCode, tepConfig, priceResponseData, itemDto,
					tepRequest,cashMemo);

		}

	}
	
	@Override
	public void applyStoneDeductions(TEPPriceUtilService priceUtilService) {
		// measured_weight is a metal_std_weight
//		priceResponseData = priceUtilService.applyStoneDeductions(priceResponseData, itemDto,
//				tepRequest, tepConfig, standardPrice);
		priceUtilService.calculateUCPStdWeight(itemDto, priceResponseData, tepRequest.getMeasuredWeight(),
				tepRequest.getMeasuredQuantity(), tepConfig,cashMemo);
	}

	@Override
	void applyDeductions(TEPPriceUtilService priceUtilService) {
		// getCMValue for UCP
		priceResponseData.setCustomerType(tepRequest.getCustomerType());
		// cfa deduction should be applied on final value
		priceUtilService.applyUCPCFADeductions(tepConfig, priceResponseData);
		// cm deduction should be applied on stoneweight
		priceUtilService.applyUCPCMDeduction(locationCode, tepConfig, priceResponseData, itemDto);
		priceUtilService.applyItemLevelExceptionPercentage(tepConfig, priceResponseData);

	}
	
	@Override
	void applyDiscountRecovery(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyUCPDiscountRecovery(priceResponseData,tepConfig,tepRequest);
	}





}
