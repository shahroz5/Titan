/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.sales.dto.CustomerOrderDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CustomerOrderService {
  
	 List<CustomerOrderDetailsDto>   getCustomerOrders(String locationCode, String requestTypes);
}
