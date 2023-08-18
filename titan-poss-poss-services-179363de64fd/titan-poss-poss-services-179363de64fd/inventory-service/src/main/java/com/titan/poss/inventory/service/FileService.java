/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface FileService {

	void runReturnInvoiceJob(Integer stockInvoiceId, String token, String cookie);
	
	void runIbtStnJob(Integer stockTransferId, String token, String cookie);

}
