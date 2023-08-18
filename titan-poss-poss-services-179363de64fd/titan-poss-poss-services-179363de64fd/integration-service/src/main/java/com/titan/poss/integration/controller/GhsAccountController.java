/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.GhsRedeemAccountDto;
import com.titan.poss.core.dto.GhsRedeemAccountResponseDto;
import com.titan.poss.core.enums.GhsAccountDetailsStatusEnum;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationGhsAccountController")
@RequestMapping("integration/v2/ghs/accounts")
public class GhsAccountController {
	@Autowired
	GhsService ghsService;

	@ApiOperation(value = "ghs account details", notes = "This API will get ghs account details for the given account number and location code")
	@GetMapping(value = "")
	public GhsAccountDetailsResponseDto getGhsAccountDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "accountNo", value = "ghs account number", required = true) @RequestParam int accountNo) {

		return ghsService.getGhsAccountDetails(vendorCode, accountNo);

	}

	@ApiOperation(value = "redeem ghs account", notes = "This API will redeem ghs account for the given account number and location code")
	@PostMapping(value = "")
	public GhsRedeemAccountResponseDto redeemGhsAccount(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "redeem ghs account number dto", required = true) @RequestBody @Valid GhsRedeemAccountDto ghsRedeemAccountDto) {

		return ghsService.redemptionGhsAccount(vendorCode, ghsRedeemAccountDto);

	}

	@ApiOperation(value = "update cm details for account", notes = "This API will update the CM details in GHS after confirmation")
	@PutMapping(value = "")
	public GhsAccountMasterUpdateDto updateGhsAccountMaster(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "ghs Account master update dto", required = true) @RequestBody @Valid GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto) {

		return ghsService.updateGhsAccountMaster(vendorCode, ghsAccountMasterUpdateDto);

	}

	@ApiOperation(value = "update GHS account status", notes = "This API will update the GHS account status to HOLD or OPEN respectively as per the requirement")
	@PutMapping(value = "status")
	public BooleanResponse updateGhsAccountMasterStatus(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "accountNo", value = "ghs account number", required = true) @RequestParam Integer accountNo,
			@ApiParam(name = "status", value = "ghs account status to be updated", allowableValues = "OPEN,HOLD", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = GhsAccountDetailsStatusEnum.class) String status) {

		return ghsService.updateGhsAccountMasterStatus(vendorCode, accountNo, status);

	}

}
