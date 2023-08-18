/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.controller;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ReportAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.ReportSearchRequestDto;
import com.titan.poss.report.dto.response.ReportResponseDto;
import com.titan.poss.report.dto.response.ReportListsDto;
import com.titan.poss.report.service.ReportSchedulerService;
import com.titan.poss.report.service.ReportService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "/report/v2")
public class ReportGenerationController {

	@Autowired
	private ReportService reportService;

	
	@Autowired
	private ReportSchedulerService reportSchedulerService;

	private static final String REPORT_GENERATION_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ReportAccessControls.REPORT_GENERATION_ADD_EDIT + PreAuthorizeDetails.END;

	/**
	 * This API generate report based on search parameter
	 *
	 * @param reportId
	 * @param reportRequestDto
	 * @return
	 */
	@ApiOperation(value = "Api to generate report", notes = "This API generate report based on search parameter.<br>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/GenerateReport.json\">"
			+ "GENERATE_REPORT</a>" + "</br></br>" + "</li>")
	@PostMapping(value = "generate-reports/{reportId}")
	@PreAuthorize(REPORT_GENERATION_ADD_EDIT_PERMISSION)
	public ReportResponseDto generateReport(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String reportId,
			@RequestBody @Valid @ApiParam(name = "body", value = "'reportRequest' object that needs to be updated", required = true) ReportRequestDto reportRequestDto) {
		return reportService.generateReport(reportId, reportRequestDto);
	}
	
	@GetMapping()
	public  void getautomated() {
		reportSchedulerService.reportJob();
		
	}

	/**
	 * This API for download report
	 *
	 * @param id
	 * @return
	 *
	 */
	@GetMapping(value = "download-reports/{id}")
	@PreAuthorize(REPORT_GENERATION_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "download report", notes = "To download report. 2 types are available: System and user ")
	public ResponseEntity<Resource> downloadReport(@PathVariable String id,
			@RequestParam(value = "reportType", required = false, defaultValue ="user") String reportType) {
		return reportService.downloadReport(id, reportType);
	}

	/**
	 * This API for list all the report requested by logged in user
	 *
	 * @param reportSearchRequestDto
	 * @return
	 */
	@ApiPageable
	@PostMapping(value = "list-reports/user")
	@PreAuthorize(REPORT_GENERATION_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "get all user generatedreports", notes = "This API for list all the report requested by logged in user.<br>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/ListAllReport.json\">"
			+ "LIST_ALL_REPORT</a>" + "</br></br>" + "</li>")
	public PagedRestResponse<List<ReportListsDto>> listUserReports(
			@RequestBody @Valid @ApiParam(name = "body", value = "'reportSearchRequestDto' object that needs to be updated", required = true) ReportSearchRequestDto reportSearchRequestDto,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportService.listUserReports(reportSearchRequestDto, pageable, isPageable);
	}

	/**
	 * This API for automatic report generation
	 *
	 */
	@GetMapping(value = "/auto-reports")
	public SchedulerResponseDto automaticReportGenerator() {
		return reportSchedulerService.reportJob();
	}
	
	/**
	 * This API for list all the auto generated report
	 *
	 * @param reportSearchRequestDto
	 * @return
	 */
	@ApiPageable
	@PostMapping(value = "list-reports/system")
	@PreAuthorize(REPORT_GENERATION_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "get all auto generated reports", notes = "This API for list all the auto generated reports.<br>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/ListAllReport.json\">"
			+ "LIST_ALL_REPORT</a>" + "</br></br>" + "</li>")
	public PagedRestResponse<List<ReportListsDto>> listAutoReports(
			@RequestBody @Valid @ApiParam(name = "body", value = "'reportSearchRequestDto' object that needs to be updated", required = true) ReportSearchRequestDto reportSearchRequestDto,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportService.listAutoReports(reportSearchRequestDto, pageable, isPageable);
	}

	
}
