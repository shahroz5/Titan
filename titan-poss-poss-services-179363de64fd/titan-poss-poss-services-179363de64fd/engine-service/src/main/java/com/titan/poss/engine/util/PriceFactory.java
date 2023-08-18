/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.util;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PriceFactory {

	public NonUcpPriceCalculator getPriceCalculator(String locationCode, ItemDao itemDto,
			InventoryDetailsDao inventoryDetail, ProductGroupDao productGroupDetail, BigDecimal measuredWeight,
			Short measuredQuantity, Map<String, StandardPriceResponseDto> standardPrice, Boolean checkInventory, Boolean isCOMPrice) {

		if (productGroupDetail.getPricingType().equals(EngineConstants.PLAIN)
				&& isMetalTypeLJorJL(productGroupDetail)) {
			return new MultiMetalPlainPriceCalculator(locationCode, itemDto, inventoryDetail, productGroupDetail,
					measuredWeight, measuredQuantity, standardPrice,checkInventory,isCOMPrice);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.STUDDED)
				&& isMetalTypeLJorJL(productGroupDetail)) {
			return new MultiMetalStuddedPriceCalculator(locationCode, itemDto, inventoryDetail, productGroupDetail,
					measuredWeight, measuredQuantity, standardPrice,checkInventory,isCOMPrice);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PLAIN)) {
			return new PlainPriceCalculator(locationCode, itemDto, inventoryDetail, productGroupDetail, measuredWeight,
					measuredQuantity, standardPrice,checkInventory,isCOMPrice);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.STUDDED)) {
			return new StuddedPriceCalculator(locationCode, itemDto, inventoryDetail, productGroupDetail,
					measuredWeight, measuredQuantity, standardPrice,checkInventory,isCOMPrice);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PJWS)) {
			return new PJWSPriceCalculator(locationCode, itemDto, inventoryDetail, productGroupDetail, measuredWeight,
					measuredQuantity, standardPrice, checkInventory,isCOMPrice);

		} else if (productGroupDetail.getPricingType().equals(EngineConstants.PLAIN_STUDDED)) {
			return new PlainStuddedPriceCalculator(locationCode, itemDto, inventoryDetail, productGroupDetail,
					measuredWeight, measuredQuantity, standardPrice,checkInventory,isCOMPrice);
		}

		else {
			throw new ServiceException("Type not Found", "ERR-INV-013");
		}
	}

	private boolean isMetalTypeLJorJL(ProductGroupDao productGroupDetail) {
		return productGroupDetail.getItemType().getItemTypeCode().equals(EngineConstants.LJ)
				|| productGroupDetail.getItemType().getItemTypeCode().equals(EngineConstants.JL);
	}

}
