/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ConfigLovDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ConfigLovRepositoryExt extends JpaRepository<ConfigLovDaoExt, String> {

	/**
	 * This method will return the List of Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return List<PaymentLovDao>
	 */
	List<ConfigLovDaoExt> findByLovType(String lovType);

	List<ConfigLovDaoExt> findByLovTypeAndIsActiveTrue(String lovType);

	/**
	 * This method will return the List of Lov details based on the lovType and
	 * Code.
	 * 
	 * @param name
	 * @param transactionCode
	 * @return List<PaymentLovDao>
	 */
	@Query("SELECT c FROM ConfigLovDaoExt c WHERE c.lovType = :name AND (c.code = :transactionCode OR nullif(CHOOSE(1,:transactionCode),'') IS NULL)")
	List<ConfigLovDaoExt> findByLovTypeAndCode(@Param("name") String name,
			@Param("transactionCode") String transactionCode);

	/**
	 * @param lovType
	 * @param code
	 * @return PaymentLovDao
	 */
	ConfigLovDaoExt findOneByLovTypeAndCode(String lovType, String code);
}
