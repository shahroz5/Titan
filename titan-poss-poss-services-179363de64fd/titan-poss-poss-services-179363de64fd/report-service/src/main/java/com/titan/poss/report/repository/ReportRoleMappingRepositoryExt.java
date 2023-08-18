/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import com.titan.poss.report.dao.ReportMasterDao;
import com.titan.poss.report.dao.ReportRoleMappingDao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ReportRoleMappingRepositoryExt extends ReportRoleMappingRepository {

	/**
	 * @param
	 * @return
	 */
	List<ReportRoleMappingDao> findByReportMasterAndIdIn(ReportMasterDao reportMasterDao, Set<String> removeRoles);

	@Query(value = "delete from report_role_mapping  WHERE id IN (:roleIds)", nativeQuery = true)
	 void  deleteByIds(@Param("roleIds") StringBuilder roleIds);


	@Query(value = "select * from report_role_mapping rrm  WHERE rrm.role_code IN (:roleCode) AND rrm.report_master_id =:reportMasterId AND :currentHourAndMinute  BETWEEN rrm.from_access_time and rrm.to_access_time", nativeQuery = true)
	List<ReportRoleMappingDao> getReportRoleMapping(@Param("currentHourAndMinute") String currentHourAndMinute,
											  @Param("roleCode") List<String> roleCode, @Param("reportMasterId") String reportMasterId);

}
