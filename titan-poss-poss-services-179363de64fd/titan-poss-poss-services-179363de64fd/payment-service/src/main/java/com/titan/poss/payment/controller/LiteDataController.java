/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.constants.TransactionSearchTypeEnum;
import com.titan.poss.payment.dto.response.PaymentLiteDto;
import com.titan.poss.payment.dto.response.TransactionResponseDto;
import com.titan.poss.payment.service.PaymentService;
import com.titan.poss.payment.service.TransactionService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("paymentLiteDataController")
@RequestMapping("payment/v2/lite-data")
@Validated
public class LiteDataController {

	private static final String TRANSACTION_TYPE_MASTER_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.TRANSACTION_TYPE_MASTER_VIEW + PreAuthorizeDetails.END;

	private static final String TRANSACTION_TYPE_MASTER_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.TRANSACTION_TYPE_MASTER_ADD_EDIT + PreAuthorizeDetails.END;
	
	@Autowired
	private PaymentService paymentService;

	@Autowired
	private TransactionService transactionService;

	/**
	 * This method will return the list of Payment.
	 * 
	 * @param paymentCode
	 * @return List<TownLiteDto>
	 */
	@ApiOperation(value = "This method will return the list of Payment", notes = "This method will return the list of Payment")
	@GetMapping("/payments")
	@PreAuthorize(TRANSACTION_TYPE_MASTER_VIEW_PERMISSION)
	public PagedRestResponse<List<PaymentLiteDto>> listPaymentCode(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return paymentService.listPaymentCode(paymentCode, isPageable, pageable);

	}

	/**
	 * This method will return the list of transaction types based on filter.
	 * 
	 * @param searchType
	 * @param isTrue
	 * @param pageable
	 * @param isPageable
	 * @return PagedRestResponse<List<TransactionResponseDto>>
	 */
	@ApiOperation(value = "This method will return the list of Transaction types", notes = "This method will return the list of Transaction types.")
	@GetMapping("/transaction-types")
	@PreAuthorize(TRANSACTION_TYPE_MASTER_VIEW_PERMISSION)
	public PagedRestResponse<List<TransactionResponseDto>> listTransactionTypes(
			@ApiParam(name = "searchType", value = "Provide 'searchType' for listing", allowableValues = "MANUAL_BILL_ALLOWED, CUSTOMER_MAPPING, PAYMENT_MAPPING", required = false) @RequestParam(value = "searchType", required = false) @ValueOfEnum(enumClass = TransactionSearchTypeEnum.class) String searchType,
			@ApiParam(name = "isTrue", value = "Provide 'isTrue' for listing", required = false) @RequestParam(name = "isTrue", required = false) Boolean isTrue,
			@ApiParam(name = "transactionType", value = "Provide 'transactionType' for listing", required = false) @RequestParam(value = "transactionType", required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_MAX_30) String transactionType,
			@ApiParam(name = "isPageable", value = "Provide 'isPageable' for listing", required = false) @RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return transactionService.listTransactionTypes(searchType, isTrue, transactionType, pageable, isPageable);

	}
}
