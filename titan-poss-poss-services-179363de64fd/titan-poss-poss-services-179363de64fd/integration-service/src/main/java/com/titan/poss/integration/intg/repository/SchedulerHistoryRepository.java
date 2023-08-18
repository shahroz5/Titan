/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.SchedulerHistoryDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationSchedulerHistoryRepository")
public interface SchedulerHistoryRepository extends JpaRepository<SchedulerHistoryDao, String> {

	@Query("select s.code from SchedulerHistoryDao s inner join SchedulerMasterDao sm on s.code = sm.code where sm.isActive=:isActive and s.nextRunTime is not NULL and s.nextRunTime < :currentDate")
	List<String> getSchedulerCodesWhichDidNotRun(@Param("currentDate") Date currentDate,
			@Param("isActive") boolean isActive);

	List<SchedulerHistoryDao> findByCodeAndLocationCode(String code, String locationCode);
	
	SchedulerHistoryDao findByCode(String code);
}
