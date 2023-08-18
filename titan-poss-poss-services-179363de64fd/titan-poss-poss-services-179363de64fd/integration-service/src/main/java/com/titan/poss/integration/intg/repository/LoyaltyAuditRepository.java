/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.LoyaltyAuditDao;

/**
 * Handles repository operations for <b>LoyaltyAudit</b>.
 *
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository("IntegrationLoyaltyAuditRepository")
public interface LoyaltyAuditRepository extends JpaRepository<LoyaltyAuditDao, String> {

	@Query("SELECT coalesce(max(la.sequenceNo), 0) FROM LoyaltyAuditDao la where la.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);
}
