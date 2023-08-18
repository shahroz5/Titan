/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.repository;

import com.titan.poss.report.dao.ReportSchedulerDao;
import com.titan.poss.report.dto.response.AutoReportDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("reportSchedulerRepositoryExt")
public interface ReportSchedulerRepositoryExt extends ReportSchedulerRepository{

    @Query("select rs from ReportSchedulerDao rs where rs.reportMaster.id =:id")
    public List<ReportSchedulerDao> getReportByReportId(@Param("id") String id);

    @Query("select rs from ReportSchedulerDao rs where rs.reportMaster.id =:id AND rs.cronExpression =:cron AND rs.frequency =:frequency")
    public ReportSchedulerDao findByCronAndReportId(@Param("id") String id,@Param("cron") String cron,@Param("frequency") String frequency);

    @Query(value = "select new com.titan.poss.report.dto.response.AutoReportDto(rs.id,rm.id,rm.reportDescription,rs.frequency,rs.cronExpression) "
    		+ "from ReportMasterDao rm left outer join  ReportSchedulerDao rs on rm.id = rs.reportMaster.id "
    		+ "WHERE rm.reportDescription like %:reportDescription%")
    public Page<List<AutoReportDto>> findAllByReportDescription(@Param("reportDescription") String reportDescription, Pageable pageable);
}

