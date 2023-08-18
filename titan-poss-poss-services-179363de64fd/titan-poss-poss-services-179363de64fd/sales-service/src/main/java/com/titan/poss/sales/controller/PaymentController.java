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

import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.LinkedPaymentResponseDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.service.PaymentFacadeService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Payment Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesPaymentController")
@RequestMapping(value = "sales/v2/payments")
public class PaymentController {

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	// @formatter:off
	private static final String PAYMENT_VIEW_PERMISSION = IS_STORE_USER + AND 
			+ "(" + "hasPermission(#txnType,'CM')" + AND + START+ SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR 
			+ "hasPermission(#txnType,'AB')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_VIEW + END + OR
			+ "hasPermission(#txnType,'ADV')" + AND + START + SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR
			+ "hasPermission(#txnType,'CO')" + AND + START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_VIEW + END + ")";
	// @formatter:off
	
	// @formatter:off
	private static final String PAYMENT_ADD_EDIT_PERMISSION = IS_STORE_USER + AND 
			+ "(" + "hasPermission(#txnType,'CM')" + AND + START+ SalesAccessControls.CASH_MEMO_PAYMENT_ADD_EDIT + END + OR 
			+ "hasPermission(#txnType,'AB')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_ADD_EDIT + END + OR
			+ "hasPermission(#txnType,'ADV')" + AND + START + SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR
			+ "hasPermission(#txnType,'CO')" + AND + START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_ADD_EDIT + END + ")";
	// @formatter:off
	
	/**
	 * This method return payment details once payment is processed.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param txnType
	 * @param transactionId
	 * @param paymentCreateDto
	 * @return PaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to add payment to transaction", notes = "This API will add payment details with respect to sales **transaction id**.<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Transaction Type:</span>" 
			+ "<ul>" 
			+ "	<li>CM</li>"
			+ "	<li>AB</li>" 
			+ "	<li>ADV</li>" 
			+ "	<li>CO</li>" 
			+ "</ul>"
			+ "<span style=\"font-size:14px;\">To know Fields required based on payment code: Refer "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/payment/design/SalesPaymentFlow.xlsx\">"
			+ "		PAYMENT - FLOW & FIELD DETAILS (Sheet name: Payment Fields (input & output)) "
			+ "	</a><br/>"
			+ "</span><br>"
			+ "** Validations are pending **")
	// @formatter:on
	@PostMapping
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public SalesPaymentDto addPaymentDetails(
			@ApiParam(name = "paymentCode", value = "Provide 'payment code' for the payment", required = true) @RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true) String paymentCode,
			@ApiParam(name = "paymentGroup", value = "Provide 'paymentGroup' for the payment", allowableValues = "BANK_LOAN, REGULAR, WALLET", required = true) @RequestParam(name = "paymentGroup", required = true) @ValueOfEnum(enumClass = PaymentGroupEnum.class) String paymentGroup,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM,AB, ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "isTcsPayment", value = "Provide 'true' if it is a tcs payment") @RequestParam(name = "isTcsPayment", required = false, defaultValue = "false") Boolean tcsPayment,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "transactionId", value = "Provide 'transaction Id' for which the payment is done", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "body", value = "payment object that needs to be added", required = true) @RequestBody @Valid PaymentCreateDto paymentCreateDto) {
		return paymentFacadeService.savePayment(paymentCode, paymentGroup, txnType, subTxnType, transactionId,
				paymentCreateDto, false, tcsPayment);
	}

	/**
	 * This method will return payment details based on sales transaction id.
	 * 
	 * @param transactionId
	 * @param paymentCode
	 * @param instrumentType
	 * @return ListResponse<PaymentDto>
	 */
	// @formatter:off
	@ApiOperation(value = "API to get payment details", notes = "This API will get payment details with respect to sales transaction id.<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Transaction Type:</span>" 
			+ "<ul>" 
			+ "	<li>CM</li>"
			+ "	<li>AB</li>" 
			+ "	<li>ADV</li>" 
			+ "</ul>")
	// @formatter:on
	@GetMapping
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	public ListResponse<SalesPaymentDto> getPaymentDetails(
			@ApiParam(name = "transactionId", value = "Provide 'transaction Id' for which the payment is done", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM,AB,ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB, MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "paymentCode", value = "Provide if you want to search by 'payment code'", required = false) @RequestParam(name = "paymentCode", required = false) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@ApiParam(name = "paymentGroup", value = "Provide 'paymentGroup' for the payment", allowableValues = "BANK_LOAN, REGULAR, WALLET", required = false) @RequestParam(name = "paymentGroup", required = false) @ValueOfEnum(enumClass = PaymentGroupEnum.class) String paymentGroup,
			@ApiParam(name = "instrumentType", value = "Provide if you want to search by 'instrument type'", required = false) @RequestParam(name = "instrumentType", required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50) String instrumentType) {
		return paymentFacadeService.getPaymentDetails(transactionId, paymentCode, paymentGroup, instrumentType);
	}

