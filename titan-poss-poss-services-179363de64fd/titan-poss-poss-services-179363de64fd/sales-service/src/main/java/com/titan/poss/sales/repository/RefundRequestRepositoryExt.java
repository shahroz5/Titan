/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.RefundRequestDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesRefundRequestRepository")
public interface RefundRequestRepositoryExt extends JpaRepository<RefundRequestDaoExt, String> {

	@Query("SELECT refund FROM RefundRequestDaoExt refund WHERE refund.txnType = :txnType AND "
			+ "	(refund.docNo = :docNo OR :docNo IS NULL) AND "
			+ "	(refund.locationCode = :locationCode OR :locationCode IS NULL) AND "
			+ " (refund.fiscalYear = :fiscalYear OR :fiscalYear IS NULL) AND "
			+ " refund.docDate between :startDate AND :endDate AND refund.status IN (:statuses) AND "
			+ " refund.subTxnType IN (:subTxnTypes) AND refund.refundType = :refundType ")
	Page<RefundRequestDaoExt> listStockTransactionIssueHistory(@Param("txnType") String txnType,
			@Param("docNo") Integer docNo, @Param("locationCode") String locationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("fiscalYear") Short fiscalYear,
			@Param("refundType") String refundType, @Param("subTxnTypes") List<String> subTxnTypes, Pageable pageable);

	RefundRequestDaoExt findByIdAndTxnType(String id, String txnType);

	RefundRequestDaoExt findByRefTxnIdAndTxnType(String refTxnId, String txnType);

}
