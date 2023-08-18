/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.factory;

import com.titan.poss.report.query.IReport;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ReportRegistry {

	public IReport getServiceBean(String reportName);

}
