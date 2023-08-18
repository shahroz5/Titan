/**
Copyright 2019. Titan Company Limited All rights reserved.
*/
package com.titan.poss.engine.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.engine.constant.EngineConstants;
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
/**
 * 
 * 
 * @measuredWeight is mandatory field from UI. and it should be netMetalWeight.
 *
 */
public class PJWSPriceCalculator extends PlainPriceCalculator {

	// should be totalWeight including stone weight
	// priceResponseData =
	// PJWS only metal weight will be stored in inventory

	@Override
	public void f1(PriceUtilService priceUtilService) {

		priceResponseData.getPriceDetails().getStonePriceDetails()
				.setPreDiscountValue(
						itemDto.getStoneCharges().setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));

	}

	public PJWSPriceCalculator(String locationCode, ItemDao itemDto, InventoryDetailsDao inventoryDetail,
			ProductGroupDao productGroupDetail, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> standardPrice, Boolean checkInventory, Boolean isCOMPrice) {
		super(locationCode, itemDto, inventoryDetail, productGroupDetail, measuredWeight, measuredQuantity,
				standardPrice, checkInventory,isCOMPrice);
	}

}
