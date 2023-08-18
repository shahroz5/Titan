/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.SchedulerMasterResponseDto;
import com.titan.poss.integration.intg.dao.SchedulerMasterDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationSchedulerMasterRepository")
public interface SchedulerMasterRepository extends JpaRepository<SchedulerMasterDao, String> {

	@Query("select sm from SchedulerMasterDao sm where sm.isActive =:isActive and sm.type =:type and sm.cronExpression is not null")
	List<SchedulerMasterDao> getAllValidSchedulers(@Param("type") String type, @Param("isActive") boolean isActive);

	SchedulerMasterDao findByCodeAndIsActive(String code, boolean isActive);

	@Query("SELECT new com.titan.poss.core.dto.SchedulerMasterResponseDto(sm.code, sm.description, sm.cronExpression, sh.lastRunTime, sh.nextRunTime, sh.status, sh.locationCode, sh.businessDate, sm.isActive)"
			+ " FROM SchedulerMasterDao sm left outer join SchedulerHistoryDao sh on sm.code = sh.code \r\n"
			+ " WHERE sm.type = :type AND (sh.locationCode =:locationCode OR  nullif(CHOOSE(1,:locationCode),'') IS NULL)"
			+ "AND (sh.businessDate =:businessDate OR  nullif(CHOOSE(1,:businessDate),'') IS NULL)"
			+ " AND (sm.code IN (:schedulerCodes) OR  nullif(CHOOSE(1,:schedulerCodes),'') IS NULL)")
	// @formatter:on
	Page<SchedulerMasterResponseDto> listPossSchedulerMaster(@Param("type") String type,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("schedulerCodes") List<String> schedulerCodes, Pageable pageable);
}
