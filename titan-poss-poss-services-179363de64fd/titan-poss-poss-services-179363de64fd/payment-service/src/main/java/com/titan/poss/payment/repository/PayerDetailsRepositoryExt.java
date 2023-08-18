/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayerConfigDaoExt;
import com.titan.poss.payment.dao.PayerDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PayerDetailsRepositoryExt extends JpaRepository<PayerDetailsDaoExt, String> {

	/**
	 * @param payerConfigDao
	 * @return List<PayerDetailsDao>
	 */
	List<PayerDetailsDaoExt> findByPayerBankConfig(PayerConfigDaoExt payerConfigDao);

	/**
	 * @param removeBankName
	 * @return List<PayerDetailsDao>
	 */
	List<PayerDetailsDaoExt> findByIdIn(List<String> removeBankName);

	/**
	 * @param paymentConfigIds
	 * @param pageable
	 * @return
	 */
	@Query("SELECT DISTINCT i.payerBank.bankName FROM PayerDetailsDaoExt i where i.payerBankConfig.id IN (:paymentConfigIds)")
	Page<String> getAllBankNames(@Param("paymentConfigIds") List<String> paymentConfigIds, Pageable pageable);
}
