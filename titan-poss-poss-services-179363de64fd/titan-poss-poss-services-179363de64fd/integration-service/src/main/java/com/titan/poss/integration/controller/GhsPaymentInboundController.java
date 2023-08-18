package com.titan.poss.integration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GhsCashResponseDto;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController("IntegrationGhsPaymentInboundController")
@RequestMapping("integration/v2/ghs/cash-payments")
public class GhsPaymentInboundController {

	@Autowired
	private GhsService ghsService;

	@ApiOperation(value = "cash collected at ghs", notes = "This API will get cash collected at ghs for the given ulpId, mobileNumber and current Date")
	@GetMapping(value = "")
	public GhsCashResponseDto getCashCollectedAtGHS(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@RequestParam(required = false) String ulpId, @RequestParam(required = false) String mobileNo,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate', format: yyyy-MM-dd", required = true) @RequestParam(name = "businessDate", required = true) @PatternCheck(regexp = "^\\d{4}-\\d{2}-\\d{2}$", nullCheck = true) String businessDate) {

		return ghsService.getCashCollectedAtGHS(vendorCode, ulpId, mobileNo, businessDate);

	}

}
