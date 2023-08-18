/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import com.titan.poss.sales.dto.response.OrderResponseDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for Header data of Order activation request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderActivationRequestHeaderDto extends OrderResponseDto {

	private String title;

	private String customerName;

	private String customerType;

	private String ulpId;

	private String mobileNumber;

}
