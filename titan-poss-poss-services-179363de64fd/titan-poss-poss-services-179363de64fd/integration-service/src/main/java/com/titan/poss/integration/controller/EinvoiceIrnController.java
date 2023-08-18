/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.EinvoiceErrorEnum;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.EinvoiceGstVerifyResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnCancelDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.integration.service.EinvoiceService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationEinvoiceIrnController")
@RequestMapping("integration/v2/einvoice/irn")
public class EinvoiceIrnController {

	@Autowired
	private EinvoiceService einvoiceService;

	@ApiOperation(value = "einvoice verify GSTIN number of the customer", notes = "This API will verify the GSTIN number of the customer")
	@PostMapping(value = "/verify")
	public EinvoiceGstVerifyResponseDto verifyGstIn(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "IRN_ASPTAX", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "gstIn", value = "gstIn number of the customer", required = false) @RequestParam(name = "gstIn", required = false) String gstIn) {

		return einvoiceService.verifyGstIn(vendorCode, gstIn);
	}

	@ApiOperation(value = "einvoice generate IRN", notes = "This API will send details to einvoice service to generate IRN")
	@PostMapping(value = "")
	public EinvoiceIrnDetailsResponseDto generateIrn(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "IRN_ASPTAX", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "transactionType", value = "transaction type for e-invoice", allowableValues = "CASH_MEMO,TEP,GEP,RETURN_INVOICE,RETURN_STN,GRN,TEP_RETURN,GEP_RETURN", required = true) @RequestParam(name = "transactionType", required = true) @ValueOfEnum(enumClass = EinvoiceTransactionTypeEnum.class) String transactionType,
			@ApiParam(name = "body", value = "details to generate IRN einvoice dto", required = true) @RequestBody @Valid EinvoiceIrnDetailsDto einvoiceIrnDetailsDto) {

		return einvoiceService.generateIrn(vendorCode, transactionType, einvoiceIrnDetailsDto);
	}

	@ApiOperation(value = "einvoice cancel IRN", notes = "This API will send details to einvoice service to cancel IRN")
	@PostMapping(value = "/cancel")
	public EinvoiceIrnCancelDetailsResponseDto cancelIrn(
			@ApiParam(name = "transactionId", value = "transactionId for audit", required = true) @RequestParam(name = "transactionId", required = true) String transactionId,
			@ApiParam(name = "cancelTxnId", value = "cancel transaction id", required = true) @RequestParam(name = "cancelTxnId", required = true) String cancelTxnId,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "IRN_ASPTAX", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "invoiceRefNumber", value = "invoice ref number for cancellation", required = true) @RequestParam(name = "invoiceRefNumber", required = true) String invoiceRefNumber,
			@ApiParam(name = "docNo", value = "doc No of the transaction", required = true) @RequestParam(name = "docNo", required = true) String docNo,
			@ApiParam(name = "reason", value = "reason for cancellation", allowableValues = "DUPLICATE,DATA_ENTRY_MISTAKE,ORDER_CANCELLED,OTHERS", required = true) @RequestParam(name = "reason", required = true) @ValueOfEnum(enumClass = EinvoiceErrorEnum.class) String reason,
			@ApiParam(name = "remarks", value = "remarks for cancellation", required = false) @RequestParam(name = "remarks", required = true) String remarks) {

		return einvoiceService.cancelIrn(transactionId, cancelTxnId, vendorCode, invoiceRefNumber, docNo, reason,
				remarks);

	}

}
