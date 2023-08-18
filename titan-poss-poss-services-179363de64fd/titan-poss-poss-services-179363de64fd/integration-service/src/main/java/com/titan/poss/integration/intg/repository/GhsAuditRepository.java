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

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface GhsAuditRepository extends JpaRepository<GhsAuditDao, String>{

	@Query("SELECT coalesce(max(ghs.sequenceNo), 0) FROM GhsAuditDao ghs where ghs.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);

}
