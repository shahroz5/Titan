/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.inventory.service;

import org.springframework.stereotype.Service;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface InventoryDocMasterService {

	Integer getDocNumber(short year, String locationCode, String docType);
}
