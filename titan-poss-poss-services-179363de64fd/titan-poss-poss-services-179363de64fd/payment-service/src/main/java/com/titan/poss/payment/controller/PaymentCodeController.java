/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CONTROLLER;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dto.request.PaymentAddDto;
import com.titan.poss.payment.dto.request.PaymentUpdateDto;
import com.titan.poss.payment.dto.response.PaymentDto;
import com.titan.poss.payment.service.PaymentService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PAYMENT_CONTROLLER)
@RequestMapping("payment/v2/payment-codes")
public class PaymentCodeController {

	@Autowired
	private PaymentService paymentService;

	private static final String PAYMENT_CODE_VIEW_PERMISSION = "hasPermission(true,'"
			+ PaymentAccessControls.PAYMENT_CODE_VIEW + "' )";

	private static final String PAYMENT_CODE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ PaymentAccessControls.PAYMENT_CODE_ADD_EDIT + "' )";

	/**
	 * This method will return the list of payment modes based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PaymentDto>>
	 */
	@ApiOperation(value = "View the list of Payment Master", notes = "This API returns the list of Payment codes based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PAYMENT_CODE_VIEW_PERMISSION)
	public PagedRestResponse<List<PaymentDto>> listPayment(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return paymentService.listPayment(isActive, pageable);
	}

	/**
	 * This method will return the Payment Mode based on the paymentCode.
	 * 
	 * @param paymentCode
	 * @return PaymentDto
	 */
	@ApiOperation(value = "View the Payment Master based on the paymentCode", notes = "This API returns the Payment Master based on the **paymentCode**<br>"
			+ "paymentCode :-  Payment code should be alphanumeric Example(CASH, DD, CHEQUE) and size should be less than 30.")
	@GetMapping(value = "/{payment-code}")
	@PreAuthorize(PAYMENT_CODE_VIEW_PERMISSION)
	public PaymentDto getPayment(
			@PathVariable("payment-code") @PatternCheck(message = PaymentConstants.INVALID_PAYMENT_CODE, regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode) {
		return paymentService.getPayment(paymentCode);
	}

	/**
	 * This method will save the Payment Modes.
	 * 
	 * @param paymentDto
	 * @return PaymentDto
	 */
	// @Formatter:off
	@ApiOperation(value = "Save the Payment Master", notes = "This API saves the Payment Master<br>"
			+ "Payment DTO :- <br>"
			+ "1. paymentCode :- Payment code should be alphanumeric Example(CASH, DD, CHEQUE)<br>"
			+ "2. description :- Description about payment code<br>" + "3. isActive :- it should be true or false.<br>"
			+ "4. fieldDetails :- For each reference 1,2 or 3 there will be one json Object.<br>"
			+ "fieldDetails:<br>\r\n" + "<pre>" + "[\r\n" + "{\r\n" + "\"fieldCode\": \"remarks\",\r\n"
			+ "\"fieldName\": \"Remarks\",\r\n" + "\"fieldRegex\": \"valid regex\",\r\n"
			+ "\"fieldType\": \"textBox\",\r\n" + "},\r\n" + "]\r\n" + "</pre><br>")
	// @Formatter:on
	@PostMapping
	@PreAuthorize(PAYMENT_CODE_ADD_EDIT_PERMISSION)
	public PaymentDto addPayment(
			@RequestBody @Valid @ApiParam(name = "body", value = "Payment Code that needs to be created", required = true) PaymentAddDto paymentDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Payment Group", allowableValues = "WALLET,BANK_LOAN,REGULAR") @ValueOfEnum(enumClass = PaymentGroupEnum.class) String paymentGroup) {
		return paymentService.addPayment(paymentDto, paymentGroup);
	}

	/**
	 * This method will update the Payment modes.
	 * 
	 * @param paymentCode
	 * @param paymentUpdateDto
	 * @return PaymentDto
	 */
	// @Formatter:off
	@ApiOperation(value = "Update the Payment Master ", notes = "This API updates the Payment Master <br/> if **isActive** is false, then it will be soft deleted based on the **paymentCode**<br>"
			+ "<br/> ****In fieldDetails if any field got updated so we have to pass both previous value and updated value****<br>"
			+ "1. paymentCode :- Payment code should be alphanumeric Example(CASH, DD, CHEQUE)<br>"
			+ "2. description :- Description about payment code<br>" + "3. isActive :- it should be true or false.<br>"
			+ "4. fieldDetails :- For each reference 1,2 or 3 there will be one json Object. We have to pass whole field details object.<br>"
			+ "fieldDetails:<br>\r\n" + "<pre>" + "[\r\n" + "{\r\n" + "\"fieldCode\": \"remarks\",\r\n"
			+ "\"fieldName\": \"Remarks\",\r\n" + "\"fieldRegex\": \"valid regex\",\r\n"
			+ "\"fieldType\": \"textbox\",\r\n" + "},\r\n" + "]\r\n" + "</pre><br>")
	// @Formatter:on
	@PatchMapping(value = "/{payment-code}")
	@PreAuthorize(PAYMENT_CODE_ADD_EDIT_PERMISSION)
	public PaymentDto updatePayment(
			@PathVariable("payment-code") @PatternCheck(message = PaymentConstants.INVALID_PAYMENT_CODE, regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "Payment Mode that needs to be updated", required = true) PaymentUpdateDto paymentUpdateDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Payment Group", allowableValues = "WALLET,BANK_LOAN,REGULAR") @ValueOfEnum(enumClass = PaymentGroupEnum.class) String paymentGroup) {

		return paymentService.updatePayment(paymentCode, paymentUpdateDto, paymentGroup);
	}

}
