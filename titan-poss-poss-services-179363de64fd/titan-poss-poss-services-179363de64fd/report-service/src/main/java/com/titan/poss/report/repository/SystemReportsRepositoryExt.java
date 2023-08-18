/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.SystemReportsDao;
import com.titan.poss.report.dto.request.ReportSearchRequestDto;
import com.titan.poss.report.dto.response.ReportListsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface SystemReportsRepositoryExt extends SystemReportsRepository {

	@Query("SELECT sr FROM SystemReportsDao sr where sr.reportMaster.id =:reportId AND  sr.status ='COMPLETED' AND sr.scheduleTime BETWEEN :fromDate AND :toDate")
	SystemReportsDao findByScheduleTimeAndReportId(@Param("reportId") String reportId, @Param("fromDate") Date fromDate,
			@Param("toDate") Date toDate);

	@Query("select new com.titan.poss.report.dto.response.ReportListsDto(sr.id, rm.id, sr.status, rm.reportDescription, rm.reportType) "
			+ "from SystemReportsDao sr inner join ReportMasterDao rm on sr.reportMaster.id = rm.id "
			+ "inner join ReportRoleMappingDao rrm on rrm.reportMaster.id = rm.id "
			+ "where cast(sr.createdDate as date) BETWEEN  :#{#filter.fromDate} AND :#{#filter.toDate} "
			+ " AND (:#{#filter.status} IS NULL OR sr.status =:#{#filter.status}) "
			+ " AND (:#{#filter.reportDescription} IS NULL OR rm.reportDescription =:#{#filter.reportDescription}) "
			+ " AND (:#{#filter.reportGroup} IS NULL OR rm.reportGroup =:#{#filter.reportGroup}) "
			+ " AND (:userReportId IS NULL OR sr.id =:userReportId)" + " AND  rrm.roleCode in (:roleCodes)")
	Page<ReportListsDto> findSystemReports(@Param("filter") ReportSearchRequestDto filter,
			@Param("userReportId") Long userReportId, @Param("roleCodes") List<String> roleCodes, Pageable pageable);
}
