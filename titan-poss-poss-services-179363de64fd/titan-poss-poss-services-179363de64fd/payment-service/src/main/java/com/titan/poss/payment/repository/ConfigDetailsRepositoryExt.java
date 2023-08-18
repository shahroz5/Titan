package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigDaoExt;
import com.titan.poss.payment.dao.ConfigDetailsDaoExt;
import com.titan.poss.payment.dto.TransactionTypeCountDto;

@Repository
public interface ConfigDetailsRepositoryExt extends JpaRepository<ConfigDetailsDaoExt, String> {
	/**
	 * This method will return the list of Payment Configuration details based on
	 * the paymentConfig, isActive.
	 * 
	 * @param configId
	 * @param paymentCode
	 * @param transactionType
	 * @return ConfigDetailsDto
	 */
	@Query("SELECT cd FROM ConfigDetailsDaoExt cd WHERE (cd.configId = :configId)"
			+ " AND (cd.payment.paymentCode IN (:paymentCode) OR  nullif(CHOOSE(1,:paymentCode),'') IS NULL)"
			+ " AND (cd.transactionDao.transactionType IN (:transactionType) OR  nullif(CHOOSE(1,:transactionType),'') IS NULL)")
	List<ConfigDetailsDaoExt> findAllByConfigDao(@Param("configId") ConfigDaoExt configId,
			@Param("paymentCode") List<String> paymentCode, @Param("transactionType") List<String> transactionType);

	/**
	 * @param configIdList
	 * @return List<ConfigDetailsDao>
	 */
	@Query("SELECT c FROM ConfigDetailsDaoExt c WHERE c.id IN (:configIdList)")
	List<ConfigDetailsDaoExt> findAllByConfigDetailId(@Param("configIdList") List<String> configIdList);

	/**
	 * This method will return the list of Config Details on configId and
	 * transactionType.
	 * 
	 * @param configId
	 * @param transactionType
	 * @return List<ConfigDetailsDao>
	 */
	List<ConfigDetailsDaoExt> findByConfigIdAndTransactionDaoTransactionType(ConfigDao configDao,
			String transactionType);

	/**
	 * 
	 * @param configId
	 * @return List<TransactionTypeCountDto>
	 */
	@Query("select new com.titan.poss.payment.dto.TransactionTypeCountDto(c.payment.paymentCode as paymentCode, count(c.payment.paymentCode) as transactionTypeCount) "
			+ "from ConfigDetailsDaoExt c where c.configId.configId = :configId group by c.payment.paymentCode")
	List<TransactionTypeCountDto> findByConfigId(@Param("configId") String configId);

	List<ConfigDetailsDaoExt> findAllByConfigId(ConfigDaoExt configId);

}
