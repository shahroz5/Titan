/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.utils;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class OrderPriceFactory {

	public OrderNonUcpPriceCalculator getPriceCalculator(InventoryDetailsDao inventoryDetail, BigDecimal measuredWeight,
			Short measuredQuantity, Map<String, StandardPriceResponseDto> freezedPrice,
			OrderDetailsDaoExt orderDetailsDao, OrderDetailsConfigDaoExt orderDetailsConfig,
			PriceDetailsDto priceDetailsOld) {

		if (orderDetailsConfig.getPricingType().equals(SalesConstants.PLAIN) && isMetalTypeLJorJL(priceDetailsOld)) {
			return new MultiMetalPlainPriceCalculator(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice,
					orderDetailsDao, orderDetailsConfig, priceDetailsOld);

		} else if (orderDetailsConfig.getPricingType().equals(SalesConstants.STUDDED)
				&& isMetalTypeLJorJL(priceDetailsOld)) {
			return new MultiMetalStuddedPriceCalculator(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice,
					orderDetailsDao, orderDetailsConfig, priceDetailsOld);

		} else if (orderDetailsConfig.getPricingType().equals(SalesConstants.PLAIN)) {
			return new PlainPriceCalculator(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice,
					orderDetailsDao, orderDetailsConfig, priceDetailsOld);

		} else if (orderDetailsConfig.getPricingType().equals(SalesConstants.STUDDED)) {
			return new StuddedPriceCalculator(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice,
					orderDetailsDao, orderDetailsConfig, priceDetailsOld);

		} else if (orderDetailsConfig.getPricingType().equals(SalesConstants.PJWS)) {
			return new PJWSPriceCalculator(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice,
					orderDetailsDao, orderDetailsConfig, priceDetailsOld);

		} else if (orderDetailsConfig.getPricingType().equals(SalesConstants.PLAIN_STUDDED)) {
			return new PlainStuddedPriceCalculator(inventoryDetail, measuredWeight, measuredQuantity, freezedPrice,
					orderDetailsDao, orderDetailsConfig, priceDetailsOld);
		}

		else {
			throw new ServiceException("Type not Found", "ERR-INV-013");
		}
	}

	private boolean isMetalTypeLJorJL(PriceDetailsDto priceDetailsOld) {
		return priceDetailsOld.getItemTypeCode().equals(SalesConstants.LJ)
				|| priceDetailsOld.getItemTypeCode().equals(SalesConstants.JL);
	}

}
