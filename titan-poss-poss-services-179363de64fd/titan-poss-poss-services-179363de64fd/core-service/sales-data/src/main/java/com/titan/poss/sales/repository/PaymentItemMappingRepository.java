/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.PaymentItemMappingDao;

/**
 * Handles repository operations for <b>payment_item_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("paymentItemMappingRepository")
public interface PaymentItemMappingRepository extends JpaRepository<PaymentItemMappingDao, String> {
	
	@Query("SELECT pim FROM com.titan.poss.sales.dao.PaymentItemMappingDao pim \r\n"
			+ " WHERE pim.paymentDetailsDao.salesTxnDao.id = :transactionId \r\n"
			+ " AND pim.paymentDetailsDao.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND (NULLIF(CHOOSE(1,:status),'') IS NULL OR pim.paymentDetailsDao.status IN (:status)) \r\n"
			+ " AND (NULLIF(CHOOSE(1,:productGroupList),'') IS NULL OR pim.productGroupCode IN (:productGroupList)) ")
	// @formatter:on
	List<PaymentItemMappingDao> getByTxnIdAndLocationCodeAndStatusIn(@Param("transactionId") String transactionId,
			@Param("locationCode") String locationCode, @Param("status") List<String> status,
			@Param("productGroupList") List<String> productGroupList);
	

}
