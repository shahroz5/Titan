/**
 * Copyright 2019. Titan Company Limited All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CUSTOMER_REPOSITORY;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.PaymentCustomerMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYMENT_CUSTOMER_REPOSITORY)
public interface PaymentCustomerMappingRepository extends JpaRepository<PaymentCustomerMappingDao, String> {

	/**
	 * @param configIdList
	 * @return List<ConfigDetailsDao>
	 */
	@Query("SELECT c FROM PaymentCustomerMappingDao c WHERE c.configId.configId = :configId")
	List<PaymentCustomerMappingDao> findByConfigDetailId(@Param("configId") String configId);

	/**
	 * @param configDetailIdRemove
	 * @return
	 */
	List<PaymentCustomerMappingDao> findByIdIn(@Param("configIdList") List<String> configDetailIdRemove);

	/**
	 * @param configDao
	 * @param customerType
	 */
	List<PaymentCustomerMappingDao> findByConfigIdAndCustomerType(ConfigDao configDao, String customerType);

	/**
	 * @param configId
	 * @param customerType
	 * @param transactionType
	 * @return PaymentCustomerMappingDao
	 */
	PaymentCustomerMappingDao findByConfigIdAndCustomerTypeAndTransactionDaoTransactionType(ConfigDao configId,
			String customerType, String transactionType);

}
