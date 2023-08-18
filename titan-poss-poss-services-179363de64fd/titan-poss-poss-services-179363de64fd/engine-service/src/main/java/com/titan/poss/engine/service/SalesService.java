/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.BusinessDayWithPreviousDateDto;
import com.titan.poss.core.dto.CashMemoFetchDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.CustomerDto;
import com.titan.poss.engine.dto.response.PaymentRedemptionDetailsDto;

/**
 * Service interface for Sales
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("EngineSalesService")
public interface SalesService {

	/**
	 * It will get the customer details based on customerId.
	 * 
	 * @param customerId
	 * @return CustomerDto
	 */
	CustomerDto getCustomer(Integer customerId);

	/**
	 * This method will give redemption details based on paymentCode, paymentGroup &
	 * instrumentNo.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param instrumentNo
	 * @return ListResponse<PaymentRedemptionDetailsDto>
	 */
	ListResponse<PaymentRedemptionDetailsDto> getRedemptionDetails(String paymentCode, String paymentGroup,
			String instrumentNo);

	/**
	 * This method will be called to get the business day.
	 */
	BusinessDayDto getBusinessDay(String locationCode);

	/**
	 * This method will be called to get the business day.
	 */
	BusinessDayDto getBusinessDayInProgress(String locationCode);

	/**
	 * This method will be called to get the latest business day.
	 */
	BusinessDayWithPreviousDateDto getLatestBusinessDay();
	
	List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(CustomerPurchaseRequestDto customerPurchaseRequestDto);
	
	Boolean getRefundId(String id);
	
	


}
