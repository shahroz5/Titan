/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EventGRNDto {
	
	private EventCustomerDetailsDto customer;
	
	private List<EventGRNDetailsDto> eventGRNList;

	private List<EventPaymentDetailsDto> paymentList;

}
