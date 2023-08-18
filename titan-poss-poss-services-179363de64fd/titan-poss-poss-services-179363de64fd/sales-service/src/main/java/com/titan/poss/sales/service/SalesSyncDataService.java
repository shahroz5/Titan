/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.SyncStagingDto;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface SalesSyncDataService {
	
	public void publishSalesMessagesToQueue(SyncStagingDto data);
}
