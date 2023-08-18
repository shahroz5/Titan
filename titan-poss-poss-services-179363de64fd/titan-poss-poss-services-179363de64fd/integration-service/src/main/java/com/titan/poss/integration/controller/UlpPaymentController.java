/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
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
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.UlpService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Ulp Controller for payment
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationUlpPaymentController")
@RequestMapping(value = "integration/v2/payment/loyalty-points")
public class UlpPaymentController {

	@Autowired
	private UlpService ulpService;

	@ApiOperation(value = "Gets the Loyalty points balance", notes = "This API will return the balance points of the loyalty card in 3rd party loyalty application which ever 3rd party is active at an instant")
	@GetMapping(value = "")
	public UlpBalanceResponseDto getLoyaltyPointsBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "ulp_no", required = true) @RequestParam(name = "ulp_no", required = true) @PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, message = "Invalid Ulp Id", nullCheck = false) String ulpNo) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.getloyaltyPointsBalance(vendor, ulpNo);
	}

	@ApiOperation(value = "Redeem Loyalty points balance", notes = "This API will redeem the loyalty points in 3rd party loyalty application which ever 3rd party is active at an instant")
	@PostMapping(value = "")
	public RedeemPointsDto redeemLoyaltyPoints(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Loyalty points dto", required = true) @RequestBody @Valid UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.redeemLoyaltyPoints(vendor, redeemLoyaltyPointsDto);
	}

	@ApiOperation(value = "Reverse Redeem Loyalty points balance", notes = "This API will reverse the redeemed loyalty points and returns the reference number if loyalty points is reversed successfullly in 3rd party loyalty application which ever 3rd party is active at an instant")
	@PutMapping(value = "")
	public UlpReverseRedeemResponseDto reverseRedeemedLoyaltyPoints(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Reverse Redeem Loyalty points dto", required = true) @RequestBody @Valid UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.reverseRedeemedPoints(vendor, reverseRedeemLoyaltyPointsDto);
	}
}
