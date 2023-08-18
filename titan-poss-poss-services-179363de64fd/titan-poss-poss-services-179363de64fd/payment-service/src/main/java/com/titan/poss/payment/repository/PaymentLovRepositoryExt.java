/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PaymentLovDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("paymentLovRepositoryExt")
public interface PaymentLovRepositoryExt extends JpaRepository<PaymentLovDaoExt, String> {

	/**
	 * This method will return the List of Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return List<PaymentLovDao>
	 */
	List<PaymentLovDaoExt> findByLovType(String lovType);

	List<PaymentLovDaoExt> findByLovTypeAndIsActiveTrue(String lovType);

	/**
	 * This method will return the List of Lov details based on the lovType and
	 * Code.
	 * 
	 * @param name
	 * @param transactionCode
	 * @return List<PaymentLovDao>
	 */
	@Query("SELECT l FROM PaymentLovDaoExt l WHERE l.lovType = :name AND (l.code = :transactionCode OR nullif(CHOOSE(1,:transactionCode),'') IS NULL)")
	List<PaymentLovDaoExt> findByLovTypeAndCode(@Param("name") String name,
			@Param("transactionCode") String transactionCode);

	/**
	 * @param lovType
	 * @param code
	 * @return PaymentLovDao
	 */
	PaymentLovDaoExt findOneByLovTypeAndCode(String lovType, String code);
}
