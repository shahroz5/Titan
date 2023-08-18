/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.PaymentHostnameUpdateDto;
import com.titan.poss.payment.dto.response.PaymentHostnameResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentHostnameService {

	PagedRestResponse<List<PaymentHostnameResponseDto>> listPaymentHostnames(String paymentCode, String locationCode,
			Boolean isActive, Pageable pageable);

	PaymentHostnameUpdateDto updatePaymentHostname(PaymentHostnameUpdateDto paymentHostnameUpdateDto);
}
