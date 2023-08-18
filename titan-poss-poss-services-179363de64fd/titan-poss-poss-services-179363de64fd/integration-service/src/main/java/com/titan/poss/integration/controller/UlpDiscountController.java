/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
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
@RestController("IntegrationUlpDiscountController")
@RequestMapping(value = "integration/v2/discounts/loyalty-points")
public class UlpDiscountController {

	@Autowired
	private UlpService ulpService;

	// @formatter:off
	@ApiOperation(value = "Avail Loyalty Discounts", notes = "This API will avail the discount if provided to the loyalty customer availed in 3rd party loyalty application which ever 3rd party is active at an instant"
			 + "<br>" + "Available Discount types are:"
				+ "<ul>"
				+ "<li>BIRTHDAY</li>"
				+ "<li>ANNIVERSARY</li>"
				+ "<li>SPOUSE_BIRTHDAY</li>"
				+ "</ul>" )
	// @formatter:on
	@PostMapping(value = "")
	public UlpDiscountResponseDto availLoyaltyDiscounts(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Loyalty points dto", required = true) @RequestBody @Valid UlpDiscountDto discountDto) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.availLoyaltyDiscount(vendor, discountDto);
	}

	@ApiOperation(value = "Reverse Availed Discount", notes = "This API will reverse the availed discount of the loyalty customer in 3rd party loyalty application which ever 3rd party is active at an instant")
	@PutMapping(value = "")
	public UlpBaseResponseDto reverseAvailedDiscount(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Loyalty points dto", required = true) @RequestBody @Valid UlpBillCancellationDto billCancellationDto) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.reverseAvailedDiscount(vendor, billCancellationDto);
	}
}
