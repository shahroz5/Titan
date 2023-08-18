/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query;

import com.titan.poss.report.dto.request.ReportRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
// all new reports should  extend
public abstract class IReport {

	public abstract String buildQuery(ReportRequestDto reportRequestDto);

	protected abstract StringBuilder appendQuery(ReportRequestDto reportRequestDto);

	protected abstract ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto);

}
