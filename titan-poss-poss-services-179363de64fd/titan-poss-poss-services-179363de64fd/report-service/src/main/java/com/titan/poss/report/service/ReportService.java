/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.ReportSearchRequestDto;
import com.titan.poss.report.dto.response.ReportResponseDto;
import com.titan.poss.report.dto.response.ReportListsDto;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ReportService {
	/**
	 *
	 * @param reportId
	 * @param reportRequestDto
	 * @return
	 */
	ReportResponseDto generateReport(String reportId, ReportRequestDto reportRequestDto);

	/**
	 *
	 * @param reportId
	 * @param reportRequestDto
	 * @return
	 */
	void autoGenerateReport(String reportId, ReportRequestDto reportRequestDto);

	/**
	 *
	 * @param userReportId
	 * @return
	 */
	ResponseEntity<Resource> downloadReport(String userReportId, String reportType);

	/**
	 *
	 * @param reportSearchRequestDto
	 * @return
	 */
	PagedRestResponse<List<ReportListsDto>> listUserReports(ReportSearchRequestDto reportSearchRequestDto,
			Pageable pageable, Boolean isPageable);
	
	PagedRestResponse<List<ReportListsDto>> listAutoReports(ReportSearchRequestDto reportSearchRequestDto,
			Pageable pageable, Boolean isPageable);

}
