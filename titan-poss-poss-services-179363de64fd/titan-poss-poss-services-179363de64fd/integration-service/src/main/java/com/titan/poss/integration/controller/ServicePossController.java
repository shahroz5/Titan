/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.ServiceMetalRequestDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.integration.service.ServicePOSS;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationServicePossController")
@RequestMapping(value = "integration/v2/service-poss")
public class ServicePossController {

	@Autowired
	private ServicePOSS servicePoss;

	@ApiOperation(value = "Method will return today's revenue from service poss", notes = "This API will get today's reveue details from service poss based on ***locationCode*** and ***businessDate***")
	@PostMapping(value = "/todays-revenue")
	public Map<String, List<ServicePossRevenueDto>>  getServiceTodayRevenue(
			@RequestBody @Valid @ApiParam(required = true) ServicePossRequestDto servicePossRequestDto){
		return servicePoss.getServicePossTodayRevenue(servicePossRequestDto);
	}

	@ApiOperation(value = "Method will return consolidated revenue from service poss", notes = "This API will get reveue details from service poss based on ***locationCode*** and ***businessDate*** during EOD")
	@PostMapping(value = "/eod-revenue")
	public Map<String, List<ServicePossRevenueDto>>  getServiceTodayRevenueForEod(
			@RequestBody @Valid @ApiParam(required = true) ServicePossRequestDto servicePossRequestDto){
		return servicePoss.getServicePossTodayRevenueForEod(servicePossRequestDto);
	}
//	
//	@ApiOperation(value = "This Method transfer the credit note to service poss", notes = "This API will transfer the credit notes from POSS to Service POSS")
//	@PostMapping(value = "")
//	public GhsCreditNoteTransferDto transferCreditNotesToServicePOSS(
//			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SERVICE_POSS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
//			@ApiParam(name = "body", value = "Service POSS credit note transfer dto", required = true) @RequestBody @Valid GhsCreditNoteTransferDto ghsCreditNoteTransferDto) {
//		return servicePoss.transferCreditNotesToServicePoss(vendorCode, ghsCreditNoteTransferDto);
//	}
//	
//	@ApiOperation(value = "This method will get the credit notes from Service Poss", notes = "This API will get all the credit notes from Service Poss which are open based upon ***locationCode***")
//	@GetMapping(value = "")
//	public ListResponse<GhsCreditNoteDto> getCreditNotesFromGhs(
//			@ApiParam(name = "vendorCode", value = "Vendor Code needs to be used", allowableValues = "SERVICE_POSS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode) {
//		return servicePoss.getCreditNotesFromServicePoss(vendorCode);
//	}
//	
//	@ApiOperation(value = "This method will update the Credit Note after download", notes = "This API will update the status of Credit Note at Service Poss after downloading to POSS based on ***creditNoteNumber*** and ***fiscalYear***")
//	@PatchMapping(value = "")
//	public GhsCreditNoteUpdateResponseDto updateCreditNoteAtGhs(
//			@ApiParam(name = "ghsDocNo", value = "ghs doc number available in download list", required = true) @RequestParam(name = "ghsDocNo", required = true) int ghsDocNo,
//			@ApiParam(name = "fiscalYear", value = "credit note fiscal year", required = true) @RequestParam(name = "fiscalYear", required = true) int fiscalYear,
//			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SERVICE_POSS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode) {
//		return servicePoss.updateCreditNoteAtServicePoss(ghsDocNo, fiscalYear, vendorCode);
//	}
//	
//	@ApiOperation(value="This method will get the status of the credit Note",notes="This API will get the status of the credit Note")
//	@GetMapping("/status")
//	public StringResponse checkCNStatus(
//			@ApiParam(name = "ghsDocNo", value = "ghs doc number available in download list", required = true) @RequestParam(name = "ghsDocNo", required = true) int ghsDocNo,
//			@ApiParam(name = "fiscalYear", value = "credit note fiscal year", required = true) @RequestParam(name = "fiscalYear", required = true) int fiscalYear,
//			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SERVICE_POSS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode){
//		return servicePoss.checkCNStatus(ghsDocNo, fiscalYear, vendorCode);
//	}
//	
	@ApiOperation(value = "cash collected at service poss", notes = "This API will get cash collected at service poss for the given mobileNumber and current Date")
	@GetMapping(value = "/cash-payment")
	public ServiceCashCollectedDto getCashCollectedAtServicePoss(
		    @RequestParam(name ="mobileNo", required = true) String mobileNo,
		    @RequestParam(name = "locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate', format: yyyy-MM-dd", required = true) @RequestParam(name = "businessDate", required = true) @PatternCheck(regexp = "^\\d{4}-\\d{2}-\\d{2}$", nullCheck = true) String businessDate) {
		return servicePoss.getCashCollectedAtServicePoss( mobileNo,locationCode, businessDate);

	}
	
	@ApiOperation(value = "Method will update the metal rate in service", notes = "This Method will update the metal rate in service")
	@PostMapping(value = "/btqMetalRate")
	public Object updateBtqMetalRate(
			@RequestBody @Valid @ApiParam(required = true) List<ServiceMetalRequestDto> serviceMetalRequestDtoList){
		return servicePoss.updateBtqMetalRate(serviceMetalRequestDtoList);
	}




}
