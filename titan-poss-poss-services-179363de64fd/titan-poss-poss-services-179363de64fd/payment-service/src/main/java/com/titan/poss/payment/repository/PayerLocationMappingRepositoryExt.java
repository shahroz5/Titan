package com.titan.poss.payment.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayerConfigDaoExt;
import com.titan.poss.payment.dao.PayerLocationMappingDaoExt;

@Repository
public interface PayerLocationMappingRepositoryExt extends JpaRepository<PayerLocationMappingDaoExt, String> {
	/**
	 * @param payerConfigDao
	 * @return List<PayerLocationMappingDao>
	 */
	List<PayerLocationMappingDaoExt> findByPayerBankConfig(PayerConfigDaoExt payerConfigDao);

	/**
	 * @param removeLocations
	 * @return
	 */
	List<PayerLocationMappingDaoExt> findByLocationCodeInAndPayerBankConfig(List<String> removeLocations,
			PayerConfigDaoExt payerConfigDao);


	/**
	 *
	 * @param overwriteLocations
	 * @return List<PayerLocationMappingDaoExt>
	 */
	List<PayerLocationMappingDaoExt> findByLocationCodeIn(List<String> overwriteLocations);

	
	/**
	 * @param configId
	 * @param paymentCode 
	 * @param locationCodes
	 * @return List<ConfigLocationMappingDaoExt>
	 */
	@Query("SELECT plm FROM PayerLocationMappingDaoExt plm where (:configId IS NULL OR plm.payerBankConfig.id !=:configId)"
			+ " AND plm.payment.paymentCode = :paymentCode AND (nullif(CHOOSE(1,:includeLocations),'') IS NULL OR plm.locationCode IN (:includeLocations))")
	List<PayerLocationMappingDaoExt> findOtherConfigMappedLocationCode(@Param("configId") String configId,
			@Param("paymentCode") String paymentCode, @Param("includeLocations") Set<String> locationCodes);

	/**
	 * 
	 * @param overwriteLocations
	 * @param paymentCode
	 * @return
	 */
	List<PayerLocationMappingDaoExt> findByLocationCodeInAndPaymentPaymentCode(
			List<String> overwriteLocations, String paymentCode);
}
