/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.GhsAuditDao;
import com.titan.poss.integration.intg.dao.ServicePossAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ServicePossAuditRepository extends JpaRepository<ServicePossAuditDao, String>{

	@Query("SELECT coalesce(max(sp.sequenceNo), 0) FROM ServicePossAuditDao sp where sp.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);

}
