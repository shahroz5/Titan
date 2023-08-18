/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.service.CMPrintService;
import com.titan.poss.sales.service.PrintService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesPrintController")
@RequestMapping(value = "sales/v2/prints")
public class PrintController {

	@Autowired
	PrintService printService;

	@Autowired
	CMPrintService cmPrintService;

	// @formatter:off
	@ApiOperation(value = "This API will return the pdf document according to document type", notes = " This API will takes document type and transaction id as input and return the pdf documnent<br/>"
			+ "Ignore option field. No need to pass anything<br/>"
			+ "invoiceType - MAIL,PRINT,BOTH")
	// @formatter:on
	@PostMapping()
	public ResponseEntity<Resource> generateDocument(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String transactionId,
			@RequestParam @ApiParam(value = "provide Document Type", allowableValues = "CM, AB, ACCEPT_ADVANCE, GC, GEP, GEP_CANCEL, TEP_CANCEL, GRN, TEP, DEPOSIT, GRF, MERGE_GRF, COA, CM_ANNEXURE, TEP_REFUND, TEP_ANNEXURE, BILL_CANCELLATION, GC_WITH_CN, GC_WITH_RETURN,CM_CANCELLATION,CREDIT_NOTE,TEP_DIGITAL_SIGNATURE,GEP_DIGITAL_SIGNATURE,CREDIT_NOTE_CANCELLATION,CO", required = true) @ValueOfEnum(enumClass = PrintDocumentTypeEnum.class) String documentType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam @ApiParam(value = "provide File Type", allowableValues = "INVOICE_PRINT, CHEQUE_PRINT, CASH_PRINT", required = true) @ValueOfEnum(enumClass = PrintFileTypeEnum.class) String fileType,
			@RequestParam(required = false, defaultValue = "PRINT") @ApiParam(value = "provide Invoice Type", allowableValues = "PRINT, MAIL, BOTH", required = false) @ValueOfEnum(enumClass = InvoiceDocumentTypeEnum.class) String invoiceType,
			@RequestParam(required = false, defaultValue = "false") @ApiParam(value = "Last Transaction Print", required = false) Boolean lastTransactionPrint,
			@RequestBody(required = false) PrintRequestDto printRequest,
			@RequestParam(required = false, defaultValue = "false") @ApiParam(value = "isReprint", required = false) Boolean isReprint) {
		if (PrintDocumentTypeEnum.CM.name().equals(documentType)
				|| PrintDocumentTypeEnum.COA.name().equals(documentType)
				|| PrintDocumentTypeEnum.CREDIT_NOTE.name().equals(documentType))
			return cmPrintService.generateDocument(documentType, id, fileType, transactionId, invoiceType,
					lastTransactionPrint, printRequest, isReprint);
		else
			return printService.generateDocument(documentType, id, fileType, transactionId, invoiceType,
					lastTransactionPrint, printRequest, isReprint);
	}

	// @formatter:off
	@ApiOperation(value = "This API will return the pdf document according to document type", notes = " This API will takes document type and transaction id as input and return the pdf documnent<br/>"
			+ "Ignore option field. No need to pass anything<br/>"
			+ "invoiceType - MAIL,PRINT,BOTH")
	// @formatter:on
	@PostMapping("reprint")
	public ResponseEntity<Resource> rePrintDocument(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String transactionId,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam @ApiParam(value = "provide Document Type", allowableValues = "CM, AB, ACCEPT_ADVANCE, GC, GEP, GEP_CANCEL, TEP_CANCEL, GRN, TEP, DEPOSIT, GRF, MERGE_GRF, CM_ANNEXURE, TEP_REFUND, TEP_DIGITAL_SIGNATURE, GEP_DIGITAL_SIGNATURE, BILL_CANCELLATION, CM_CANCELLATION, GC_WITH_CN, GC_WITH_RETURN, CREDIT_NOTE_CANCELLATION, CO", required = true) @ValueOfEnum(enumClass = PrintDocumentTypeEnum.class) String documentType,
			@RequestParam @ApiParam(value = "provide File Type", allowableValues = "INVOICE_PRINT,CHEQUE_PRINT, CASH_PRINT", required = true) @ValueOfEnum(enumClass = PrintFileTypeEnum.class) String fileType,
			@RequestParam(defaultValue = "PRINT") @ApiParam(value = "provide Invoice Type", allowableValues = "PRINT, MAIL, BOTH", required = false) @ValueOfEnum(enumClass = InvoiceDocumentTypeEnum.class) String invoiceType,
			@RequestBody(required = false) PrintRequestDto printRequest) {
		if (PrintDocumentTypeEnum.CM.name().equals(documentType)
				|| PrintDocumentTypeEnum.COA.name().equals(documentType))
			return cmPrintService.generateDocument(documentType, id, fileType, transactionId, invoiceType, false,
					printRequest, true);
		else
			return printService.rePrintDocument(documentType, id, fileType, transactionId, invoiceType, printRequest);
	}

	// @formatter:off
	@ApiOperation(value="This API will throw an exception if customer does not contain emailId and try to mail the document")
	// @formatter:on
	@GetMapping("/customerId")
	public ResponseEntity<String> VerifyCustomerEmail(
			@ApiParam(name = "customerId") @RequestParam(name = "customerId", required = false) Integer customerId) {
		return printService.verifyCustomerEmail(customerId);
	}

	// @formatter:off
		@ApiOperation(value="This API will return the list of transaction id's based on home bank and non home bank for cheque deposit")
		// @formatter:on
	@PostMapping("/deposit")
	public Map<String, PrintRequestDto> getTransactionIds(@RequestBody(required = true) PrintRequestDto printRequest) {
		return printService.getIds(printRequest);
	}
}
