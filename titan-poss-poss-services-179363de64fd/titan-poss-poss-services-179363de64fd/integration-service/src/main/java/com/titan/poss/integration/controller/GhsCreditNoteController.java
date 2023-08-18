/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GhsCreditNoteTransferDto;
import com.titan.poss.core.dto.GhsCreditNoteUpdateResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.integration.dto.response.GhsCreditNoteDto;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for GHS integration
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("IntegrationGhsCreditNoteController")
@RequestMapping(value = "integration/v2/ghs/credit-notes")
public class GhsCreditNoteController {

	@Autowired
	private GhsService ghsService;

	@ApiOperation(value = "This Method transfer the credit note to ghs", notes = "This API will transfer the credit notes from POSS to GHS")
	@PostMapping(value = "")
	public GhsCreditNoteTransferDto transferCreditNotesToGhs(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Ghs credit note transfer dto", required = true) @RequestBody @Valid GhsCreditNoteTransferDto ghsCreditNoteTransferDto) {
		return ghsService.transferCreditNotesToGhs(vendorCode, ghsCreditNoteTransferDto);
	}

	@ApiOperation(value = "This method will get the credit notes from Ghs", notes = "This API will get all the credit notes from GHS which are open based upon ***locationCode***")
	@GetMapping(value = "")
	public ListResponse<GhsCreditNoteDto> getCreditNotesFromGhs(
			@ApiParam(name = "vendorCode", value = "Vendor Code needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode) {
		return ghsService.getCreditNotesFromGhs(vendorCode);
	}

	@ApiOperation(value = "This method will update the Credit Note after download", notes = "This API will update the status of Credit Note at GHS after downloading to POSS based on ***creditNoteNumber*** and ***fiscalYear***")
	@PatchMapping(value = "")
	public GhsCreditNoteUpdateResponseDto updateCreditNoteAtGhs(
			@ApiParam(name = "ghsDocNo", value = "ghs doc number available in download list", required = true) @RequestParam(name = "ghsDocNo", required = true) int ghsDocNo,
			@ApiParam(name = "fiscalYear", value = "credit note fiscal year", required = true) @RequestParam(name = "fiscalYear", required = true) int fiscalYear,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode) {
		return ghsService.updateCreditNoteAtGhs(ghsDocNo, fiscalYear, vendorCode);
	}

//	@ApiOperation(value = "This method will sync customer information of POSS and GHS", notes = "This API will sync customer of POSS AND GHS system")
//	@PostMapping(value = "/customer")
//	public GhsCustomerDto saveCustomerGhs(
//			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
//			@RequestBody @ApiParam(name = "body", value = "customer", required = true) Object customer) {
//		return ghsService.saveCustomerGhs(vendorCode, customer);
//	}
	
	@ApiOperation(value="This method will get the status of the credit Note",notes="This API will get the status of the credit Note")
	@GetMapping("/status")
	public StringResponse checkCNStatus(
			@ApiParam(name = "ghsDocNo", value = "ghs doc number available in download list", required = true) @RequestParam(name = "ghsDocNo", required = true) int ghsDocNo,
			@ApiParam(name = "fiscalYear", value = "credit note fiscal year", required = true) @RequestParam(name = "fiscalYear", required = true) int fiscalYear,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode){
		return ghsService.checkCNStatus(ghsDocNo, fiscalYear, vendorCode);
	}

}
