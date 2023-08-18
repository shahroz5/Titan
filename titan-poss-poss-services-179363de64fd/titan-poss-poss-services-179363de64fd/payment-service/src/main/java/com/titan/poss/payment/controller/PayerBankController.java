/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_CONTROLLER;

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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dto.PayerBankDto;
import com.titan.poss.payment.dto.request.PayerBankUpdate;
import com.titan.poss.payment.service.PayerBankService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PAYER_BANK_CONTROLLER)
@RequestMapping("payment/v2/payer-banks")
public class PayerBankController {

	private static final String PAYER_BANK_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYER_BANK_VIEW + PreAuthorizeDetails.END;

	private static final String PAYER_BANK_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYER_BANK_ADD_EDIT + PreAuthorizeDetails.END;

	@Autowired
	private PayerBankService payerBankService;

	/**
	 * This method will return the list of payer bank based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PayerBankDto>>
	 */
	@ApiOperation(value = "View the list of Payer Bank", notes = "This API returns the list of Payer Bank based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PAYER_BANK_VIEW_PERMISSION)
	public PagedRestResponse<List<PayerBankDto>> listPayerBank(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = PaymentConstants.INVALID_BANK_NAME) String bankName,
			@RequestParam(required = false) Boolean isCashBack) {
		return payerBankService.listPayerBank(isActive, pageable, bankName,isCashBack);
	}

	/**
	 * This method will update the Payer bank.
	 * 
	 * @param payerBank
	 * @return ListResponse<PayerBankDto>
	 */
	// @Formatter:off
	@ApiOperation(value = "Update the Payer Bank ", notes = "This API updates the Payer Bank <br/> if **isActive** is false, then it will be soft deleted based on the **bankName**<br>"
			+ "1. bankName :-  Bank Name should be alphanumeric Example(ICICI, AMERICAN EXPRESS) and size should be less than 100<br>"
			+ "2. isActive :- it should be true or false.<br>")
	// @Formatter:on
	@PatchMapping
	@PreAuthorize(PAYER_BANK_ADD_EDIT_PERMISSION)
	public ListResponse<PayerBankDto> updatePayerBank(
			@RequestBody @Valid @ApiParam(name = "body", value = "payer bank that needs to be updated", required = true) PayerBankUpdate payerBank) {
		return payerBankService.updatePayerBank(payerBank);
	}

}
