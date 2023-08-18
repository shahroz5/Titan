/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.inventory.service.IntegrationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Override
	public void getInvoiceService(String invNo) {
		integrationServiceClient.getInvoice(invNo);
	}

	@Override
	public void getStnService(String stnNo) {
		integrationServiceClient.getStn(stnNo);
	}

}
