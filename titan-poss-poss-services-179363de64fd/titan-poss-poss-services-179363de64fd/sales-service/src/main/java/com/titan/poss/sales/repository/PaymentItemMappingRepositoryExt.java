/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;

/**
 * Handles repository operations for <b>payment_item_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentItemMappingRepository")
public interface PaymentItemMappingRepositoryExt extends JpaRepository<PaymentItemMappingDaoExt, String> {

	// @formatter:off
	@Query("SELECT pim FROM com.titan.poss.sales.dao.PaymentItemMappingDaoExt pim \r\n"
			+ " WHERE pim.paymentDetailsDao.salesTxnDao.id = :transactionId \r\n"
			+ " AND pim.paymentDetailsDao.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND (NULLIF(CHOOSE(1,:status),'') IS NULL OR pim.paymentDetailsDao.status IN (:status)) \r\n"
			+ " AND (NULLIF(CHOOSE(1,:productGroupList),'') IS NULL OR pim.productGroupCode IN (:productGroupList)) ")
	// @formatter:on
	List<PaymentItemMappingDaoExt> getByTxnIdAndLocationCodeAndStatusIn(@Param("transactionId") String transactionId,
			@Param("locationCode") String locationCode, @Param("status") List<String> status,
			@Param("productGroupList") List<String> productGroupList);

	List<PaymentItemMappingDaoExt> findByPaymentDetailsDaoId(String paymentId);

	List<PaymentItemMappingDaoExt> findByItemId(String paymentId);

	List<PaymentItemMappingDaoExt> findByItemIdInAndPaymentDetailsDaoStatusIn(Set<String> itemId, List<String> status);

	// @formatter:off
	@Query("SELECT pim \r\n"
			+ " FROM com.titan.poss.sales.dao.PaymentItemMappingDaoExt pim \r\n"
			+ " WHERE pim.paymentDetailsDao.id IN  (:paymentIdListForPaymentItemMapDelete) \r\n"
			+ " AND pim.paymentDetailsDao.status IN (:status)")
	// @formatter:off
	List<PaymentItemMappingDaoExt>  getPaymentItemMap(@Param("paymentIdListForPaymentItemMapDelete") List<String> paymentIdListForPaymentItemMapDelete, @Param("status") List<String> status);
	
	@Query("SELECT pim \r\n"
			+ " FROM com.titan.poss.sales.dao.PaymentItemMappingDaoExt pim \r\n"
			+ " WHERE pim.paymentDetailsDao.id = :paymentId \r\n"
			+ " AND pim.itemId IN (:itemId)")
	List<PaymentItemMappingDaoExt> findByPaymentDetailsDaoIdAndItemIdIn(@Param("paymentId") String paymentId,@Param("itemId") List<String> itemId);

}
