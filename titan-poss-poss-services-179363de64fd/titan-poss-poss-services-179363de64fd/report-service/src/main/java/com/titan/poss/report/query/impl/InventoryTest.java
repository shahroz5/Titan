/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.query.impl;

import org.springframework.stereotype.Component;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class InventoryTest extends IReport {

	public InventoryTest(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("INVENTORY_TEST", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return "Select report_name as ReportName, access_type as AccessType from reports.dbo.report_master";
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
