/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.GiftCardAuditDao;

/**
 * Handles repository operations for <b>GiftCardAudit</b>.
 *
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository("IntegrationGiftCardAuditRepository")
public interface GiftCardAuditRepository extends JpaRepository<GiftCardAuditDao, String>{

	@Query("SELECT coalesce(max(gc.sequenceNo), 0) FROM GiftCardAuditDao gc where gc.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);
}
