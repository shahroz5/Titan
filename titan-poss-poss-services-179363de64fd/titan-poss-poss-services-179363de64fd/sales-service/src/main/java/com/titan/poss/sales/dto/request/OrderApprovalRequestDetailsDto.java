/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import com.titan.poss.sales.dto.response.SalesPaymentDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for requested data of order cancel request or activate request Approval.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderApprovalRequestDetailsDto {

	private List<Object> itemList;
	private List<SalesPaymentDto> paymentList;
	private List<Object> discountList;
}
