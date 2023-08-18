/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.response.CashbackUtilizedDto;
import com.titan.poss.sales.service.PaymentEpossService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Payment EPOSS Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesPaymentEpossController")
@RequestMapping(value = "sales/v2/payments/eposs")
public class PaymentEpossController {

	@Autowired
	private PaymentEpossService paymentEpossService;

	// @formatter:off
		private static final String PAYMENT_VIEW_PERMISSION = IS_STORE_USER + AND + "(" + START
				+ SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR + START
				+ SalesAccessControls.ADVANCE_BOOKING_PAYMENT_VIEW + END + OR + START
				+ SalesAccessControls.CUSTOMER_ORDER_PAYMENT_VIEW + END + ")";
	// @formatter:on

	@ApiOperation(value = "API to get cashback utilized count", notes = "This API will get the cashback utilized count based on the input. This API is used for internal purpose only, should not by used from UI.<br>")
	@GetMapping("cash-back")
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	public CashbackUtilizedDto getCashbackUtilized(
			@ApiParam(name = "instrumentNo", value = "Provide 'instrumentNo'(card number) to check cashback utilization", required = true) @RequestParam(name = "instrumentNo", required = true) String instrumentNo,
			@ApiParam(name = "offerId", value = "Provide 'offerId' to check cashback utilization", required = true) @RequestParam(name = "offerId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String offerId) {
		return paymentEpossService.getCashbackUtilized(instrumentNo, offerId);
	}

}
