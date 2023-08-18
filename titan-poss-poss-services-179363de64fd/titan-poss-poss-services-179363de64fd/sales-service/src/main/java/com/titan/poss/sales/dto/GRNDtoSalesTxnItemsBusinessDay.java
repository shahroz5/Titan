/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Date;
import java.util.List;

import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GRNDtoSalesTxnItemsBusinessDay {

	SalesTxnDao salesTxn;
	SalesTxnDaoExt salesTxnExt;

	Date businessDay;

	List<CashMemoDetailsDao> items;
	List<CashMemoDetailsDao> itemsToReturn;

	List<ReturnableItemsDto> returnableItems;

}
