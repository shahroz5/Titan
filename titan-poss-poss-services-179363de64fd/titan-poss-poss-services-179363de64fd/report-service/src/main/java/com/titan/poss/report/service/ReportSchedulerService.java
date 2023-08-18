/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.service;

import com.titan.poss.core.dto.SchedulerResponseDto;

import java.util.Date;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ReportSchedulerService {

    public SchedulerResponseDto reportJob();

    public void generateAutomaticReport(String reportId, Date fromDate, Date toDate) ;

    }
