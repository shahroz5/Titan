/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.PaymentAuditDao;

/**
 * Handles repository operations for <b>AclGroup</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository("IntegrationPaymentAuditRepository")
public interface PaymentAuditRepository extends JpaRepository<PaymentAuditDao, String> {

	@Query("SELECT coalesce(max(pa.sequenceNo), 0) FROM PaymentAuditDao pa where pa.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);
}
