/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import java.util.List;

import com.titan.poss.core.dto.EventCashMemoDetailsDto;
import com.titan.poss.core.dto.EventCustomerDetailsDto;
import com.titan.poss.core.dto.EventGRNDetailsDto;
import com.titan.poss.core.dto.EventGiftSaleDetailsDto;
import com.titan.poss.core.dto.EventPaymentDetailsDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class EventOrderDetailsDto {

	private String subTxnType;

	private EventCustomerDetailsDto customer;

	private List<EventGRNDetailsDto> eventGRNList;

	private List<EventCashMemoDetailsDto> cashMemoDetailsList;

	private List<EventGiftSaleDetailsDto> giftSaleList;

	private List<EventPaymentDetailsDto> paymentList;

}
