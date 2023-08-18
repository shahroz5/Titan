/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CMLegacyResponseDto;
import com.titan.poss.core.dto.CreditNoteLegacyInboundRequestDto;
import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.integration.dto.response.PossCashPaidDetailsDto;
import com.titan.poss.integration.service.LegacyInBoundService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationLegacyInBoundController")
@RequestMapping(value = "integration/v2/legacy/inbound")
public class LegacyInBoundController {

	@Autowired
	private LegacyInBoundService legacyInBoundService;

	/**
	 * @param gvDetails
	 * @return List<GiftDetailsResponseDto>
	 */
	@ApiOperation(value = "View the list of Gift Voucher Details", notes = "This API returns the list of all the Gift Voucher Details or based on  **seriesOfSerialNo**")
	@PostMapping("/gift-voucher")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public List<LegacyGVResponse> listGiftDetails(@RequestBody @Valid GVRequestDto gvDetails) {
		return legacyInBoundService.listGiftDetails(gvDetails);
	}

	/**
	 * This method will update the status of the gift voucher
	 * 
	 * @param giftStatusUpdate
	 * @return List<GVStatusDto>
	 */
	@ApiOperation(value = "This method will update the status of the gift voucher ", notes = " This method will update the status of the gift voucher based on **serialNo**")
	@PutMapping(value = "/gift-voucher/status")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public List<GVStatusDto> updateGiftStatus(@RequestBody @Valid GVRequestUpdateDto giftStatusUpdate) {
		return legacyInBoundService.updateGiftStatus(giftStatusUpdate);
	}

	@ApiOperation(value = "This method will get the CM details for GRN in Legacy", notes = " This method will get the CM in NAP based on **locationCode** && **refDocNo** && **refFiscalYear**")
	@GetMapping(value = "/cash-memo")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public CMLegacyResponseDto getCashMemoDetails(
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear) {
		return legacyInBoundService.getCashMemoDetailsService(locationCode, refFiscalYear, refDocNo);
	}

	@ApiOperation(value = "This method will transfer the credit note details", notes = " This method will transfer the customer and credit note details from Legacy application to NAP")
	@PostMapping(value = "/credit-note")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public CreditNoteLegacyInboundRequestDto transferCreditNote(
			@RequestBody(required = true) CreditNoteLegacyInboundRequestDto cnTransferLegacyRequestDto) {
		return legacyInBoundService.transferCreditNote(cnTransferLegacyRequestDto);
	}

	@ApiOperation(value = "This method will update the CM details after GRN is done from legacy to NAP", notes = " This method will Update the CM in NAP after GRN is done in Legacy")
	@PostMapping(value = "/grn-items")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public void updateGrnItemsLegacy(@RequestBody(required = true) GrnLegacyUpdateDto updatedGrnDto) {
		legacyInBoundService.updateGrnItemsLegacyService(updatedGrnDto);
	}

	@ApiOperation(value = "This method will update the CM details after TEP is done from legacy to NAP", notes = " This method will Update the CM in NAP after GRN is done in Legacy")
	@PostMapping(value = "/tep-items")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public void updateTepItemsLegacy(@RequestBody(required = true) TepLegacyUpdateDto updatedTepDto) {
		legacyInBoundService.updateTepItemsLegacyService(updatedTepDto);
	}

	@ApiOperation(value = "API to get cash paid for the busines date at current location.", notes = "API to get cash paid for the busines date at current location.<br>"
			+ "<b>NOTE: </b>This API will be used by Legacy to get cash payment details.<br>")
	@GetMapping(value = "cash-payments")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public PossCashPaidDetailsDto getCashCollectedAtPOSS(
			@ApiParam(name = "searchType", value = "Provide 'searchType'", required = true, allowableValues = "MOBILE_NO, ULP_ID") @RequestParam(name = "searchType", required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(name = "searchValue", value = "Provide 'searchValue'", required = true) @RequestParam(name = "searchValue", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String searchValue,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate'", required = true) @RequestParam(name = "businessDate", required = true) @PatternCheck(regexp = "^\\d{4}-\\d{2}-\\d{2}$", nullCheck = true) String businessDate,
			@ApiParam(name = "locationCode", value = "Provide 'locationCode'", required = true) @RequestParam(name = "locationCode", required = true) String locationCode) {

		return legacyInBoundService.getCashCollectedAtPOSS(searchType, searchValue, businessDate, locationCode);

	}
	
	@ApiOperation(value = "Retrieve NAP pmla details", notes = "This API gets the NAP PMLA Details avaiable in NAP based on  **dtBusinessDate** && **ulpMembershipId**"
			+ "<b>NOTE: </b>This API will be used by Legacy to get PMLA details.<br>")
	@PostMapping("/pmla")
	public PmlaLegacyResponseDto getPmlaDetails(
			@RequestParam(name = "dtBusinessDate", required = true) String dtBusinessDate,
			@RequestParam(name = "ulpMembershipId", required = true) String ulpMembershipId) {
		return legacyInBoundService.getPmlaNapService(dtBusinessDate, ulpMembershipId);
	}

	/**
	 * @param searchField
	 * @param searchType
	 * @param fiscalYear
	 * @param locationCode
	 * @return
	 */
	@GetMapping("legacy_view-tcs")
	public List<CustomerTcsDetailsDto> retrieveLegacyTcsPaymentDetails(
			@ApiParam(value = "value", required = true) @RequestParam(required = true) String searchField,
			@ApiParam(value = "type of search", allowableValues = "MOBILE_NO, ULP_ID", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(value = "fiscalYear", required = true) @RequestParam(required = true) Short fiscalYear,
			@ApiParam(value = "locationCode", required = true)@RequestParam(required = true) String locationCode)
			{
		SearchTypeEnum searchTypeEnum = SearchTypeEnum.valueOf(searchType);
		return legacyInBoundService.retrieveLegacyTcsPaymentDetails(searchTypeEnum, searchField,fiscalYear,locationCode);

	}
	/**
	 * This method will get the TCS data against a Customer MobileNumber, Botique
	 * PanCard for a FiscalYear from EPOSS
	 * 
	 * @param customerMobileNo
	 * @param fiscalYear
	 * @param btqPanCard
	 * @return
	 */
	@GetMapping("tcs")
	public CustomerTcsData retrieveTcsData(
			@RequestParam(name = "customerMobileNo", required = true) @PatternCheck(regexp = RegExConstants.NUMERIC_REGEX) String customerMobileNo,
			@RequestParam(name = "fiscalYear", required = true) Short fiscalYear,
			@RequestParam(name = "btqPanCard", required = true) String btqPanCard) {
		return legacyInBoundService.retrieveTcsData(customerMobileNo, fiscalYear, btqPanCard);

	}
}