	/**
	 * This method will delete(cancel) payment details based on payment id.
	 * 
	 * @param id
	 * @return SalesPaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to delete(cancel) payment details", notes = "This API will delete(cancel) payment details with respect to payment id.<br>")
	// @formatter:on
	@DeleteMapping("/{id}")
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public SalesPaymentDto deletePaymentDetails(
			@ApiParam(name = "id", value = "Provide 'id' to delete payment details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM,AB, ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB, MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return paymentFacadeService.deletePaymentDetails(id);
	}

	/**
	 * This method will update payment details based on payment id, status and
	 * payment update dto.
	 * 
	 * @param id
	 * @param status
	 * @param paymentUpdateDto
	 * @return PaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to update payment details", notes = "This API will update payment details with respect to payment id , status and payment update dto.<br>"
			+ " <span style=\"font-size:14px;\">Payment status:</span><br>"
			+ " <ul>"
			+ "	 <li>OPEN</li>"
			+ "	 <li>COMPLETED</li>"
			+ "	 <li>FAILED</li>"
			+ " </ul><br>" 
			+ "<span style=\"font-size:14px;\">To know Fields required based on payment code: Refer "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/payment/design/SalesPaymentFlow.xlsx\">"
			+ "		PAYMENT - FLOW & FIELD DETAILS (Sheet name: Payment Fields (input & output)) "
			+ "	</a><br/>"
			+ "<span style=\"font-size:14px;\">Unipay Other Details Json: "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/payment/json/UnipayUpdateOtherDetails.json\">"
			+ "		OTHER DETAILS JSON"
			+ "	</a><br/>"
			+ "</span><br>\r\n")
	// @formatter:on
	@PatchMapping("/{id}")
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public SalesPaymentDto updatePaymentDetails(
			@ApiParam(name = "id", value = "Provide 'id' to update payment details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "status", value = "Provide 'status' to update payment details", allowableValues = "OPEN, COMPLETED, FAILED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = PaymentStatusEnum.class) String status,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM,AB, ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "Payment object to edit payment details", required = true) @RequestBody @Valid PaymentUpdateDto paymentUpdateDto) {

		return paymentFacadeService.updatePaymentDetails(id, status, paymentUpdateDto);
	}

	/**
	 * This method will return the eligibility details based on cutsomerId and
	 * paymentCode.
	 * 
	 * @param customerId
	 * @param paymentCode
	 * @return EligibleAmountDto
	 */
	// @formatter:off
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	@ApiOperation(value = "API to check eligibility of customer for payment code.", notes = "This API will check eligibility of customer for payment code based on customerId and paymentCode.<br>"
			+ "<ul>"
			+ " <li>totalAmount : Total billing amount. </li>"
			+ " <li>amountDue : Amount due from customer. (Yet to be paid) </li>"
			+ " <li>eligibleAmount : Amount eligible to be paid based on payment code and customer. </li>"
			+ "</ul><br/>"
			+ "** Eligible amount implementation is pending **")
	// @formatter:on
	@GetMapping("check-eligibility")
	public AmountDetailsDto checkCustomerEligibilityForPaymentCode(
			@ApiParam(name = "customerId", value = "Provide 'customerId' to check eligibility", required = true) @RequestParam(name = "customerId", required = true) @Min(1) Integer customerId,
			@ApiParam(name = "paymentCode", value = "Provide 'paymentCode' to check eligibility", required = true) @RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true) String paymentCode,
			@ApiParam(name = "paymentGroup", value = "Provide 'paymentGroup' for the payment", allowableValues = "BANK_LOAN, REGULAR, WALLET", required = true) @RequestParam(name = "paymentGroup", required = true) @ValueOfEnum(enumClass = PaymentGroupEnum.class) String paymentGroup,
			@ApiParam(name = "transactionId", value = "Provide 'transaction Id' for which the payment is done", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM,AB, ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		// pending: subTxnType is not used
		return paymentFacadeService.checkCustomerEligibilityForPaymentCode(customerId, paymentCode, paymentGroup,
				transactionId, txnType);
	}

