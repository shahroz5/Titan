/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_SERVICE;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.request.PaymentAddDto;
import com.titan.poss.payment.dto.request.PaymentUpdateDto;
import com.titan.poss.payment.dto.response.PaymentDto;
import com.titan.poss.payment.dto.response.PaymentLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_SERVICE)
public interface PaymentService {

	/**
	 * This method will return the list of Payment modes based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PaymentDto>>
	 */
	PagedRestResponse<List<PaymentDto>> listPayment(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Payment Code based on the paymentCode.
	 * 
	 * @param paymentCode
	 * @return PaymentDto
	 */
	PaymentDto getPayment(String paymentCode);

	/**
	 * This method will save the Payment details.
	 * 
	 * @param paymentCreateDto
	 * @param paymentGroup
	 * @return PaymentDto
	 */
	PaymentDto addPayment(PaymentAddDto paymentCreateDto, String paymentGroup);

	/**
	 * This method will update the Payment modes.
	 * 
	 * @param paymentCode
	 * @param paymentUpdateDto
	 * @param paymentGroup
	 * @return PaymentDto
	 */
	PaymentDto updatePayment(String paymentCode, PaymentUpdateDto paymentUpdateDto, String paymentGroup);

	/**
	 * 
	 * @param paymentCode
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<PaymentLiteDto>> listPaymentCode(String paymentCode, Boolean isPageable, Pageable pageable);

}
