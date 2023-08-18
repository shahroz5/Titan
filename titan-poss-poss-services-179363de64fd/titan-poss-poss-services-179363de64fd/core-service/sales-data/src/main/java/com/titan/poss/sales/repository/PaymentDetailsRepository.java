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

import com.titan.poss.sales.dao.PaymentDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentDetailsRepository")
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetailsDao, String> {

	// @formatter:off
	@Query("SELECT pd FROM com.titan.poss.sales.dao.PaymentDetailsDao pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :txnId \r\n" 
			+ "AND (:status IS NULL OR pd.status = :status)")
	// @formatter:on
	List<PaymentDetailsDao> getBySalesTxnDaoIdAndStatus(@Param("txnId") String txnId, @Param("status") String status);

}
