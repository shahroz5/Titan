/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.sales.service.CommonTransactionService;

import io.swagger.annotations.ApiOperation;

/**
 * Controller class for EinvoiceIRN.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("eInvoiceIRNController")
@RequestMapping("sales/v2/einvoice")
public class EInvoiceIRNController {
	
	@Autowired
	private CommonTransactionService commanTxnService;

	// @formatter:off
			@GetMapping("/copy_invoice_docs")
			@ApiOperation(value = "API to copy invoice documents from POSS to EPOSS", notes = "This API will copy invoice documents(till today) from POSS to EPOSS")
			// @formatter:on
			public void copyInvoice() {
				commanTxnService.copyInvoiceDocuments();
			}

}