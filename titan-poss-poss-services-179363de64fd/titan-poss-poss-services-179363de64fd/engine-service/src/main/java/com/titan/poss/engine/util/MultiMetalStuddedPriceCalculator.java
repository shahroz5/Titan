/**
*Copyright 2019. Titan Company Limited All rights reserved.
 */

package com.titan.poss.engine.util;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.engine.service.PriceUtilService;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;

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
	public void v(PriceUtilService priceUtilService) {

		priceResponseData = priceUtilService.multiMetalVCalculation(locationCode, inventoryDetail, itemDto,
				priceResponseData, measuredWeight, measuredQuantity, standardPrice);

	}

	public MultiMetalStuddedPriceCalculator(String locationCode, ItemDao itemDto, InventoryDetailsDao inventoryDetail,
			ProductGroupDao productGroupDetail, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> standardPrice,Boolean checkInventory, Boolean isCOMPrice) {
		super(locationCode, itemDto, inventoryDetail, productGroupDetail, measuredWeight, measuredQuantity,
				standardPrice,checkInventory,isCOMPrice);
	}
}
