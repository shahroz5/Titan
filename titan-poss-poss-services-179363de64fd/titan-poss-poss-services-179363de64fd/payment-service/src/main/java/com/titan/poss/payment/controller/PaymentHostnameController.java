/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dto.PaymentHostnameUpdateDto;
import com.titan.poss.payment.dto.response.PaymentHostnameResponseDto;
import com.titan.poss.payment.service.PaymentHostnameService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PaymentConstants.PAYMENT_HOSTNAME_CONTROLLER)
@RequestMapping("payment/v2/hostnames")
public class PaymentHostnameController {

	private static final String PAYMENT_HOSTNAME_VIEW_PERMISSION = "hasPermission(true,'"
			+ PaymentAccessControls.PAYMENT_HOSTNAME_VIEW + "' )";

	private static final String PAYMENT_HOSTNAME_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ PaymentAccessControls.PAYMENT_HOSTNAME_ADD_EDIT + "' )";

	@Autowired
	private PaymentHostnameService paymentHostnameService;

	@GetMapping
	@ApiPageable
	@PreAuthorize(PAYMENT_HOSTNAME_VIEW_PERMISSION)
	@ApiOperation(value = "List all payment hostname", notes = "This API returns Pageable response of payment hostname.<br>"
			+ "**locationCode** filter is available in this API.")
	public PagedRestResponse<List<PaymentHostnameResponseDto>> listPaymentHostnames(
			@RequestParam @ApiParam(value = "Payment Code", required = true, allowableValues = "UNIPAY, AIRPAY, RAZOR PAY") @PatternCheck(regexp = RegExConstants.ALPHA_CAPS_SPACE_REGEX_MAX_20) String paymentCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return paymentHostnameService.listPaymentHostnames(paymentCode, locationCode, isActive, pageable);
	}

	@PatchMapping
	@PreAuthorize(PAYMENT_HOSTNAME_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Update bulk payment hostname", notes = "This API is for bulk update payment hostname."
			+ " deviceId & isActive can be changed through this API.")
	public PaymentHostnameUpdateDto updatePaymentHostname(
			@RequestBody @Valid @ApiParam(name = "body", value = "payment hostname object that needs to be updated", required = true) PaymentHostnameUpdateDto paymentHostnameUpdateDto) {
		return paymentHostnameService.updatePaymentHostname(paymentHostnameUpdateDto);
	}

}
