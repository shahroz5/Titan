/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import com.titan.poss.core.dto.EventCancellationDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventGRNDto;
import com.titan.poss.core.dto.EventResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface EventService {

	public EventResponseDto cashMemoDetails(String vendorCode, String txnId, String suTxnType, String status,
			Boolean isScheduled, EventCashMemoDto eventCashMemoDto);

	public EventResponseDto cancellationDetails(String vendorCode, String txnId, String cancelType, String status,
			Boolean isScheduled, EventCancellationDto eventCancellationDto);

	public EventResponseDto goodsReturnDetails(String vendorCode, String txnId, Boolean isScheduled,
			EventGRNDto eventGRNDto);

}
