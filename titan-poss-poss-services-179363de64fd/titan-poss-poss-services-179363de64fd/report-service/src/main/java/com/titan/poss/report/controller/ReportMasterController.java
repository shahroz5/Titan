/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.controller;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ReportAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.report.dto.request.*;
import com.titan.poss.report.dto.response.*;
import com.titan.poss.report.service.ReportMasterService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;

import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@Validated
@RequestMapping(value = "/report/v2/reports")
public class ReportMasterController {

	@Autowired
	ReportMasterService reportMasterService;
		private static final String REPORT_ADD_EDIT_VIEW_PERMISSION =  PreAuthorizeDetails.START
			+ ReportAccessControls.REPORT_MASTER_VIEW + PreAuthorizeDetails.END + OR + PreAuthorizeDetails.START
			+ ReportAccessControls.REPORT_GENERATION_ADD_EDIT + PreAuthorizeDetails.END;


	private static final String REPORT_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ReportAccessControls.REPORT_MASTER_VIEW + PreAuthorizeDetails.END;

	private static final String REPORT_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ReportAccessControls.REPORT_MASTER_ADD_EDIT + PreAuthorizeDetails.END;

	@ApiOperation(value = "Api to list all the reports", notes = "Api will list all the reports. Reports can be filtered based on reportName and reportType")
	@ApiPageable
	@GetMapping
	@PreAuthorize(REPORT_ADD_EDIT_VIEW_PERMISSION)
	public PagedRestResponse<List<ReportMasterResponseDto>> listReports(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.REPORT_NAME_REGEX) String reportName,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.REPORT_TYPE_REGEX) String reportType,
			@RequestParam(required = false)  String reportGroup,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listReports(reportName, reportType,reportGroup, pageable, isPageable);
	}

	@ApiOperation(value = "Api to get the report based on reportId", notes = "Api will return the report based on reportId")
	@GetMapping("/{id}")
	@PreAuthorize(REPORT_VIEW_PERMISSION)
	public ReportMasterResponseDto getReports(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		return reportMasterService.getReports(id);
	}

	@ApiOperation(value = "Api to create the report", notes = "Api will create the report")
	@PostMapping
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ReportMasterResponseDto createReport(
			@RequestBody @Valid @ApiParam(name = "body", value = "report master object that needs to be added", required = true) ReportMasterRequestDto reportMasterRequestDto) {
		return reportMasterService.createReport(reportMasterRequestDto);
	}

	@ApiOperation(value = "Api to update the report based on reportId", notes = "Api will update the report based on reportId")
	@PatchMapping("/{id}")
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ReportMasterResponseDto updateReport(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid @ApiParam(name = "body", value = "report master object that needs to be updated", required = true) ReportMasterRequestDto reportMasterRequestDto) {
		return reportMasterService.updateReport(id, reportMasterRequestDto);
	}

	@ApiOperation(value = "Api to list all the report fields", notes = "Api will list all the report fields. Report fields can be filtered based on fieldName")
	@GetMapping("/{id}/fields")
	@ApiPageable
	@PreAuthorize(REPORT_VIEW_PERMISSION)
	public PagedRestResponse<List<ReportFieldDto>> listReportFields(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.FIELD_NAME_REGEX) String fieldName,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listReportFields(id, fieldName, pageable, isPageable);
	}

	@ApiOperation(value = "Api to list optional report fields and not excluded fields ", notes = "Api will list optional  report fields and not excluded fields on basis of rolecode and reportId.")
	@GetMapping("/optional/{reportId}/fields")
	@ApiPageable
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public PagedRestResponse<List<ReportFieldDto>> listOptinalAndExcludedReportFields(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String reportId,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.ListOptionalAndExcludedColumns(reportId, pageable, isPageable);
	}

	@ApiOperation(value = "Api to get the report field based on field id", notes = "Api will return the report field based on field id")
	@GetMapping("/{id}/fields/{fieldId}")
	@PreAuthorize(REPORT_VIEW_PERMISSION)
	public ReportFieldDto getReportFields(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String fieldId) {
		return reportMasterService.getReportFields(id, fieldId);
	}

	@ApiOperation(value = "Api to create report fields", notes = "Api will return created report field")
	@PostMapping("/{id}/fields")
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ReportFieldDto createReportFields(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid @ApiParam(name = "body", value = "report field object that needs to be added", required = true) ReportFieldRequestDto reportFieldRequestDto) {
		return reportMasterService.createReportFields(id, reportFieldRequestDto);

	}

	@ApiOperation(value = "Api to update the report field based on field id", notes = "Api will return the updated report field based on given field id")
	@PatchMapping("/{id}/fields/{fieldId}")
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ReportFieldDto updateReportFields(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String fieldId,
			@RequestBody @Valid @ApiParam(name = "body", value = "report field object that needs to be updated", required = true) ReportFieldRequestDto reportFieldRequestDto) {
		return reportMasterService.updateReportFields(id, fieldId, reportFieldRequestDto);
	}

	@ApiOperation(value = "Api to get all the roles mapped with reportId and fieldId", notes = "Api will return all the roles based on given reportId")
	@GetMapping("/{id}/fields/roles")
	@PreAuthorize(REPORT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ReportFieldsRoleMappingDto>> listReportFieldRoleMapping(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String roleCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.FIELD_NAME_REGEX) String fieldName,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listReportFieldRoleMapping(id, roleCode, fieldName, pageable, isPageable);
	}

	@ApiOperation(value = "Api to update role based on fieldId", notes = "Api will return updated role mapped with reportId and fieldId")
	@PatchMapping("/{id}/fields/roles")
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ListResponse<ReportFieldsRoleMappingDto> updateReportFieldRoleMapping(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid @ApiParam(name = "body", value = "report field role object that needs to be added/removed", required = true) UpdateReportFieldsRoleDto updateReportFieldsRoleDto) {
		return reportMasterService.updateReportFieldRoleMapping(id, updateReportFieldsRoleDto);
	}

	@ApiOperation(value = "Api to get all the roles mapped with reportId", notes = "Api will return all the roles based on given reportId")
	@GetMapping("/roles")
	@PreAuthorize(REPORT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ReportRoleDto>> listReportRoleMapping(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String roleCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.REPORT_NAME_REGEX) String reportDescription,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listReportRoleMapping(roleCode, reportDescription, pageable, isPageable);
	}

	// @formatter:off
	@ApiOperation(value = "Api to update the roles mapped with roleCode", notes = "Api will return updated roles based on given roleCode.<br>"
			+ "Here **fromAccessTime** & **toAccessTime** request should follow the below pattern."
			+ "<ul>"
			+ "<li> 09:00 ----valid </li>"
			+ "<li> 09:30 ----valid </li>"
			+ "<li> 09:60 ----invalid </li>"
			+ "<li> 25:09 ----invalid </li>"
			+ "</ul>")
	// @formatter:on
	@PatchMapping("/{roleCode}/roles")
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ListResponse<ReportRoleDto> updateReportRoleMapping(
			@PathVariable  String roleCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "report role object that needs to be added/removed", required = true) AddUpdateReportRoleDto addUpdateReportRoleDto) {
		return reportMasterService.updateReportRoleMapping(roleCode, addUpdateReportRoleDto);
	}

	@ApiOperation(value = "Api to save and update report scheduler", notes = "Api will save and return auto report scheduler configuration")
	@PatchMapping("/scheduler")
	@PreAuthorize(REPORT_ADD_EDIT_PERMISSION)
	public ListResponse<AutoReportDto> addUpdateAutoReport(
						@RequestBody @Valid @ApiParam(name = "body", value = "scheduler report object that needs to be added/removed", required = true) AddUpdateAutoReportDto addUpdateAutoReportDto) {
		return reportMasterService.addUpdateAutoReports(addUpdateAutoReportDto);
	}

	@ApiOperation(value = "Api to get all scheduled reports", notes = "Api will return all scheduled reports")
	@GetMapping("/scheduler")
	@PreAuthorize(REPORT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<AutoReportDto>> listScheduledReports(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.REPORT_NAME_REGEX) String reportDescription,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listScheduledReports(reportDescription, pageable, isPageable);
	}

}
