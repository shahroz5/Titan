/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import com.titan.poss.report.dao.ReportLovDaoExt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("paymentLovRepositoryExt")
public interface ReportLovRepositoryExt extends JpaRepository<ReportLovDaoExt, String> {

	/**
	 * This method will return the List of Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return List<ReportLovDao>
	 */
	List<ReportLovDaoExt> findByLovType(String lovType);

	List<ReportLovDaoExt> findByLovTypeAndIsActiveTrue(String lovType);

	/**
	 * This method will return the List of Lov details based on the lovType and
	 * Code.
	 * 
	 * @param name
	 * @param transactionCode
	 * @return List<ReportLovDao>
	 */
	@Query("SELECT l FROM ReportLovDaoExt l WHERE l.lovType = :name AND (l.code = :transactionCode OR nullif(CHOOSE(1,:transactionCode),'') IS NULL)")
	List<ReportLovDaoExt> findByLovTypeAndCode(@Param("name") String name,
			@Param("transactionCode") String transactionCode);

	/**
	 * @param lovType
	 * @param code
	 * @return ReportLovDao
	 */
	ReportLovDaoExt findOneByLovTypeAndCode(String lovType, String code);
}
