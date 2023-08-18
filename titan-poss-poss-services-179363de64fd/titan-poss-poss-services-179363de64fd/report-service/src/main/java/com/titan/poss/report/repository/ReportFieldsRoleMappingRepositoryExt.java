/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.ReportFieldsRoleMappingDao;
import com.titan.poss.report.dao.ReportMasterDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ReportFieldsRoleMappingRepositoryExt extends ReportFieldsRoleMappingRepository {

	/**
	 * @param removeRoles
	 * @return
	 */
	List<ReportFieldsRoleMappingDao> findByReportMasterAndIdIn(ReportMasterDao reportMaster,
			Collection<String> removeRoles);

}
