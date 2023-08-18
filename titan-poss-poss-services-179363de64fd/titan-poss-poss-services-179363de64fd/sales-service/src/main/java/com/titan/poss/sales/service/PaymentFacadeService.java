/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.Set;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.LinkedPaymentResponseDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;

/**
 * Service interface for Payment
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentFacadeService {

	/**
	 * This method return payment details once payment is processed based on payment
	 * code.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param transactionType
	 * @param subTxnType
	 * @param transactionId
	 * @param paymentCreateDto
	 * @param isPaymentFromAbtoCM
	 * @param isTcsPayment
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto savePayment(String paymentCode, String paymentGroup, String transactionType, String subTxnType,
			String transactionId, PaymentCreateDto paymentCreateDto, Boolean isPaymentFromAbtoCM, Boolean isTcsPayment);

	/**
	 * This method will return payment details based on sales transaction id.
	 * 
	 * @param transactionId
	 * @param paymentCode
	 * @param paymentGroup
	 * @param instrumentType
	 * @return ListResponse<SalesPaymentDto>
	 */
	ListResponse<SalesPaymentDto> getPaymentDetails(String transactionId, String paymentCode, String paymentGroup,
			String instrumentType);

	/**
	 * This method will validate payment by id and otp.
	 * 
	 * @param id
	 * @param otp
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto validatePayment(String id, String otp);

	/**
	 * This method will update payment details based on payment id, status and
	 * payment update dto.
	 * 
	 * @param id
	 * @param status
	 * @param paymentUpdateDto
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto updatePaymentDetails(String id, String status, PaymentUpdateDto paymentUpdateDto);

	/**
	 * This method will delete(cancel) payment details based on payment id.
	 * 
	 * @param id
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto deletePaymentDetails(String id);

	// pending
	/**
	 * This method will confirm payment based on payment id and status.
	 * 
	 * @param id
	 * @param status
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto confirmPayment(String id, String status);

	/**
	 * This method will return the eligibility details based on cutsomerId and
	 * paymentCode.
	 * 
	 * @param customerId
	 * @param paymentCode
	 * @param paymentCode
	 * @param transactionId
	 * @param txnType
	 * @return EligibleAmountDto
	 */
	AmountDetailsDto checkCustomerEligibilityForPaymentCode(Integer customerId, String paymentCode, String paymentGroup,
			String transactionId, String txnType);

	/**
	 * This method will redeem the linked credit notes based on given transaction
	 * id.
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @param subTransactionType
	 * @return LinkedPaymentResponseDto
	 */
	LinkedPaymentResponseDto confirmLinkedPayments(String transactionId, String transactionType,
			String subTransactionType);

	/**
	 * This method will delete the transaction based on payment and 'isEditable'
	 * field in it. this method should be used only when deleting payments added
	 * after AB/CO is confirmed. But, the payments are not converted to CNs. Used in
	 * get call of Confirmed AB/CO & EOD job.(No CNs will be generated as part of
	 * this delete)
	 * 
	 * @param id
	 * @param isSingle
	 */
	void deleteTempPayment(String id, Boolean isSingle);

	/**
	 * This method will update 'is_void' of payments table to true when payment is
	 * voided at UI with third party integration and add record to 'payment_refunds'
	 * table to subtract the amount from revenue.
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @param subTransactionType
	 * @param paymentIds
	 */
	void voidPaymentUpdate(String transactionId, String transactionType, String subTransactionType,
			Set<String> paymentIds);

}
