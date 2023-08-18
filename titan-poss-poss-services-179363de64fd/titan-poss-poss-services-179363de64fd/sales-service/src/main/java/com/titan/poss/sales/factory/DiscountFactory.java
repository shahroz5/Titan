/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.sales.service.DiscountService;

/**
 * 
 * Factory for different Discount implementation
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class DiscountFactory {

	private Map<String, DiscountService> discountServiceBeans;

	public static final String ERR_DISC_001 = "ERR-DISC-001";
	public static final String INVALID_DISCOUNT_TYPE = "Invalid discount type";

	public DiscountFactory() {
		discountServiceBeans = new HashMap<>();
	}

	public void registerDiscountService(String discountType, DiscountService discountService) {
		discountServiceBeans.put(discountType, discountService);
	}

	/**
	 * This method returns respective service implementation based on discount type.
	 * NOTE: register respective discount services in constructor of respective impl
	 * classes.
	 * 
	 * @param discountType
	 * @return
	 */
	public DiscountService getDiscountService(String discountType) {
		if (discountServiceBeans.containsKey(discountType) && discountServiceBeans.get(discountType) != null) {
			return discountServiceBeans.get(discountType);
		}

		throw new ServiceException(INVALID_DISCOUNT_TYPE, ERR_DISC_001);
	}

}
