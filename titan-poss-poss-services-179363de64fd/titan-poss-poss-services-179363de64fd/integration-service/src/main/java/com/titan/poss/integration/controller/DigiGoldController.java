/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.domain.constant.enums.DigiGoldTransactionEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.integration.service.DigiGoldService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationDigiGoldController")
@RequestMapping("integration/v2/digi-gold")
public class DigiGoldController {

	@Autowired
	private DigiGoldService digiGoldService;

	@ApiOperation(value = "digiGold API for getting the selling price from digi gold", notes = "This API will call the digi Gold system to get the selling price")
	@GetMapping("price")
	public DigiGoldSellingPriceDto sellingPrice(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SAFE_GOLD", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {
		return digiGoldService.sellingPrice(vendorCode, mobileNo, transactionId);

	}

	@ApiOperation(value = "digiGold API for getting the gold balance", notes = "This API will call the digi Gold system to get the gold balance based on the mobile number of the customer")
	@GetMapping("balance")
	public DigiGoldBalanceResponseDto fetchBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SAFE_GOLD", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {
		return digiGoldService.fetchBalance(vendorCode, mobileNo, transactionId);

	}

	@ApiOperation(value = "digiGold API for OTP request", notes = "This API will call the digi Gold system to get an One Time Password from verfication")
	@GetMapping("send-otp")
	public BooleanResponse sendOtp(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SAFE_GOLD", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "tanishqGoldGrams", value = "gold grams to be redeemed from tanishq gold balance", required = false) @RequestParam(name = "tanishqGoldGrams", required = false) BigDecimal tanishqGoldGrams,
			@ApiParam(name = "nonTanishqGoldGrams", value = "gold grams to be redeemed from non tanishq gold balance", required = false) @RequestParam(name = "nonTanishqGoldGrams", required = false) BigDecimal nonTanishqGoldGrams,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId,
			@ApiParam(name = "referenceId", value = "reference id of the transaction", required = true) @RequestParam(name = "referenceId", required = true) String referenceId) {
		return digiGoldService.sendOtp(vendorCode, mobileNo, tanishqGoldGrams, nonTanishqGoldGrams, transactionId,
				referenceId);

	}

	@ApiOperation(value = "digiGold API for OTP Verification", notes = "This API will call the digi Gold system to verify the OTP generated")
	@GetMapping("verify-otp")
	public DigiGoldOtpResponseDto verifyOtp(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SAFE_GOLD", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "goldGrams", value = "gold grams to be redeemed", required = true) @RequestParam(name = "goldGrams", required = true) BigDecimal goldGrams,
			@ApiParam(name = "otp", value = "OTP to be validated", required = true) @RequestParam(name = "otp", required = true) String otp,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {
		return digiGoldService.verifyOtp(vendorCode, mobileNo, goldGrams, otp, transactionId);

	}

	@ApiOperation(value = "digiGold API for redeem the gold Grams", notes = "This API will call the digi Gold system to redeem the approved gold grams")
	@GetMapping("redeem")
	public DigiGoldRedeemDto redeemGold(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SAFE_GOLD", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "transactionType", value = "transaction type of the redemption", allowableValues = "TANISHQ, NON_TANISHQ", required = true) @RequestParam(name = "transactionType", required = true) @ValueOfEnum(enumClass = DigiGoldTransactionEnum.class) String transactionType,
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "goldGrams", value = "gold grams to be redeemed", required = true) @RequestParam(name = "goldGrams", required = true) BigDecimal goldGrams,
			@ApiParam(name = "otp", value = "verified OTP", required = true) @RequestParam(name = "otp", required = true) String otp,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {

		return digiGoldService.redeemGold(vendorCode, transactionType, mobileNo, goldGrams, otp, transactionId);
	}

	@ApiOperation(value = "digiGold API to cancel transaction", notes = "This API will call the digi Gold system to cancel the transaction in case of failure")
	@GetMapping("cancel")
	public DigiGoldRedeemDto cancelTransaction(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "SAFE_GOLD", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "transactionIdDigiGold", value = "transaction id for which transaction needs to be cancelled", required = true) @RequestParam(name = "transactionIdDigiGold", required = true) String transactionIdDigiGold,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {

		return digiGoldService.cancelTransaction(vendorCode, transactionIdDigiGold, transactionId);

	}

	@GetMapping("test")
	public Object testApi(
			@ApiParam(name = "testString", value = "string to decrypt", required = true) @RequestParam(name = "testString", required = true) String testString) {
		return digiGoldService.testApi(testString);

	}
	
	@PostMapping(value = "/test/file")
	public Boolean checkFile(
			@ApiParam(name = "reqFile", required = true) @RequestParam(required = true) MultipartFile reqFile) {
		return digiGoldService.checkFile(reqFile);
	}

}
