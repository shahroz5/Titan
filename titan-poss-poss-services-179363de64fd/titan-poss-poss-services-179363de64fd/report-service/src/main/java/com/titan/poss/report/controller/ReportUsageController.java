/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.report.dto.request.UserSearchQueryRequestDto;
import com.titan.poss.report.dto.request.UserTemplatesRequestDto;
import com.titan.poss.report.dto.response.UserSearchQueriesDto;
import com.titan.poss.report.dto.response.UserTemplatesDto;
import com.titan.poss.report.service.ReportMasterService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@Validated
@RequestMapping(value = "/report/v2/reports")
public class ReportUsageController {

	@Autowired
	ReportMasterService reportMasterService;

	@ApiOperation(value = "Api to get all saved queries mapped with reportId", notes = "Api will return all saved queries based on given reportId")
	@GetMapping("/{id}/saved-queries")
	public PagedRestResponse<List<UserSearchQueriesDto>> listSavedQueries(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.QUERY_NAME_REGEX) String queryName,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String employeeCode,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listSavedQueries(id, queryName, employeeCode, pageable);
	}

	@ApiOperation(value = "Api to get saved queries mapped with reportId", notes = "Api will return saved queries based on given reportId and queryId")
	@GetMapping("/{id}/saved-queries/{queryId}")
	public UserSearchQueriesDto getSavedQueries(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String queryId) {
		return reportMasterService.getSavedQueries(id, queryId);
	}

	// @formatter:off
	@ApiOperation(value = "Api to create saved queries", notes = "Api will return saved query.<br>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/ReportQuery.json\">"
			+ "REPORT_QUERY </a>"
			+ "</br></br>"
			+ "</li>")
	// @formatter:on
	@PostMapping("/{id}/saved-queries")
	public UserSearchQueriesDto createUserSavedQuries(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid @ApiParam(name = "body", value = "saved query object that needs to be added", required = true) UserSearchQueryRequestDto userSearchQueryRequestDto) {
		return reportMasterService.createUserSavedQuries(id, userSearchQueryRequestDto);
	}

	// @formatter:off
	@ApiOperation(value = "Api to update saved queries", notes = "Api will return updated saved query"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/ReportQuery.json\">"
			+ "REPORT_QUERY </a>"
			+ "</br></br>"
			+ "</li>")
	// @formatter:on
	@PatchMapping("/{id}/saved-queries/{queryId}")
	public UserSearchQueriesDto updateUserSearchQuries(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String queryId,
			@RequestBody @Valid @ApiParam(name = "body", value = "saved query object that needs to be updated", required = true) UserSearchQueryRequestDto userSearchQueryRequestDto) {
		return reportMasterService.updateUserSearchQuries(id, queryId, userSearchQueryRequestDto);
	}

	@ApiOperation(value = "Api to get all user templates mapped with reportId", notes = "Api will return all user templates based on given reportId")
	@ApiPageable
	@GetMapping("/{id}/templates")
	public PagedRestResponse<List<UserTemplatesDto>> listUserTemplates(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.TEMPLATE_NAME_REGEX) String templateName,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String employeeCode,
			@ApiIgnore Pageable pageable) {
		return reportMasterService.listUserTemplates(id, templateName, employeeCode, pageable);
	}

	@ApiOperation(value = "Api to get user templates mapped with reportId and templateId", notes = "Api will return user templates based on given reportId and templateId")
	@GetMapping("/{id}/templates/{templateId}")
	public UserTemplatesDto getUserTemplates(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String templateId) {
		return reportMasterService.getUserTemplates(id, templateId);

	}

	// @formatter:off
	@ApiOperation(value = "Api to create user template", notes = "Api will return created user templates"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/ReportTemplate.json\">"
			+ "REPORT_TEMPLATE </a>"
			+ "</br></br>"
			+ "</li>")
	// @formatter:on
	@PostMapping("/{id}/templates")
	public UserTemplatesDto createUserTemplates(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid @ApiParam(name = "body", value = "user template object that needs to be added", required = true) UserTemplatesRequestDto userTemplatesRequestDto) {
		return reportMasterService.createUserTemplates(id, userTemplatesRequestDto);
	}

	// @formatter:off
	@ApiOperation(value = "Api to update user templates mapped with given reportId and templateId", notes = "Api will return updated user templates."
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/report-service/src/main/resources/com/titan/poss/report/json/ReportTemplate.json\">"
			+ "REPORT_TEMPLATE </a>"
			+ "</br></br>"
			+ "</li>")
	// @formatter:on
	@PatchMapping("/{id}/templates/{templateId}")
	public UserTemplatesDto updateUserTemplates(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String templateId,
			@RequestBody @Valid @ApiParam(name = "body", value = "user template object that needs to be updated", required = true) UserTemplatesRequestDto userTemplatesRequestDto) {
		return reportMasterService.updateUserTemplates(id, userTemplatesRequestDto, templateId);
	}

}
