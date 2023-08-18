/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.utils;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.service.OrderPriceUtilService;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PlainPriceCalculator extends OrderNonUcpPriceCalculator {

	@Override
	public void v(OrderPriceUtilService priceUtilService) {
		// measured_weight is a metal_std_weight
		priceUtilService.plainVCalculation(inventoryDetail, priceDetailsOld, priceResponseDtoNew, measuredWeight,
				measuredQuantity);
	}

	@Override
	public void f1(OrderPriceUtilService priceUtilService) {

		priceResponseDtoNew = priceUtilService.plainF1Calculation(priceResponseDtoNew);

	}

	@Override
	public void f2(OrderPriceUtilService priceUtilService) {
		priceResponseDtoNew = priceUtilService.plainF2Calculation(priceDetailsOld, priceResponseDtoNew);

	}

	public PlainPriceCalculator(InventoryDetailsDao inventoryDetail, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> freezedPrice, OrderDetailsDaoExt orderDetailsDao,
			OrderDetailsConfigDaoExt orderDetailsConfig, PriceDetailsDto priceDetailsOld) {
		super(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice, orderDetailsDao, orderDetailsConfig,
				priceDetailsOld);
	}

}
