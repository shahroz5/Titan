/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.integration.service.GhsService;
import com.titan.poss.sales.constants.TransactionStatusEnum;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("IntegrationGhsDiscountVoucherController")
@RequestMapping(value = "integration/v2/ghs/discount-vouchers")
public class GhsDiscountVoucherController {

	@Autowired
	GhsService ghsService;

	@ApiOperation(value = "discount voucher details from ghs", notes = "This API will get discount voucher details from ghs based on the voucher number and account number")
	@GetMapping(value = "")
	public GhsDiscountVoucherResponseDto getDiscountVoucherDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "discountVoucherNo", value = "ghs discount voucher number", required = true) @RequestParam(name = "discountVoucherNo", required = true) int discountVoucherNo,
			@ApiParam(name = "accountNo", value = "ghs account number", required = true) @RequestParam(name = "accountNo", required = true) int accountNo) {

		return ghsService.getDiscountVoucherDetails(vendorCode, discountVoucherNo, accountNo);

	}

	@ApiOperation(value = "redeem discount voucher from ghs", notes = "This API will redeem discount voucher from ghs based on the voucher number and account number")
	@PostMapping(value = "")
	public GhsDiscountVoucherRedeemResponseDto redeemGhsDiscountVoucher(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "discountVoucherNo", value = "ghs discount voucher number", required = true) @RequestParam(name = "discountVoucherNo", required = true) String discountVoucherNo,
			@ApiParam(name = "accountNo", value = "ghs account number", required = true) @RequestParam(name = "accountNo", required = true) int accountNo,
			@ApiParam(name = "transactionId", value = "transaction id from sales", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {
		return ghsService.redeemGhsDiscountVoucher(vendorCode, discountVoucherNo, accountNo, transactionId);

	}

	@ApiOperation(value = "update discount voucher in ghs", notes = "This API will update discount voucher in ghs based on the voucher number and transaction id")
	@PutMapping(value = "")
	public void updateDiscountVoucher(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "discountVoucherNo", value = "ghs discount voucher number", required = true) @RequestParam(name = "discountVoucherNo", required = true) String discountVoucherNo,
			@ApiParam(name = "accountNo", value = "ghs account number", required = true) @RequestParam(name = "accountNo", required = true) int accountNo,
			@ApiParam(name = "transactionId", value = "transaction id from sales", required = true) @RequestParam(name = "transactionId", required = true) String transactionId,
			@ApiParam(name = "status", value = "ghs dv status", allowableValues = "REVERSED,CONFIRMED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status) {

		ghsService.updateDiscountVoucher(vendorCode, discountVoucherNo, accountNo, transactionId, status);

	}
}
