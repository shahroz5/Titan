/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import java.util.Date;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.integration.eghs.generated.POSSBTQGoldPriceMasterDO;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationBusinessDayController")
@RequestMapping("integration/v2/ghs/business-days")
public class GhsBusinessDayController {

	@Autowired
	GhsService ghsService;

	@ApiOperation(value = "bod at ghs", notes = "This API will do the BOD at EGHS for the POSS location")
	@PostMapping(value = "/bod")
	public BusinessDayActivityDto bodAtGhs(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto) {

		return ghsService.bodAtGhs(vendorCode, businessDateDto);

	}

	@ApiOperation(value = "eod at ghs", notes = "This API will do the EOD at EGHS for the POSS location")
	@PostMapping(value = "/eod")
	public BusinessDayActivityDto eodAtGhs(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto) {

		return ghsService.eodAtGhs(vendorCode, businessDateDto);

	}
	
	@ApiOperation(value="This method will get the status of the BOD ",notes="This API will get the status of the BOD")
	@PostMapping("/status")
	public BooleanResponse checkBODStatus(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto,
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {			
		return ghsService.checkBODStatus(vendorCode,businessDateDto,locationCode);
	}
	
	@ApiOperation(value = "update Gold rate in GHS", notes = "This API will update the Gold rate in GHS.")
	@PutMapping(value = "gold-rate")
	public BoutiqueGoldPriceMasterDto updateGR(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "poss btq gold price master do", required = true) @RequestBody @Valid BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto) {

		return ghsService.updateGR(vendorCode, boutiqueGoldPriceMasterDto);

	}
	
	
	@ApiOperation(value="This method will get the status of the EOD ",notes="This API will get the status of the EOD")
	@PostMapping("/eod/status")
	public BooleanResponse checkEODStatus(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto,
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {			
		return ghsService.checkEODStatus(vendorCode,businessDateDto,locationCode);
	}
	

}
