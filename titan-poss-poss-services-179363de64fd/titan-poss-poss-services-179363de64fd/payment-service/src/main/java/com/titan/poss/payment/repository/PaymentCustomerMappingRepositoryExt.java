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

import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.PaymentCustomerMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PaymentCustomerMappingRepositoryExt extends JpaRepository<PaymentCustomerMappingDaoExt, String> {

	/**
	 * @param configId
	 * @return List<PaymentCustomerMappingDaoExt>
	 */
	@Query("SELECT c FROM PaymentCustomerMappingDaoExt c WHERE c.configId.configId = :configId")
	List<PaymentCustomerMappingDaoExt> findByConfigDetailId(@Param("configId") String configId);

	/**
	 * @param configDetailIdRemove
	 * @return List<PaymentCustomerMappingDaoExt>
	 */
	List<PaymentCustomerMappingDaoExt> findByIdIn(@Param("configIdList") List<String> configDetailIdRemove);

	/**
	 * @param configDao
	 * @param customerType
	 */
	List<PaymentCustomerMappingDaoExt> findByConfigIdAndCustomerType(ConfigDao configDao, String customerType);
}
