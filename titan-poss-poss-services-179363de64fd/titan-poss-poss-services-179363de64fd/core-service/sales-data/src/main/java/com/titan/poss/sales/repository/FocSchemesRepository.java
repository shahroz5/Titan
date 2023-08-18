/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.FocSchemesDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocSchemesRepository extends JpaRepository<FocSchemesDao, String> {

	List<FocSchemesDao> findBySalesTxnId(String salesTxnId);

	List<FocSchemesDao> findBySalesTxnIdAndIdIn(String salesTxnId, Set<String> schemeIds);

	List<FocSchemesDao> findBySalesTxnIdAndStatusAndIdIn(String salesTxnId, String status, Set<String> schemeIds);

	List<FocSchemesDao> findByStatusAndIdIn(String status, Set<String> schemeIds);

	// @formatter:off
	@Query("SELECT fs FROM com.titan.poss.sales.dao.FocSchemesDao fs \r\n"
			+ "WHERE fs.salesTxn.id = :txnId \r\n" 
			+ "AND (:status IS NULL OR fs.status = :status)")
	// @formatter:on
	List<FocSchemesDao> getBySalesTxnIdAndStatus(@Param("txnId") String txnId, @Param("status") String status);

}
