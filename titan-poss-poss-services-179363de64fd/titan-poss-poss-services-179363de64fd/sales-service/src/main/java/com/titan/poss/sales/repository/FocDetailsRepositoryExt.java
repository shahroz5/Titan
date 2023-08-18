/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.FocDetailsDaoExt;

/**
 * 
 * Repository interface for the operations on foc_details table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesFocDetailsRepository")
public interface FocDetailsRepositoryExt extends JpaRepository<FocDetailsDaoExt, String> {

	Integer countBySalesTxnId(@Param("salesTxnId") String salesTxnId);

	List<FocDetailsDaoExt> findAllBySalesTxnId(@Param("salesTxnId") String salesTxnId);

	void deleteAllBySalesTxnId(String salesTxnId);

	List<FocDetailsDaoExt> findBySalesTxnId(String id);

	// @formatter:off
	@Query(" SELECT fd FROM com.titan.poss.sales.dao.FocDetailsDaoExt fd \r\n"
			+ " WHERE fd.id IN (SELECT gd.focDetailsId FROM com.titan.poss.sales.dao.GrnDetailsDaoExt gd "
			+ "						WHERE gd.grn.id = :cancelId AND gd.focDetailsId IS NOT NULL)")
	// @formatter:on
	List<FocDetailsDaoExt> listFocItemsByCancelId(@Param("cancelId") String cancelId);

	/**
	 * @param focSchemeId
	 */
	@Modifying
	@Query("delete from FocDetailsDaoExt fd where fd.focScheme.id in(:focSchemeId)")
	void deleteAllByFocSchemeId(@Param("focSchemeId") List<String> focSchemeId);
	
	FocDetailsDaoExt findOneBySalesTxnId(@Param("salesTxnId") String salesTxnId);
}
