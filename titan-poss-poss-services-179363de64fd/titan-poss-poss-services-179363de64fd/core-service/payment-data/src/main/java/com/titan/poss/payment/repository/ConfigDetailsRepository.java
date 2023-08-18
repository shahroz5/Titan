/**
 * Copyright 2019. Titan Company Limited All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.CONFIG_DETAILS_REPOSITORY;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigDetailsDao;
import com.titan.poss.payment.dto.TransactionTypeCountDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(CONFIG_DETAILS_REPOSITORY)
public interface ConfigDetailsRepository extends JpaRepository<ConfigDetailsDao, String> {

	/**
	 * This method will return the list of Payment Configuration details based on
	 * the paymentConfig, isActive.
	 * 
	 * @param configId
	 * @param paymentCode
	 * @param transactionType
	 * @return ConfigDetailsDto
	 */
	@Query("SELECT cd FROM ConfigDetailsDao cd WHERE (cd.configId = :configId)"
			+ " AND (cd.payment.paymentCode IN (:paymentCode) OR  nullif(CHOOSE(1,:paymentCode),'') IS NULL)"
			+ " AND (cd.transactionDao.transactionType IN (:transactionType) OR  nullif(CHOOSE(1,:transactionType),'') IS NULL)")
	List<ConfigDetailsDao> findAllByConfigId(@Param("configId") ConfigDao configId,
			@Param("paymentCode") List<String> paymentCode, @Param("transactionType") List<String> transactionType);

	/**
	 * @param configIdList
	 * @return List<ConfigDetailsDao>
	 */
	@Query("SELECT c FROM ConfigDetailsDao c WHERE c.id IN (:configIdList)")
	List<ConfigDetailsDao> findAllByConfigDetailId(@Param("configIdList") List<String> configIdList);

	/**
	 * This method will return the list of Config Details on configId and
	 * transactionType.
	 * 
	 * @param configId
	 * @param transactionType
	 * @return List<ConfigDetailsDao>
	 */
	List<ConfigDetailsDao> findByConfigIdAndTransactionDaoTransactionType(ConfigDao configId, String transactionType);

	/**
	 * 
	 * @param configId
	 * @return List<TransactionTypeCountDto>
	 */
	@Query("select new com.titan.poss.payment.dto.TransactionTypeCountDto(c.payment.paymentCode as paymentCode, count(c.payment.paymentCode) as transactionTypeCount) "
			+ "from ConfigDetailsDao c where c.configId.configId = :configId group by c.payment.paymentCode")
	List<TransactionTypeCountDto> findByConfigId(@Param("configId") String configId);

	/**
	 * @param configId
	 * @param paymentCode
	 * @param transactionType
	 * @return
	 */
	ConfigDetailsDao findByConfigIdConfigIdAndPaymentPaymentCodeAndTransactionDaoTransactionType(String configId,
			String paymentCode, String transactionType);

}
