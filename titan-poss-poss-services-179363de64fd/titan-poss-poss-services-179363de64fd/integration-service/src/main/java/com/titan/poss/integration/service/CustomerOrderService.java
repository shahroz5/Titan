/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.util.List;

import com.titan.poss.core.dto.ComUpdateRequestDto;
import com.titan.poss.core.dto.ConfirmCustomerOrderDetailsDto;
import com.titan.poss.core.response.COResponseDto;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.integration.dto.ConfirmInvoiceDetailsDto;

public interface CustomerOrderService {
    
	Object getCustomerOrderData(String locationCode);
	
	Object getCustomerOrderComData(String locationCode);
	
	Object updateStatus(ComUpdateRequestDto comUpdateRequestDto);
	
	List<COResponseDto> confirmCustomerOrder(ConfirmCustomerOrderDetailsDto confirmCustomerOrderDetailsDto);
	
	List<COResponseDto> confirmInvoiceDetails(List<ConfirmInvoiceDetailsDto> confirmInvoiceDetailsDto);
}
