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

@Data
@EqualsAndHashCode(callSuper = true)
public class TEPMultiMetalStuddedCalculator extends TEPStuddedCalculator{
	
	
	
	public TEPMultiMetalStuddedCalculator(String locationCode, ItemDao itemDto, ProductGroupDao productGroupDetail,
			TepPriceRequest tepPriceRequest, TepConfigurations tepCofigReponse, CashMemoDetailsDao cashMemo) {
		super(locationCode, itemDto, productGroupDetail, tepPriceRequest, tepCofigReponse, cashMemo);
	}
	
	@Override
	public void v(TEPPriceUtilService priceUtilService) {
		// measured_weight is a metal_std_weight
				priceUtilService.multiMetalVCalculation(locationCode, itemDto,tepRequest.getMeasuredWeight(),tepRequest.getMeasuredQuantity(), priceResponseData, standardPrice,cashMemo,tepConfig);
	}

}
