/*  
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.PaymentReversalDao;

/**
 * Handles repository operations for <b>payment_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentReversalRepository")
public interface PaymentReversalRepository extends JpaRepository<PaymentReversalDao, String> {

	/**
	 *
	 * @param validPaymentCodes
	 * @param cancelTxnId
	 * @return
	 */
	List<PaymentReversalDao> findByCancelIdInAndPaymentCodeIn(List<String> cancelTxnId, List<String> validPaymentCodes);

	/**
	 * 
	 * @param locationCode
	 * @param paymentGroups 
	 * @param todayDate
	 * @param validPaymentCodes
	 * @return List<PaymentReversalDao>
	 */
	@Query("SELECT prd FROM PaymentReversalDao prd WHERE prd.cancel.id IN " 
			+ "(SELECT pr.cancel.id FROM PaymentReversalDao pr INNER JOIN com.titan.poss.sales.dao.CancelDao c ON c.id = pr.cancel.id WHERE pr.reversalDate = :businessDate AND "
			+ " (pr.paymentCode IN (:paymentCodeList) OR pr.paymentGroup IN (:paymentGroups)) and c.locationCode = :locationCode)"
			+" OR prd.creditNote.id IN "
			+ "(SELECT pr1.creditNote.id FROM PaymentReversalDao pr1 INNER JOIN com.titan.poss.sales.dao.CreditNoteDao cn ON cn.id = pr1.creditNote.id WHERE pr1.reversalDate = :businessDate AND "
			+" (pr1.paymentCode IN (:paymentCodeList) OR pr1.paymentGroup IN (:paymentGroups)) and cn.locationCode = :locationCode)")
	List<PaymentReversalDao> getPaymentReversalForRevenueCollection(@Param("locationCode") String locationCode,
			@Param("businessDate") Date businessDate, @Param("paymentCodeList") List<String> paymentCodeList,@Param("paymentGroups") List<String> paymentGroups);
	
	//@formatter:off
	@Query("SELECT prd FROM PaymentReversalDao prd \r\n"
			+ " INNER JOIN com.titan.poss.sales.dao.SalesTxnDao S ON prd.salesTxn.id = S.id"
			+ " WHERE S.status='CONFIRMED' "
			+ " AND prd.reversalDate = :businessDate "
			+ " AND (prd.paymentCode IN (:paymentCodeList) OR prd.paymentGroup IN (:paymentGroups))"
			+ " AND S.locationCode = :locationCode")
	// @formatter:on
	List<PaymentReversalDao> getPaymentReversalForTepRevenueCollection(@Param("locationCode") String locationCode, @Param("businessDate") Date todayDate,
			@Param("paymentCodeList") List<String> validPaymentCodes,@Param("paymentGroups") List<String> paymentGroup);

	PaymentReversalDao findOneBySalesTxnId(String id);

	PaymentReversalDao findOneByCreditNoteIdInAndIsResidualRefund(List<String> cnIds, boolean b);

}
