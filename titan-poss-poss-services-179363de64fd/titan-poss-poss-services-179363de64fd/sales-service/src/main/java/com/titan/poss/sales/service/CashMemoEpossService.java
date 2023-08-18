/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dto.CashMemoDetailsResponseDto;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CashMemoEpossService {

	public CashMemoEntities getCashMemoEntityDetails(String txnType, String locationCode, Integer refDocNo,
			Short refFiscalYear, boolean isGrnItemAllowedCheck,Boolean isMigratedIgnored);

	public List<ReturnableItemsDto> listItemIdAllowedForReturn(String cmId, String txnType);
	
	CustomerTxnDao getCustomerTxnDetailsById(String refId);

	public ListResponse<ItemDetailsResponseDto> listItemsAllowedForReturn(String cmId, String locationCode,
			String txnType);

	public CashMemoEntities persistLegacyCm(CashMemoEntities cashMemoEntities,List<CashMemoDetailsDao> cmDetailsList);

	public CustomerCouponDto getCustomerCoupon(String id, String couponCode, String status, String transactionId);

	EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode, String customerId);

	ListResponse<RivaahGhsDiscountDto> getReturnedRivaahGhsDetails(String transactionId);

	List<CashMemoDetailsResponseDto> checkCmAvailable(String txnType,String locationCode,String itemCode, String customerMobileNo, String customerId,Boolean isMigratedIgnored);
	
	public short getTotalReturnedItems(String id); 
}
