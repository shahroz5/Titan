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

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PayerBankConfigRepositoryExt extends JpaRepository<PayerConfigDaoExt, String> {

	/**
	 * @param id
	 * @return PayerConfigDao
	 */
	PayerConfigDaoExt findOneById(String id);

	/**
	 * @param description
	 * @return PayerConfigDao
	 */
	PayerConfigDaoExt findOneByDescription(String description);

	@Query("SELECT pc FROM PayerConfigDaoExt pc WHERE (:description IS NULL OR pc.description LIKE '%'+:description +'%') AND (:isActive IS NULL OR pc.isActive = :isActive)")
	Page<PayerConfigDaoExt> findAllByBankName(@Param("description")String description, @Param("isActive")Boolean isActive, Pageable pageable);

	/**
	 * @return List<String>
	 */
	@Query("SELECT pc.id FROM PayerConfigDaoExt pc WHERE (pc.payment.paymentCode = 'CASHBACK' OR pc.payment.paymentCode = 'CashBack') AND pc.isActive = true")
	List<String> getCashBackConfigIds();
}
