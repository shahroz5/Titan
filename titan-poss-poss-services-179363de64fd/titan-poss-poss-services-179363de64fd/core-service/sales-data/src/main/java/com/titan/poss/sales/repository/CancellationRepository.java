/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CancelDaoExt;

/**
 * Repository for CancelDao.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesCancellationRepository")
public interface CancellationRepository extends JpaRepository<CancelDao, String> {

	/**
	 * This method will return the cancel Id.
	 * 
	 * @param locationCode
	 * @param todayDate
	 * @return cancelId
	 */
	@Query("SELECT c.id FROM Cancel c WHERE c.locationCode = :locationCode AND c.docDate = :todayDate")
	List<String> findByLocationCodeAndDocDate(@Param("locationCode") String locationCode,
			@Param("todayDate") Date todayDate);

	CancelDao findByIdAndLocationCodeAndStatus(String cancelId, String locationCode, String status);

	CancelDao findByIdAndLocationCode(String cancelId, String locationCode);

	Optional<CancelDaoExt> findByIdAndTxnTypeAndLocationCodeAndStatus(String id, String txnType, String locationCode,
			String status);

}
