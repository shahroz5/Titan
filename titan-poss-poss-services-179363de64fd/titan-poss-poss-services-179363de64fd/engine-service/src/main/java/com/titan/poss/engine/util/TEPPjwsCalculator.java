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

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class TEPPjwsCalculator extends TEPPlainCalculator {

	/**
	 * @param locationCode
	 * @param itemDto
	 * @param productGroupDetail
	 * @param measuredWeight
	 * @param measuredQuantity
	 * @param standardPrice
	 */
	public TEPPjwsCalculator(String locationCode, ItemDao itemDto, ProductGroupDao productGroupDetail,
			TepPriceRequest tepPriceRequest, TepConfigurations tepCofigReponse, CashMemoDetailsDao cashMemo) {
		super(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);
	}

	@Override
	public void f1(TEPPriceUtilService priceUtilService) {
		priceResponseData = priceUtilService.pjwsF1Calculation(itemDto, priceResponseData, locationCode, cashMemo,
				tepConfig);

	}

	@Override
	void applyDeductions(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyMetalDeductions(tepConfig, priceResponseData);

		priceUtilService.applyPjwsStoneDeductions(tepConfig, priceResponseData);
		// no cmDeductions and discount recovery on plain as it should be taken from
		// stone value
		priceUtilService.applyPjwsCMDeduction(tepConfig, priceResponseData);
		
		// item exception deduction is same in all scenarios
		priceUtilService.applyItemLevelExceptionPercentage(tepConfig, priceResponseData);

	}
	
	@Override
	void applyDiscountRecovery(TEPPriceUtilService priceUtilService) {
		priceUtilService.applyPjwsAndStuddedDiscountRecovery(priceResponseData,tepConfig,tepRequest,cashMemo);
	}

}
