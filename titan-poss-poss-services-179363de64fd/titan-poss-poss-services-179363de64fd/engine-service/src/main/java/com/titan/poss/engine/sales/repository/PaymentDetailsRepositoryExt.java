/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.engine.dto.response.PaymentRedemptionDetailsDto;
import com.titan.poss.sales.repository.PaymentDetailsRepository;

/**
 * Repository for <b>payment_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("enginePaymentDetailsRepository")
public interface PaymentDetailsRepositoryExt extends PaymentDetailsRepository {

	// @formatter:off
	@Query("SELECT new com.titan.poss.engine.dto.response.PaymentRedemptionDetailsDto(pd.salesTxnDao.locationCode, \r\n"
			+ " pd.salesTxnDao.confirmedTime ,pd.salesTxnDao.txnType, pd.salesTxnDao.subTxnType, pd.salesTxnDao.docNo) \r\n"
			+ " FROM com.titan.poss.sales.dao.PaymentDetailsDao pd \r\n"
			+ " WHERE pd.status = 'COMPLETED' \r\n"
			+ " AND pd.paymentCode = :paymentCode \r\n"
			+ " AND pd.paymentGroup = :paymentGroup \r\n"
			+ " AND pd.instrumentNo = :instrumentNo")
	// @formatter:on
	List<PaymentRedemptionDetailsDto> findClosedPaymentsByPaymentCodeAndPaymentGroupAndInstrumentNo(
			@Param("paymentCode") String paymentCode, @Param("paymentGroup") String paymentGroup,
			@Param("instrumentNo") String instrumentNo);

}
