/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_LOCATION_MAPPING_REPOSITORY;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dao.PayerLocationMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository(PAYER_BANK_LOCATION_MAPPING_REPOSITORY)
public interface PayerLocationMappingRepository extends JpaRepository<PayerLocationMappingDao, String> {

	/**
	 * @param payerConfigDao
	 * @return List<PayerLocationMappingDao>
	 */
	List<PayerLocationMappingDao> findByPayerBankConfig(PayerConfigDao payerConfigDao);

	/**
	 * @param removeLocations
	 * @return
	 */
	List<PayerLocationMappingDao> findByPayerBankConfigIn(List<String> removeLocations);

 	/**
 	 * 
 	 * @param locationCode
-	 * @param paymentCode
 	 * @return PayerLocationMappingDao
 	 */
	PayerLocationMappingDao findByLocationCodeAndPaymentPaymentCode(String locationCode, String paymentCode);

	/**
	 * @param id
	 * @param locationCode
	 * @param paymentCode
	 * @return PayerLocationMappingDao
	 */
	PayerLocationMappingDao findByPayerBankConfigIdAndLocationCodeAndPaymentPaymentCode(String id, String locationCode,
			String paymentCode);
	
}
