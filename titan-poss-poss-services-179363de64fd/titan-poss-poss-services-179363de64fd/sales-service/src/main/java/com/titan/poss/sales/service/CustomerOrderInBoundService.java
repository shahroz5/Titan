/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.sales.dto.COInBoundItemDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CustomerOrderInBoundService {
	
	/**
	 * This method will return the list of locations where the Inventory is available.
	 * 
	 * @param itemCode
	 * @return
	 */

	List<COInBoundItemDetailsDto> searchAvailableItemList(String itemCode,String baseLocationCode);

}
