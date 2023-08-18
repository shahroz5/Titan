/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CashMemoFetchDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.PaymentRedemptionDetailsDto;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.sales.dto.CustomerOrderDetailsDto;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Sales Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("salesEngineController")
@RequestMapping(value = "engine/v2/sales")
public class SalesController {

	@Autowired
	private SalesService salesService;

	/**
	 * This method will give redemption details based on paymentCode, paymentGroup &
	 * instrumentNo.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param instrumentNo
	 * @return PaymentRedemptionDetailsDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to get payment redemption details", notes = "This API will get the payment redemption details based on:<br>"
			+ "<ul>" + "	<li>paymentCode</li>" + "	<li>paymentGroup</li>" + "	<li>instrumentNo</li>" + "</ul>")
	// @formatter:on
	@GetMapping("/payment-details")
	public ListResponse<PaymentRedemptionDetailsDto> getRedemptionDetails(
			@ApiParam(value = "Provide to search by 'payment code'", required = true) @RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true) String paymentCode,
			@ApiParam(value = "Provide to search by 'payment group'", allowableValues = "BANK_LOAN, REGULAR, WALLET", required = true) @RequestParam(name = "paymentGroup", required = true) @ValueOfEnum(enumClass = PaymentGroupEnum.class) String paymentGroup,
			@ApiParam(value = "Provide to search by 'instrument number'", required = true) @RequestParam(name = "instrumentNo", required = true) @PatternCheck(regexp = RegExConstants.NUMERIC_REGEX, nullCheck = true) String instrumentNo) {

		return salesService.getRedemptionDetails(paymentCode, paymentGroup, instrumentNo);
	}
	
	@ApiOperation(value = "Get all customer purchase history through their Mobile Number ", notes = "Get all customer purchase history through their Mobile Number.")
	@PostMapping(value = "/cashMemo-details")
	public List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(
			@RequestBody(required = true) @Validated CustomerPurchaseRequestDto customerPurchaseRequestDto) {
		return salesService.getAllCashMemoPurchase(customerPurchaseRequestDto);
	}
	
	
	@GetMapping("/checkGrn")
	@ApiOperation(value = "Check grn is done for provided id")
	public Boolean getRefundId(
			@RequestParam(name = "id", required = true)@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id) {
		return salesService.getRefundId(id);
	}
	
	
}
