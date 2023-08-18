/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.report.query.IReport;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ReportFactory {

	Map<String, IReport> reportQueries;

	public ReportFactory() {
		reportQueries = new HashMap<>();
	}

	public void registerReportQuery(String reportName, IReport ireportQuery) {
		reportQueries.put(reportName, ireportQuery);
	}

	public IReport getReportQuery(String reportName) {
		return reportQueries.get(reportName);
	}


}
