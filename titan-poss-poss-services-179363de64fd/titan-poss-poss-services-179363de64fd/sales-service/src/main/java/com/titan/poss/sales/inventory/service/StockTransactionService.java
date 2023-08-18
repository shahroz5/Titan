/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.inventory.service;

import java.util.List;

import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface StockTransactionService {

	/**
	 * @param stockTransactionDetailsList
	 */
	void addStockTransactionDetails(List<StockTransactionDetailsDao> stockTransactionDetailsList);

	/**
	 * @param stockTransaction
	 */
	void updateStockTransaction(StockTransactionDao stockTransaction);

	StockTransactionDao addBinStockTransaction(String status, String transactionType);

	StockTransactionDaoExt saveSalesStockTransaction(StockTransactionDaoExt stockTransactionDaoExt);

	StockTransactionDaoExt getSalesStockTransaction(String id, String transactionType, String locationCode);

	long getCountOfTotalQuantity(StockTransactionDaoExt stockTransactionDaoExt);

	StockTransactionDetailsDaoExt saveSalesStockTransactionDetails(
			StockTransactionDetailsDaoExt stockTransactionDetailsDaoExt);

	List<StockTransactionDetailsDaoExt> getSalesListStockTransaction(StockTransactionDaoExt stockTransactionDaoExt);

	StockTransactionDetailsDaoExt getSalesStockTransactionDetails(StockTransactionDaoExt stockTransactionDaoExt,
			String itemId);

	void deleteStockTxnItems(StockTransactionDetailsDaoExt stockTransactionDetailsDaoExt);
}
