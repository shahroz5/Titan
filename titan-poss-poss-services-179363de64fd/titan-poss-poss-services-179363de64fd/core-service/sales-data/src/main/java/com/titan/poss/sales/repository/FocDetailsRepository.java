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

import com.titan.poss.sales.dao.FocDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocDetailsRepository extends JpaRepository<FocDetailsDao, String> {

	// @formatter:off
	@Query("SELECT fd FROM com.titan.poss.sales.dao.FocDetailsDao fd \r\n"
			+ "WHERE fd.salesTxn.id = :txnId \r\n" 
			+ "AND (:status IS NULL OR fd.status = :status)")
	// @formatter:on
	List<FocDetailsDao> getBySalesTxnIdAndStatus(@Param("txnId") String txnId, @Param("status") String status);

	// @formatter:off
	@Query("SELECT fd FROM com.titan.poss.sales.dao.FocDetailsDao fd \r\n"
			+ "WHERE fd.salesTxn.id = :txnId OR fd.salesTxn.id IN (SELECT id from com.titan.poss.sales.dao.SalesTxnDao WHERE refTxnId.id = :txnId) \r\n" 
			+ "AND fd.status = :status")
	// @formatter:on
	List<FocDetailsDao> getBySalesTxnIdAndRefTxnAndStatus(@Param("txnId") String txnId, @Param("status") String status);

	List<FocDetailsDao> findByIdIn(List<String> focIds);
	
	List<FocDetailsDao> findAllBySalesTxnId(@Param("salesTxnId") String salesTxnId);
}
