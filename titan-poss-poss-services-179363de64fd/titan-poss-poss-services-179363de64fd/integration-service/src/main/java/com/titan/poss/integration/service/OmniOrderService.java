/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

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

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface OmniOrderService {

	public ListResponse<OmniOpenOrderResponseDto> getOmniOrders(); 
	
	public ListResponse<OmniCancelOrderResponseDto> getOmniCancelOrders();
	
	public OmniOrderResponseDto omniOrderStatus(OmniOrderStatusUpdateDto omniOrderStatusUpdateDto);
	
	public OmniOrderResponseDto omniOrderPackDetails(OmniOrderPackDetailsDto omniOrderPackDetailsDto);
	
	public OmniOrderResponseDto omniOrderInvoiceDetails(OmniOrderInvoiceDetailsDto omniOrderInvoiceDetailsDto);
	
	public OmniOrderResponseDto omniOrderCancelledByCustomer(OmniOrderCustomerCancelDto omniOrderCustomerCancelDto);
	
	public OmniOrderResponseDto omniOrderResendOtp(OmniOrderResendOtpDto omniOrderResendOtpDto);
	
	public OmniOrderResponseDto omniOrderReturn(OmniOrderReturnDto omniOrderReturnDto);
}
