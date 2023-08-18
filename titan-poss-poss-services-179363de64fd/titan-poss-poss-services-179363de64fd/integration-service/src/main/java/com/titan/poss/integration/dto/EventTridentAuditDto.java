/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import com.titan.poss.core.dto.EventResponseDto;
import com.titan.poss.integration.dto.request.EventOrderDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class EventTridentAuditDto {

	private String vendorCode;

	private String txnId;

	private EventOrderDetailsDto eventOrderDetailsDto;

	private String transactionType;

	private String status;

	private EventResponseDto eventResponseDto;

}
