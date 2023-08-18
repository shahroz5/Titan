/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.CreditNoteLegacyResponseDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.integration.service.LegacyOutBoundService;
import com.titan.poss.sales.dto.CashMemoEntities;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationLegacyOutBoundController")
@RequestMapping(value = "integration/v2/legacy/outbound")
public class LegacyOutBoundController {

	@Autowired
	private LegacyOutBoundService legacyOutboundService;

	@ApiOperation(value = "View the list of Gift Voucher Details in Legacy", notes = "This API lists the Gift Voucher status Details avaiable in Legacy based on  **seriesOfSerialNo** && **seriesOfItemCode**")
	@PostMapping("/gift-voucher")
	public List<LegacyGVResponse> getGiftVoucher(@RequestBody GVRequestDto giftStatusReq) {
		return legacyOutboundService.getGiftVoucherService(giftStatusReq);
	}

	/**
	 * This method will update the status of the gift voucher in Legacy
	 * 
	 * @param giftStatusReq
	 * @return List<GVStatusDto>
	 */
	@ApiOperation(value = "This method will update the status of the gift voucher in Legacy", notes = " This method will update the status of the gift voucher based on **serialNo** & **itemCode**")
	@PostMapping(value = "/gift-voucher/status")
//	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')") -- redemption at POSS level is failing because of this check.
	public List<GVStatusDto> getGiftVoucherUpdate(@RequestBody GVRequestUpdateDto giftStatusReq) {
		return legacyOutboundService.getGiftVoucherUpdateService(giftStatusReq);
	}

	@ApiOperation(value = "This method will transfer the credit note details", notes = "This method will transfer the customer and credit note details from NAP to Legacy application")
	@PostMapping(value = "/credit-note")
	public CreditNoteLegacyResponseDto transferCreditNote(
			@ApiParam(name = "id", value = "id of the creditNote", required = true) @RequestParam(name = "id", required = true) String id,
			@ApiParam(name = "destLocationCode", value = "destination location code where the CN needs to be transferred", required = true) @RequestParam(name = "destLocationCode", required = true) String destLocationCode) {
		return legacyOutboundService.transferCreditNote(id,destLocationCode);
	}

	@ApiOperation(value = "This method will get the CM details for GRN in NAP", notes = " This method will get the CM in Legacy based on **locationCode** && **refDocNo** && **refFiscalYear**")
	@GetMapping(value = "/cash-memo")
	//@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public CashMemoEntities getCashMemoDetails(
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@RequestParam(name = "isGRNAllowed", required = false) Boolean isGRNAllowed) {
		return legacyOutboundService.getCashMemoDetailsService(locationCode, refFiscalYear, refDocNo,isGRNAllowed);
	}
	
	@ApiOperation(value = "This method will get the CM details for GRN in NAP", notes = " This method will get the CM in Legacy based on **locationCode** && **refDocNo** && **refFiscalYear**")
	@GetMapping(value = "/cash-memo/tep")
	//@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public CashMemoEntities getTepCashMemoDetails(
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@RequestParam(name = "isInterBrand", required = true) Boolean isInterBrand,
			@RequestParam(name = "isFullValueTEP", required = true) Boolean isFullValueTEP) {
		return legacyOutboundService.getTepCashMemoDetailsService(locationCode, refFiscalYear, refDocNo,isInterBrand,isFullValueTEP);
	}
	
	@ApiOperation(value = "This method will get the CM details for Customer info and itemcode in NAP", notes = " This method will get the CM in Legacy based on **locationCode** && **refDocNo** && **refFiscalYear**")
	@GetMapping(value = "/cash-memo/cmcustomer")
	//@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public  List<CmForCustomerLegacyDto> getCMforCustomer(@RequestParam(name = "locationCode", required = true) String locationCode,
			@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "customerMobileNo", required = false) String customerMobileNo,
			@RequestParam(name = "customerId", required = false) String customerId,
			@RequestParam(name = "isMigratedIgnored", required = false) Boolean isMigratedIgnored){
		return legacyOutboundService.getCMforCustomer(locationCode, itemCode, customerMobileNo, customerId,isMigratedIgnored);
	}
	
	
	@ApiOperation(value = "This method will update the CM details after GRN done from NAP to Legacy", notes = " This method will Update the"
			+ " CM in Legacy after GRN is done in NAP")
	@PostMapping(value = "/grn-items")
	public void updateGrnItemsLegacy(@RequestBody(required = true) GrnLegacyUpdateDto updatedGrnDto) {
		 legacyOutboundService.updateGrnItemsLegacyService(updatedGrnDto);
	}
	
	/*
	 * @ApiOperation(value = "Retrieve Legacy pmla details", notes =
	 * "This API gets the Legacy PMLA Details avaiable in Legacy based on  **dtBusinessDate** && **ulpMembershipId**"
	 * )
	 * 
	 * @PostMapping("/pmla") public PmlaLegacyResponseDto getPmlaDetails(
	 * 
	 * @RequestParam(name = "dtBusinessDate", required = true) String
	 * dtBusinessDate,
	 * 
	 * @RequestParam(name = "ulpMembershipId", required = true) String
	 * ulpMembershipId) { return
	 * legacyOutboundService.getPmlaNapService(dtBusinessDate, ulpMembershipId); }
	 */
	
	@ApiOperation(value = "This method will update the CM details after TEP done from NAP to Legacy", notes = " This method will Update the CM in Legacy after GRN is done in NAP")
	@PostMapping(value = "/tep-items")
	public void updateTepItemsLegacy(@RequestBody(required = true) TepLegacyUpdateDto updatedTepDto) {
		legacyOutboundService.updateTepItemsLegacyService(updatedTepDto);
	}
	
	@ApiOperation(value = "Retrieve Legacy pmla details", notes = "This API gets the Legacy PMLA Details avaiable in Legacy based on  **dtBusinessDate** && **ulpMembershipId**")
	@PostMapping("/pmla")
	public PmlaLegacyResponseDto getPmlaDetails(
			@RequestParam(name = "dtBusinessDate", required = true) String dtBusinessDate,
			@RequestParam(name = "ulpMembershipId", required = true) String ulpMembershipId) {
		return legacyOutboundService.getPmlaNapService(dtBusinessDate, ulpMembershipId);
	}
}
