/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.integration.dto.request.OmniOrderCustomerCancelDto;
import com.titan.poss.integration.dto.request.OmniOrderInvoiceDetailsDto;
import com.titan.poss.integration.dto.request.OmniOrderPackDetailsDto;
import com.titan.poss.integration.dto.request.OmniOrderResendOtpDto;
import com.titan.poss.integration.dto.request.OmniOrderReturnDto;
import com.titan.poss.integration.dto.request.OmniOrderStatusUpdateDto;
import com.titan.poss.integration.dto.response.OmniCancelOrderResponseDto;
import com.titan.poss.integration.dto.response.OmniOpenOrderResponseDto;
import com.titan.poss.integration.dto.response.OmniOrderResponseDto;
import com.titan.poss.integration.service.OmniOrderService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationOmniOrderService")
public class OmniOrderServiceImpl implements OmniOrderService {

	@Override
	public ListResponse<OmniOpenOrderResponseDto> getOmniOrders() {
		return null;
	}

	@Override
	public ListResponse<OmniCancelOrderResponseDto> getOmniCancelOrders() {
		return null;
	}

	@Override
	public OmniOrderResponseDto omniOrderStatus(OmniOrderStatusUpdateDto omniOrderStatusUpdateDto) {
		return null;
	}

	@Override
	public OmniOrderResponseDto omniOrderPackDetails(OmniOrderPackDetailsDto omniOrderPackDetailsDto) {
		return null;
	}

	@Override
	public OmniOrderResponseDto omniOrderInvoiceDetails(OmniOrderInvoiceDetailsDto omniOrderInvoiceDetailsDto) {
		return null;
	}

	@Override
	public OmniOrderResponseDto omniOrderCancelledByCustomer(OmniOrderCustomerCancelDto omniOrderCustomerCancelDto) {
		return null;
	}

	@Override
	public OmniOrderResponseDto omniOrderResendOtp(OmniOrderResendOtpDto omniOrderResendOtpDto) {
		return null;
	}

	@Override
	public OmniOrderResponseDto omniOrderReturn(OmniOrderReturnDto omniOrderReturnDto) {
		return null;
	}

}
