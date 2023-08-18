/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dto.PaymentRequestOtherDetails;
import com.titan.poss.sales.dto.PaymentRequestSearchDto;
import com.titan.poss.sales.dto.request.CreatePaymentRequestDto;
import com.titan.poss.sales.dto.response.PendingPaymentDto;

/**
 * Service interface for pending payments.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentRequestService {

	/**
	 * This method will list all payment requests based on filter.
	 * 
	 * @param paymentCode
	 * @param paymentRequestSearchDto
	 * @param pageable
	 * @return PagedRestResponse<ListPendingPaymentDto>>
	 */
	PagedRestResponse<List<PendingPaymentDto>> listPendingPayments(String paymentCode,
			PaymentRequestSearchDto paymentRequestSearchDto, Pageable pageable);

	/**
	 * This method will create a payment request.
	 * 
	 * @param pendingPaymentRequestDto
	 * @param docDate
	 * @return PendingPaymentDto
	 */
	PendingPaymentDto createPendingPayemtRequest(CreatePaymentRequestDto pendingPaymentRequestDto, Date docDate);

	/**
	 * This method will close the payment based on id. Note: 'isGenerateCN' will
	 * decide if CN will be generated for the payment request or not.
	 * 
	 * @param id
	 * @param untilizedAmount
	 * @param isGenerateCN
	 * @param docDate
	 * @return PendingPaymentDto
	 */
	PendingPaymentDto closePendingPayment(String id, BigDecimal untilizedAmount, Boolean isGenerateCN, Date docDate);

	/**
	 * This method will get status from WorkFlow & update locally.
	 * 
	 * @param id
	 * @return PendingPaymentDto
	 */
	PendingPaymentDto getApprovalStatusbyId(String id);

	/**
	 * @param paymentRequestDao
	 * @param docDate
	 * @return PaymentRequestsDao
	 */
	PaymentRequestsDao getPaymentStatus(PaymentRequestsDao paymentRequestDao, Date docDate);

	/**
	 * Detach payment from a transaction. Note: to be used for payment in
	 * transaction only when status of request is 'CLOSED'.
	 * 
	 * @param paymentRequestDao
	 */
	void reversePayment(PaymentRequestsDao paymentRequestDao);

	/**
	 * Get Payment request other details.
	 * 
	 * @param otherDetails
	 * @return PaymentRequestOtherDetails
	 */
	PaymentRequestOtherDetails getOtherDetails(String otherDetails);

	/**
	 * This method will resend payment link to customer for AIRPAY/RAZORPAY.
	 * 
	 * @param id
	 * @return
	 */
	void resendPaymentLink(String id);

}
