/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;
import java.util.Set;

import com.titan.poss.sales.dao.PaymentItemMappingDao;

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
//@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CashMemoEntities extends ReturnableItemsDto {

	CashMemoEntity originalTxn;
	CashMemoEntity issueFocTxn;

	CustomerEpossSearchDto customer;

	List<ReturnableItemsDto> returnedItems;
	
	
	public CashMemoEntities(CashMemoEntity originalTxn, CashMemoEntity issueFocTxn, CustomerEpossSearchDto customer,
			List<ReturnableItemsDto> returnedItems,List<PaymentItemMappingDao> paymentItemMappingDaoDetails) {
		super();
		this.originalTxn = originalTxn;
		this.issueFocTxn = issueFocTxn;
		this.customer = customer;
		
	}

	@Override
	public String toString() {
		return "CashMemoEntities [originalTxn=" + originalTxn + ", issueFocTxn=" + issueFocTxn + ", customer="
				+ customer + ", returnedItems="  +returnedItems.toString()+ "]";
	}

	

}
