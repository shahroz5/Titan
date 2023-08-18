/*  
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

import com.titan.poss.sales.dao.PaymentReversalDaoExt;

/**
 * Handles repository operations for <b>payment_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentReversalRepositoryExt")
public interface PaymentReversalRepositoryExt extends JpaRepository<PaymentReversalDaoExt, String> {

	List<PaymentReversalDaoExt> findByCancelId(String id);

	PaymentReversalDaoExt findByCreditNoteId(String id);

	List<PaymentReversalDaoExt> findBySalesTxnId(String id);
	
	//@formatter:off
	@Query("SELECT pr FROM com.titan.poss.sales.dao.PaymentReversalDaoExt pr INNER JOIN com.titan.poss.sales.dao.PaymentDetailsDaoExt pd ON pr.paymentId = pd.id"
			+ " WHERE pd.salesTxnDao.id = :salesTxnId and pd.paymentCode = :paymentCode")
	// @formatter:on
	List<PaymentReversalDaoExt> findAllBySalesTxnIdAndPaymentCode(@Param("salesTxnId") String salesTxnId,@Param("paymentCode") String paymentCode);
}
