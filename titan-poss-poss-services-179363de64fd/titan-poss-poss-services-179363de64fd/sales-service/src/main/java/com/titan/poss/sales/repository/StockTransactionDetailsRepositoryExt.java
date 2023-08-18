/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesStockTransactionDetailsRepository")
public interface StockTransactionDetailsRepositoryExt extends JpaRepository<StockTransactionDetailsDaoExt, String> {

	@Query("SELECT COALESCE(COUNT(details),0) FROM StockTransactionDetailsDaoExt details WHERE details.stockTransaction = :stockTransaction")
	long getCountOfTotalQuantity(@Param("stockTransaction") StockTransactionDaoExt stockTransaction);

	List<StockTransactionDetailsDaoExt> findByStockTransaction(StockTransactionDaoExt stockTransactionDaoExt);

	StockTransactionDetailsDaoExt findByStockTransactionAndId(StockTransactionDaoExt stockTransactionDaoExt,
			String itemId);

}
