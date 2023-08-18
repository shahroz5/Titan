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

import com.titan.poss.integration.intg.dao.EinvoiceAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface EinvoiceAuditRepository extends JpaRepository<EinvoiceAuditDao, String> {

	@Query("SELECT ea FROM EinvoiceAuditDao ea where ea.locationCode = :locationCode AND ea.transactionStatus = false AND ea.invoiceTransactionId is NOT NULL AND ea.invoiceTransactionStatus is NOT NULL ORDER BY ea.createdDate ASC")
	List<EinvoiceAuditDao> getAuditDetails(@Param("locationCode") String locationCode);

}
