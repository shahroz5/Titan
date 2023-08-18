/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.service;

import com.titan.poss.report.dao.ReportFieldsDao;
import com.titan.poss.report.dao.ReportMasterDao;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ReportGenerator {

	/**
	 *
	 * @param reportFields
	 * @param reportMasterDao
	 * @param query
	 * @param outputPath
	 */
    public void generateReport(List<ReportFieldsDao> reportFields, ReportMasterDao reportMasterDao, String query,
                               String outputPath) ;

}
