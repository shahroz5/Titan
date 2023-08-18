/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface InventoryJobService {

	SchedulerResponseDto closeUnacceptedRequests(String locationCode);

	SchedulerResponseDto publishToDataSync();

	SchedulerResponseDto updateInvoiceDocuments(InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto);
	
	SchedulerResponseDto updateStatusStnConfirm();

}
