/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;
import java.util.Map;

import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.GrnDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface InventoryUtilService {

	/**
	 * @param cashMemoDetails
	 * @param salesTxn
	 * @param docType
	 * @param cancelType
	 * @param docNo
	 * @param fiscalYear
	 * @param grnItemDetails 
	 * @return List<InventoryDetailsDao>
	 */
	List<InventoryDetailsDao> createInventoryEntityFromCashMemoDetails(List<CashMemoDetailsDao> cashMemoDetails,
			List<FocDetailsDao> focDetails, 
			SalesTxnDaoExt salesTxn, SalesDocTypeEnum docType, String cancelType, Integer docNo, Short fiscalYear, Map<String, GrnDetailsDaoExt> grnItemDetails);

}
