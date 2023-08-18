/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.util;

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
@EqualsAndHashCode(callSuper = false)
@Data
public class TEPStuddedCalculator extends TEPPriceCalculator {

	/**
	 * @param locationCode
	 * @param itemDto
	 * @param productGroupDetail
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param standardPrice
	 */
	public TEPStuddedCalculator(String locationCode, ItemDao itemDto, ProductGroupDao productGroupDetail,
			TepPriceRequest tepPriceRequest, TepConfigurations tepCofigReponse, CashMemoDetailsDao cashMemo) {
		super(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);
	}

	@Override
	public void applyStoneDeductions(TEPPriceUtilService priceUtilService) {
		// measured_weight is a metal_std_weight
		priceResponseData = priceUtilService.applyStoneDeductions(priceResponseData, itemDto,
				tepRequest, tepConfig, standardPrice);
	}

	@Override
	public void v(TEPPriceUtilService priceUtilService) {
		// measured_weight is a metal_std_weight
		priceResponseData = priceUtilService.studdedVCalculation(priceResponseData, itemDto,
				tepRequest.getMeasuredWeight(), tepRequest.getMeasuredQuantity(), locationCode, standardPrice);
	}

	@Override
	public void f1(TEPPriceUtilService priceUtilService) {
		priceResponseData = priceUtilService.studdedF1Calculation(priceResponseData, locationCode, cashMemo,
				tepConfig);

	}
	
	@Override
	public void f2(TEPPriceUtilService priceUtilService) {
		priceResponseData = priceUtilService.studdedF2Calculation(priceResponseData, locationCode, cashMemo,
				tepConfig,itemDto);

	}

	@Override
	void applyDeductions(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyMetalDeductions(tepConfig, priceResponseData);

		// no cm deductions on plain as it should be taken froms stone value
		priceUtilService.applyStuddedCMDeduction(locationCode, tepConfig, priceResponseData, cashMemo, itemDto);

		// item exception deduction is same in all scenarios
		priceUtilService.applyItemLevelExceptionPercentage(tepConfig, priceResponseData);
	}
	
	@Override
	void applyDiscountRecovery(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyPjwsAndStuddedDiscountRecovery(priceResponseData,tepConfig,tepRequest,cashMemo);
	}

}
