/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.ReportMasterDao;
import com.titan.poss.report.dao.UserReportsDao;
import com.titan.poss.report.dto.request.ReportSearchRequestDto;
import com.titan.poss.report.dto.response.ReportListsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface UserReportsRepositoryExt extends UserReportsRepository {

	// @Query("SELECT ur FROM UserReportsDao ur where ur.employeeCode =
	// :employeeCode AND ur.reportMaster.id =:reportId order by ur.requestTime
	// desc")
	UserReportsDao findFirstByEmployeeCodeAndReportMasterOrderByRequestTimeDesc(
			@Param("employeeCode") String employeeCode, @Param("reportMaster") ReportMasterDao reportMaster);

	@Query("SELECT ur FROM UserReportsDao ur where ur.employeeCode =:employeeCode  order by ur.requestTime desc")
	List<UserReportsDao> findAllByEmployeeCode(@Param("employeeCode") String employeeCode);

	@Query("SELECT new com.titan.poss.report.dto.response.ReportListsDto(ur.id, rm.id, ur.status, rm.reportDescription, rm.reportType)"
			+ " FROM UserReportsDao ur inner join ReportMasterDao rm on ur.reportMaster.id = rm.id "
			+ " where cast(ur.createdDate as date) BETWEEN  :#{#filter.fromDate} AND :#{#filter.toDate} "
			+ "AND (:#{#filter.status} IS NULL OR ur.status =:#{#filter.status}) "
			+ "AND (:#{#filter.reportDescription} IS NULL OR rm.reportDescription =:#{#filter.reportDescription}) "
			+ "AND (:#{#filter.reportGroup} IS NULL OR rm.reportGroup =:#{#filter.reportGroup}) "
			+ "AND (:referenceNumber IS NULL OR ur.id =:referenceNumber) " + "AND ur.employeeCode = :employeeCode")
	Page<ReportListsDto> getAllUserReports(@Param("filter") ReportSearchRequestDto filter,
			@Param("referenceNumber") Long referenceNumber, @Param("employeeCode") String employeeCode,
			Pageable pageable);

}
