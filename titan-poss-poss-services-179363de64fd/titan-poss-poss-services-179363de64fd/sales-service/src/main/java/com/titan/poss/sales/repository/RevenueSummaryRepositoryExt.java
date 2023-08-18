/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.RevenueSummaryDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RevenueSummaryRepositoryExt extends JpaRepository<RevenueSummaryDaoExt, String> {

	/**
	 * @param fromDate
	 * @param toDate
	 * @param pageable
	 * @return
	 */
	@Query("SELECT c FROM RevenueSummaryDaoExt c WHERE c.businessDate BETWEEN :fromDate AND :toDate AND c.locationCode = :locationCode")
	Page<RevenueSummaryDaoExt> findByBusinessDateAndLocationCode(@Param("fromDate") Date fromDate,
			@Param("toDate") Date toDate, @Param("pageable") Pageable pageable,
			@Param("locationCode") String locationCode);

	/**
	 *
	 * @param businessDate
	 * @param locationCode
	 * @return RevenueSummaryDao
	 */
	RevenueSummaryDaoExt findByBusinessDateAndLocationCode(Date businessDate, String locationCode);

}
