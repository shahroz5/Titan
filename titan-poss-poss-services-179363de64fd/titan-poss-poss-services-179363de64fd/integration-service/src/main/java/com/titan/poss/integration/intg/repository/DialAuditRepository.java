/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.DialAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DialAuditRepository extends JpaRepository<DialAuditDao, String> {

	@Query("SELECT coalesce(max(dial.sequenceNo), 0) FROM DialAuditDao dial where dial.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);

	@Query("SELECT da FROM DialAuditDao da where da.transactionStatus = false AND da.refTxnId is NOT NULL ORDER BY da.createdDate ASC")
	public List<DialAuditDao> getAuditDetails();

	public List<DialAuditDao> findByVendorVendorCodeAndRefTxnIdAndTransactionStatusAndTransactionType(String vendorCode,
			String refTxnId, Boolean transactionStatus, String transactionType);

	public List<DialAuditDao> findByVendorVendorCodeAndRefTxnId(String vendorCode, String refTxnId);

}