	// @formatter:on
	@ApiOperation(value = "API to validate payment", notes = "This API will validate payment by payment id and otp(optional)<br>")
	// @formatter:on
	@GetMapping("{id}/validate")
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public SalesPaymentDto validatePayment(
			@ApiParam(name = "id", value = "Provide 'id' to validate payment details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM,AB, ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "inputValue", value = "Provide 'inputValue' to validate payment details") @RequestParam(name = "inputValue", required = false) @PatternCheck(regexp = RegExConstants.DESIGNATION_REGEX) String inputValue) {

		return paymentFacadeService.validatePayment(id, inputValue);
	}

	/**
	 * This method will confirm payment based on payment id and status.
	 * 
	 * @param id
	 * @param status
	 * @return SalesPaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to confirm payment details", notes = "This API will confirm payment details with respect to payment id.<br>"
			+ " <b>NOTE:</b> This API should <b>not</b> be called for the linked credit notes.<br>")
	// @formatter:on
	@PutMapping("/{id}")
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public SalesPaymentDto confirmPayment(
			@ApiParam(name = "id", value = "Provide 'id' to confirm payment details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide to search by 'txn type'", allowableValues = "CM,AB, ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "Provide 'status' to confirm payment details", allowableValues = "IN_PROGRESS, COMPLETED, FAILED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = PaymentStatusEnum.class) String status) {

		return paymentFacadeService.confirmPayment(id, status);
	}

	// @formatter:off
	/**
	 * This method will redeem the linked credit notes based on given transaction
	 * id.
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @param subTransactionType
	 * @return LinkedPaymentResponseDto
	 */
	@ApiOperation(value = "API to confirm linked payment details", notes = "This API will confirm linked payment details with respect to payment id.<br>"
			+ " That is, it will 'CONFIRM' all thelinked Credit Notes in current thransaction (for AB/CO). <br>"
			+ " <b>NOTE:</b> This API to be called at the end of confirming all other payments and just before confirming the transaction.<br>")
	// @formatter:on
	@PutMapping("/{transactionId}/linked-payments")
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public LinkedPaymentResponseDto confirmLinkedPayments(
			@ApiParam(name = "transactionId", value = "Provide 'transactionId' to confirm payment details", required = true) @PathVariable("transactionId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "txnType", value = "Provide  to search by 'txn type'", allowableValues = "CM,AB,ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return paymentFacadeService.confirmLinkedPayments(transactionId, txnType, subTxnType);
	}

	/**
	 * This API will update 'is_void' of payments table to true when payment is
	 * voided at UI with third party integration.
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @param subTransactionType
	 * @param paymentIds
	 */
	@ApiOperation(value = "API to will update the void details for payments", notes = "This API will update the void details with respect to given payment ids.<br>")
	@PutMapping("/{transactionId}/void-payments")
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public void voidPayments(
			@ApiParam(name = "transactionId", value = "Provide 'transactionId' to void payment details", required = true) @PathVariable("transactionId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "txnType", value = "Provide  to search by 'txn type'", allowableValues = "CM,AB,ADV,CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,MANUAL_AB, FROZEN_RATES, NON_FROZEN_RATES, MANUAL_FROZEN_RATES,NEW_CO,MANUAL_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "paymentIds", value = "Provide to 'payment ids' to update void details", required = true) @RequestParam(name = "paymentIds", required = false) Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> paymentIds) {
		paymentFacadeService.voidPaymentUpdate(transactionId, txnType, subTxnType, paymentIds);
	}
	
}
