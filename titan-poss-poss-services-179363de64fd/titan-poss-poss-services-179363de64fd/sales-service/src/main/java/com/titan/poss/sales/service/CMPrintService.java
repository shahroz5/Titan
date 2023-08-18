/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.titan.poss.sales.dto.request.PrintRequestDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CMPrintService {

	/**
	 * 
	 * @param documentType
	 * @param fileType
	 * @param transactionId
	 * @param lastTransactionPrint 
	 * @param invoiceType2
	 * @throws Exception
	 */
	ResponseEntity<Resource> generateDocument(String documentType, String productCode, String fileType,
			String transactionId, String invoiceType, Boolean lastTransactionPrint,PrintRequestDto printRequest,Boolean isReprint);
	
	/**
	 * @param customerId
	 * @return
	 */
	ResponseEntity<String> verifyCustomerEmail(Integer customerId);

	Map<String,PrintRequestDto> getIds(PrintRequestDto printRequest);
}
