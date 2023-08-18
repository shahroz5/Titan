/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnCancelDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface EinvoiceService {

	public EinvoiceIrnDetailsResponseDto generateIrn(String vendorCode, String transactionType,
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto);

	public EinvoiceIrnCancelDetailsResponseDto cancelIrn(String transactionId, String cancelTxnId,String vendorCode,
			String invoiceRefNumber, String docNo, String reason, String remarks);

	public EinvoiceGstVerifyResponseDto verifyGstIn(String vendorCode, String gstIn);

}
