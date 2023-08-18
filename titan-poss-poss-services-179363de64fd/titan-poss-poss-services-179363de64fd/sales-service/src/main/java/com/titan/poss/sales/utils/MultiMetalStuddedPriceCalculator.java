/**
*Copyright 2019. Titan Company Limited All rights reserved.
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
public class MultiMetalStuddedPriceCalculator extends StuddedPriceCalculator {

	@Override
	public void v(OrderPriceUtilService priceUtilService) {

		priceResponseDtoNew = priceUtilService.multiMetalVCalculation(inventoryDetail, priceDetailsOld,
				priceResponseDtoNew, measuredWeight, measuredQuantity);

	}

	public MultiMetalStuddedPriceCalculator(InventoryDetailsDao inventoryDetail, BigDecimal measuredWeight,
			Short measuredQuantity, Map<String, StandardPriceResponseDto> freezedPrice,
			OrderDetailsDaoExt orderDetailsDao, OrderDetailsConfigDaoExt orderDetailsConfig,
			PriceDetailsDto priceDetailsOld) {
		super(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice, orderDetailsDao, orderDetailsConfig,
				priceDetailsOld);
	}
}
