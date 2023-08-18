/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.report.dto.request.*;
import com.titan.poss.report.dto.response.*;
import org.springframework.data.domain.Pageable;

import javax.validation.Valid;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ReportMasterService {

	/**
	 * @param reportName
	 * @param reportType
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ReportMasterResponseDto>> listReports(String reportName, String reportType,String reportGroup, Pageable pageable,Boolean isPageble);

	/**
	 * @param id
	 * @return
	 */
	ReportMasterResponseDto getReports(String id);

	/**
	 * @param reportMasterRequestDto
	 * @return
	 */
	ReportMasterResponseDto createReport(ReportMasterRequestDto reportMasterRequestDto);

	/**
	 * @param id
	 * @param reportMasterRequestDto
	 * @return
	 */
	ReportMasterResponseDto updateReport(String id, ReportMasterRequestDto reportMasterRequestDto);

	/**
	 * @param id
	 * @param fieldName
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ReportFieldDto>> listReportFields(String id, String fieldName, Pageable pageable,Boolean isPageable);

	/**
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ReportFieldDto>> ListOptionalAndExcludedColumns(String reportId, Pageable pageable, Boolean isPageable);

	/**
	 * @param id
	 * @param fieldId
	 * @return
	 */
	ReportFieldDto getReportFields(String id, String fieldId);

	/**
	 * @param id
	 * @param reportFieldRequestDto
	 * @return
	 */
	ReportFieldDto createReportFields(String id, ReportFieldRequestDto reportFieldRequestDto);

	/**
	 * @param id
	 * @param fieldId
	 * @param reportFieldRequestDto
	 * @return
	 */
	ReportFieldDto updateReportFields(String id, String fieldId, ReportFieldRequestDto reportFieldRequestDto);

	/**
	 * @param id
	 * @param roleCode
	 * @param fieldName
	 * @return PagedRestResponse<List<ReportFieldsRoleMappingDto>>
	 */
	PagedRestResponse<List<ReportFieldsRoleMappingDto>> listReportFieldRoleMapping(String id, String roleCode,
			String fieldName, Pageable pageable, Boolean isPageable);

	/**
	 * @param roleCode
	 * @param reportDescription
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ReportRoleDto>> listReportRoleMapping(String roleCode, String reportDescription,
			Pageable pageable,Boolean isPageable);

	/**
	 * @param id
	 * @param addUpdateReportRoleDto
	 * @return
	 */
	ListResponse<ReportRoleDto> updateReportRoleMapping(String id, AddUpdateReportRoleDto addUpdateReportRoleDto);

	/**
	 * @param id
	 * @param updateReportFieldsRoleDto
	 * @return
	 */
	ListResponse<ReportFieldsRoleMappingDto> updateReportFieldRoleMapping(String id,
			UpdateReportFieldsRoleDto updateReportFieldsRoleDto);

	/**
	 * @param id
	 * @param queryName
	 * @param employeeCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<UserSearchQueriesDto>> listSavedQueries(String id, String queryName, String employeeCode,
			Pageable pageable);

	/**
	 * @param id
	 * @param queryId
	 * @return
	 */
	UserSearchQueriesDto getSavedQueries(String id, String queryId);

	/**
	 * @param id
	 * @param userSearchQueryRequestDto
	 * @return
	 */
	UserSearchQueriesDto createUserSavedQuries(String id, UserSearchQueryRequestDto userSearchQueryRequestDto);

	/**
	 * @param id
	 * @param queryId
	 * @param userSearchQueryRequestDto
	 * @return
	 */
	UserSearchQueriesDto updateUserSearchQuries(String id, String queryId,
			UserSearchQueryRequestDto userSearchQueryRequestDto);

	/**
	 * @param id
	 * @param templateName
	 * @param employeeCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<UserTemplatesDto>> listUserTemplates(String id, String templateName, String employeeCode,
			Pageable pageable);

	/**
	 * @param id
	 * @param templateId
	 * @return
	 */
	UserTemplatesDto getUserTemplates(String id, String templateId);

	/**
	 * @param id
	 * @param userTemplatesRequestDto
	 * @return
	 */
	UserTemplatesDto createUserTemplates(String id, UserTemplatesRequestDto userTemplatesRequestDto);

	/**
	 * @param id
	 * @param userTemplatesRequestDto
	 * @param templateId
	 * @return
	 */
	UserTemplatesDto updateUserTemplates(String id, @Valid UserTemplatesRequestDto userTemplatesRequestDto,
			String templateId);

	/**
	 * @param addUpdateAutoReportDto
	 * @return
	 */
	ListResponse<AutoReportDto> addUpdateAutoReports(AddUpdateAutoReportDto addUpdateAutoReportDto);

	/**
	 * @param reportDescription
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<AutoReportDto>> listScheduledReports(String reportDescription,
																 Pageable pageable,Boolean isPageable);
}
