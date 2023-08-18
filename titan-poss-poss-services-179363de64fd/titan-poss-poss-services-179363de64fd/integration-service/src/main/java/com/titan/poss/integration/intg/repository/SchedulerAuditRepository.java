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
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.dto.SchedulerAuditResponseDto;
import com.titan.poss.integration.intg.dao.SchedulerAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationSchedulerAuditRepository")
public interface SchedulerAuditRepository extends JpaRepository<SchedulerAuditDao, String> {

	List<SchedulerAuditDao> findBySchedulerMasterCodeAndStatusAndStartTimeAfter(String code, String status,
			Date startTime);

	// querying only 7 days of audit data
	@Query("SELECT new com.titan.poss.integration.dto.SchedulerAuditResponseDto(sa.schedulerMaster.code, sa.schedulerRunTime, sa.status, sa.startTime, sa.endTime, sa.totalTime, sa.manualJob, sa.exception)"
			+ " FROM SchedulerAuditDao sa inner join SchedulerMasterDao sm  on sa.schedulerMaster.code = sm.code where sm.type = :type"
			+ " AND (sa.locationCode =:locationCode OR  nullif(CHOOSE(1,:locationCode),'') IS NULL)"
			+ " AND (sa.schedulerMaster.code =:schedulerCode OR  nullif(CHOOSE(1,:schedulerCode),'') IS NULL)"
			+ " AND sa.startTime >= :startDate AND sa.startTime <= :endDate")
	Page<SchedulerAuditResponseDto> listSchedulerAuditData(@Param("type") String type,
			@Param("locationCode") String locationCode, @Param("schedulerCode") String schedulerCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageable);

	@Modifying
	@Query("DELETE SchedulerAuditDao sa WHERE sa.endTime <= :endTime")
	void deleteSchedulerAudit(@Param("endTime") Date endTime);

}
