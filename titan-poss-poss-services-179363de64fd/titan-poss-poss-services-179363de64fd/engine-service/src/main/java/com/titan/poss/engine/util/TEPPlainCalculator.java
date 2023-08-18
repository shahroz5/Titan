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
public class TEPPlainCalculator extends TEPPriceCalculator {

	@Override
	public void v(TEPPriceUtilService priceUtilService) {
		// measured_weight is a metal_std_weight
		priceUtilService.plainVCalculation(locationCode, itemDto, priceResponseData, standardPrice);
	}
	
	@Override
	public void f2(TEPPriceUtilService priceUtilService) {
		priceResponseData = priceUtilService.plainF2Calculation(priceResponseData, locationCode, cashMemo,
				tepConfig,itemDto);

	}

	@Override
	void applyDeductions(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyMetalDeductions(tepConfig, priceResponseData);

		// no cmDeductions and discount recovery on plain as it should be taken from
		// stone value

		// item exception deduction is same in all scenarios
		priceUtilService.applyItemLevelExceptionPercentage(tepConfig, priceResponseData);

	}


	/**
	 * @param locationCode
	 * @param itemDto
	 * @param productGroupDetail
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param standardPrice
	 */
	public TEPPlainCalculator(String locationCode, ItemDao itemDto, ProductGroupDao productGroupDetail,
			TepPriceRequest tepPriceRequest, TepConfigurations tepCofigReponse, CashMemoDetailsDao cashMemo) {
		super(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);
	}

}
