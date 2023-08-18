/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import org.springframework.stereotype.Service;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface ErpOutBoundService {

	void getStnService(String stnNo);

	void getInvoiceService(String invNo);

}
