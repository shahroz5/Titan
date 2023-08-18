/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.service.impl;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dao.ReportMasterDao;
import com.titan.poss.report.dao.ReportRoleMappingDao;
import com.titan.poss.report.dao.SystemReportsDao;
import com.titan.poss.report.dao.UserReportsDao;
import com.titan.poss.report.dto.constants.ReportNameEnum;
import com.titan.poss.report.dto.constants.ReportStatusEnum;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.ReportSearchRequestDto;
import com.titan.poss.report.dto.request.json.SalesReportCustomRequestDto;
import com.titan.poss.report.dto.request.json.SalesReportRequestDto;
import com.titan.poss.report.dto.response.ReportListsDto;
import com.titan.poss.report.dto.response.ReportResponseDto;
import com.titan.poss.report.repository.ReportMasterRepositoryExt;
import com.titan.poss.report.repository.ReportRoleMappingRepositoryExt;
import com.titan.poss.report.repository.SystemReportsRepositoryExt;
import com.titan.poss.report.repository.UserReportsRepositoryExt;
import com.titan.poss.report.service.ReportService;

import lombok.extern.slf4j.Slf4j;

/**
 * L
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
@Slf4j
public class ReportServiceImpl implements ReportService {

	@Autowired
	private Environment env;

	@Autowired
	private ReportMasterRepositoryExt reportMasterRepositoryExt;

	@Autowired
	private ReportRoleMappingRepositoryExt reportRoleMappingRepositoryExt;

	@Autowired
	private ReportServiceAsyncImpl reportServiceAsyncImpl;

	@Autowired
	private UserReportsRepositoryExt userReportsRepositoryExt;

	@Autowired
	private SystemReportsRepositoryExt systemReportsRepositoryExt;

	@Autowired
	private EngineServiceClient engineServiceClient;
	
	private static final String INVALID_REPORT_ID = "No report found for the requested report id";
	private static final String ERR_REPORT_001 = "ERR-REPORT-001";
	private static final String REPORT_OUTPUT_DIR_PATH = "report.output.dir.path";
	private static final String SEPARATOR = "/";

	/**
	 * Generate report
	 */
	@Override
	public ReportResponseDto generateReport(String reportId, ReportRequestDto reportRequestDto) {
		AuthUser securityPrincipal = CustomSecurityPrincipal.getSecurityPrincipal();
		//List<String> roleCodes = engineServiceClient.getRoleList().getResults();
		List<String> roleCodes=Arrays.asList("commercial");
		ReportResponseDto reportResponseDto = new ReportResponseDto();
		ReportMasterDao reportMasterDao = reportMasterRepositoryExt.findById(reportId)
				.orElseThrow(() -> new ServiceException(INVALID_REPORT_ID + " : " + reportId, ERR_REPORT_001));
		if (!reportMasterDao.getReportName().equalsIgnoreCase(ReportNameEnum.SALES_REPORT.name())) {
			if (reportRequestDto.getFromDate() == null) {
				throw new ServiceException("From date cannot be null", "ERR-CORE-023");
			}
			if (reportRequestDto.getToDate() == null) {
				throw new ServiceException("To date cannot be null", "ERR-CORE-023");
			}
			validateNoOfDays(reportRequestDto, reportMasterDao);
		} else {
			if (reportRequestDto.getFromDate() != null && reportRequestDto.getToDate() != null) {
				validateNoOfDays(reportRequestDto, reportMasterDao);
			}
			checkMandatorySearchParametersForSalesReport(reportRequestDto);
		}
		validateUserAccess(reportMasterDao);

		UserReportsDao userReportDao = insertUserReport(reportMasterDao, reportRequestDto);
		String outputPath = getFilePath(userReportDao.getId(), reportMasterDao.getFormatType());
		reportRequestDto.setReportId(userReportDao.getId().toString());
		reportRequestDto.setAuthorizationHeader(getBearerToken(CommonConstants.AUTH_HEADER));
		reportRequestDto.setAuthorizationCookie(getBearerToken(CommonConstants.COOKIE_HEADER));
		reportServiceAsyncImpl.reportGeneration(userReportDao, reportRequestDto, reportMasterDao, outputPath,
				securityPrincipal, roleCodes);
		reportResponseDto.setReportReferenceId("REP-" + userReportDao.getId().toString());
		return reportResponseDto;

	}

	/**
	 * Auto generate report
	 */
	@Override
	public void autoGenerateReport(String reportId, ReportRequestDto reportRequestDto) {
		ReportMasterDao reportMasterDao = reportMasterRepositoryExt.findById(reportId)
				.orElseThrow(() -> new ServiceException(INVALID_REPORT_ID + " : " + reportId, ERR_REPORT_001));
		SystemReportsDao systemReportsDao = insertSystemReport(reportMasterDao, reportRequestDto);
		String outputPath = getFilePathForSystem(systemReportsDao.getId(), reportMasterDao.getFormatType());
		log.info("automated file path : "+ outputPath);
		reportServiceAsyncImpl.autoReportGeneration(systemReportsDao, reportRequestDto, reportMasterDao, outputPath);
	}

	/**
	 * Download report
	 * 
	 * @param reportId
	 * @return
	 */
	@Override
	public ResponseEntity<Resource> downloadReport(String reportId, String reportType) {
		String[] reportIdSplit = reportId.split("-");
		Long id = Long.valueOf(reportIdSplit[1]);
		String reportStatus = "";
		String filePath = "";
		if (reportType.equalsIgnoreCase("user")) {
			UserReportsDao userReportsDao = userReportsRepositoryExt.findById(id)
					.orElseThrow(() -> new ServiceException(INVALID_REPORT_ID + reportId, ERR_REPORT_001));
			reportStatus = userReportsDao.getStatus();
			filePath = userReportsDao.getFilePath();
		} else {
			SystemReportsDao systemReport = systemReportsRepositoryExt.findById(id)
					.orElseThrow(() -> new ServiceException(INVALID_REPORT_ID + reportId, ERR_REPORT_001));
			reportStatus = systemReport.getStatus();
			filePath = systemReport.getFilePath();
		}
		if (ReportStatusEnum.IN_PROGRESS.toString().equals(reportStatus)) {
			throw new ServiceException("Report is in progress", "ERR-REPORT-010");
		}
		Resource resource = new FileSystemResource(filePath);
		if (!resource.exists() && (ReportStatusEnum.FAILED.toString().equals(reportStatus)
				|| StringUtils.isEmpty(reportStatus))) {
			throw new ServiceException("Problem in report generation", "ERR-REPORT-012");
		}

		HttpHeaders header = new HttpHeaders();
		header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Expires", "0");

		return ResponseEntity.ok().headers(header).contentType(MediaType.parseMediaType("application/octet-stream"))
				.body(resource);
	}

	/**
	 * List all reports
	 * 
	 * @param reportSearchRequestDto
	 * @return
	 */
	@Override
	public PagedRestResponse<List<ReportListsDto>> listUserReports(ReportSearchRequestDto reportSearchRequestDto,
			Pageable pageable, Boolean isPageable) {
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		Long userReportId = null;
		if (reportSearchRequestDto.getReferenceNumber() != null) {
			String[] reportIdSplit = reportSearchRequestDto.getReferenceNumber().split("-");
			userReportId = Long.valueOf(reportIdSplit[1]);
		}
		Page<ReportListsDto> userReports = userReportsRepositoryExt.getAllUserReports(reportSearchRequestDto,
				userReportId, CommonUtil.getEmployeeCode(), pageable);
		return new PagedRestResponse<>(userReports.getContent(), userReports);
	}

	/**
	 * Validate user
	 * 
	 * @param reportMasterDao
	 */
	private void validateUserAccess(ReportMasterDao reportMasterDao) {
		String employeeCode = CustomSecurityPrincipal.getSecurityPrincipal().getEmployeeCode();
		Calendar calendar = Calendar.getInstance();
		int hour = calendar.get(Calendar.HOUR_OF_DAY);
		int minutes = calendar.get(Calendar.MINUTE);
		String currentHourAndMinute = hour < 10 ? "0" + hour + ":" + minutes : hour + ":" + minutes;
		//List<String> roleCode = engineServiceClient.getRoleList().getResults();
				List<String> roleCode=Arrays.asList("commercial");
		List<ReportRoleMappingDao> reportRoleMappingDao = reportRoleMappingRepositoryExt
				.getReportRoleMapping(currentHourAndMinute, roleCode, reportMasterDao.getId());
		if (CollectionUtils.isEmpty(reportRoleMappingDao)) {
			throw new ServiceException("Please complete the manual report configuration,", "ERR-REPORT-006");
		}
		UserReportsDao userReportDao = userReportsRepositoryExt
				.findFirstByEmployeeCodeAndReportMasterOrderByRequestTimeDesc(employeeCode, reportMasterDao);
		if (userReportDao != null) {

			Long timeDifference = CalendarUtils.getCurrentDate().getTime() - userReportDao.getRequestTime().getTime();
			Long timeDifferenceInMinute = TimeUnit.MILLISECONDS.toMinutes(timeDifference);
			Long waitingTimeInMinutes = reportMasterDao.getRegenerationTime() - timeDifferenceInMinute;
			if (timeDifferenceInMinute.intValue() < reportMasterDao.getRegenerationTime()) {
				throw new ServiceException(
						"Please wait for " + waitingTimeInMinutes + " minutes to generate the next report",
						"ERR-REPORT-007");
			}
		}
	}

	/**
	 * Build file path for saving report
	 * 
	 * @param fileId
	 * @param formatType
	 * @return
	 */
	private String getFilePath(Long fileId, String formatType) {
		String basePath = env.getProperty(REPORT_OUTPUT_DIR_PATH);
		String fullFilePath = null;
		SimpleDateFormat dtf = new SimpleDateFormat("yyyy-MM-dd");
		Date currentDate = CalendarUtils.getCurrentDate();
		File basePathDirectory = new File(basePath);
		if (!basePathDirectory.exists()) {
			basePathDirectory.mkdir();
		}
		String filePath = basePath + dtf.format(currentDate);
		File directory = new File(filePath);
		if (!directory.exists()) {
			directory.mkdir();
		}
		filePath = filePath + SEPARATOR + "REP-" + fileId;
		switch (formatType) {
		case "CSV":
			fullFilePath = getFullFilePath(filePath, "." + FileExtensionEnum.CSV.getValue());
			break;
		case "PDF":
			fullFilePath = getFullFilePath(filePath, "." + FileExtensionEnum.PDF.getValue());
			break;
		case "EXCEl":
		default:
			fullFilePath = getFullFilePath(filePath, "." + FileExtensionEnum.EXCEL.getValue());
			break;
		}
		return fullFilePath;
	}

	private String getFilePathForSystem(Long fileId, String formatType) {
		String basePath = env.getProperty(REPORT_OUTPUT_DIR_PATH);
		String fullFilePath = null;
		SimpleDateFormat dtf = new SimpleDateFormat("yyyy-MM-dd");
		Date currentDate = CalendarUtils.getCurrentDate();
		File basePathDirectory = new File(basePath);
		if (!basePathDirectory.exists()) {
			basePathDirectory.mkdir();
		}
		String filePath = basePath + dtf.format(currentDate);
		File directory = new File(filePath);
		if (!directory.exists()) {
			directory.mkdir();
		}
		filePath = filePath + SEPARATOR + "REPS-" + fileId;
		switch (formatType) {
		case "CSV":
			fullFilePath = getFullFilePath(filePath, "." + FileExtensionEnum.CSV.getValue());
			break;
		case "PDF":
			fullFilePath = getFullFilePath(filePath, "." + FileExtensionEnum.PDF.getValue());
			break;
		case "EXCEl":
		default:
			fullFilePath = getFullFilePath(filePath, "." + FileExtensionEnum.EXCEL.getValue());
			break;
		}
		return fullFilePath;
	}

	private String getFullFilePath(String filePath, String fileExtension) {
		return filePath + fileExtension;
	}

	/**
	 * Insert record into User_Reports table
	 * 
	 * @param reportMasterDao
	 * @return
	 */
	private UserReportsDao insertUserReport(ReportMasterDao reportMasterDao, ReportRequestDto reportRequestDto) {
		ObjectMapper mapper = new ObjectMapper();
		UserReportsDao userReportsDao = new UserReportsDao();
		try {
			String reportRequestData = mapper.writeValueAsString(reportRequestDto);
			userReportsDao.setRequestTime(CalendarUtils.getCurrentDate());
			userReportsDao.setEmployeeCode(CustomSecurityPrincipal.getSecurityPrincipal().getEmployeeCode());
			userReportsDao.setReportMaster(reportMasterDao);
			userReportsDao.setStatus(ReportStatusEnum.IN_PROGRESS.toString());
			userReportsDao.setSearchFilter(reportRequestData);
		} catch (Exception e) {
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003");
		}
		return userReportsRepositoryExt.save(userReportsDao);

	}

	/**
	 * Insert record into User_Reports table
	 * 
	 * @param reportMasterDao
	 * @return
	 */
	private SystemReportsDao insertSystemReport(ReportMasterDao reportMasterDao, ReportRequestDto reportRequestDto) {
		SystemReportsDao systemReportsDao = new SystemReportsDao();
		try {
			systemReportsDao.setScheduleTime(CalendarUtils.getCurrentDate());
			systemReportsDao.setCreatedDate(CalendarUtils.getCurrentDate());
			systemReportsDao.setReportMaster(reportMasterDao);
			systemReportsDao.setStatus(ReportStatusEnum.IN_PROGRESS.toString());
			systemReportsDao.setSearchFromDate(reportRequestDto.getFromDate());
			systemReportsDao.setSearchToDate(reportRequestDto.getToDate());
			log.info("Auto report in-progress status save : "+ systemReportsDao.toString() );
			
		} catch (Exception e) {
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003");
		}
		return systemReportsRepositoryExt.save(systemReportsDao);

	}

	private String getBearerToken(String headerName) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		HttpServletRequest request = null;
		if (authentication != null) {
			request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		}
		if (request != null) {
			return request.getHeader(headerName);
		} else {
			return null;
		}
	}

	private void validateNoOfDays(ReportRequestDto reportRequestDto, ReportMasterDao reportMasterDao) {
		long differenceInTime = Math
				.abs(reportRequestDto.getFromDate().getTime() - reportRequestDto.getToDate().getTime());
		long differenceInDays = TimeUnit.DAYS.convert(differenceInTime, TimeUnit.MILLISECONDS);

		if (differenceInDays > reportMasterDao.getMaxNoOfDays()) {
			throw new ServiceException("Selected date range should be less than or equal to  "
					+ reportMasterDao.getMaxNoOfDays() + " days ", "ERR-REPORT-013");
		}
	}

	private void checkMandatorySearchParametersForSalesReport(ReportRequestDto reportRequestDto) {
		SalesReportRequestDto salesReportRequestDto = (SalesReportRequestDto) setCustomInput(reportRequestDto);
		if ((salesReportRequestDto.getFromDate() == null || salesReportRequestDto.getToDate() == null)
				&& (!(!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getFiscalYear())
						&& (!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getDocNo())
								|| !CollectionUtil
										.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getRsoName())
								|| !StringUtils.isEmpty(
										salesReportRequestDto.getSalesReportCustomRequestDto().getCustomerMobileNo())
								|| !StringUtils
										.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getUlpNo())
								|| !StringUtils.isEmpty(
										salesReportRequestDto.getSalesReportCustomRequestDto().getCustomerName()))))) {
			throw new ServiceException("Invalid search parameters for SALES report. Please select mandatory fields",
					"ERR-REPORT-017");

		}
	}

	private ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		SalesReportRequestDto salesReportRequestDto = (SalesReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				SalesReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			SalesReportCustomRequestDto salesReportCustomRequestDto = new SalesReportCustomRequestDto();
			salesReportCustomRequestDto.validate(reportRequestDto.getCustomFields());
			salesReportCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), SalesReportCustomRequestDto.class);
			salesReportRequestDto.setSalesReportCustomRequestDto(salesReportCustomRequestDto);
		}
		return salesReportRequestDto;
	}

	/**
	 * List all reports
	 * 
	 * @param reportSearchRequestDto
	 * @return
	 */
	@Override
	public PagedRestResponse<List<ReportListsDto>> listAutoReports(ReportSearchRequestDto reportSearchRequestDto,
			Pageable pageable, Boolean isPageable) {
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		Long userReportId = null;
		if (reportSearchRequestDto.getReferenceNumber() != null) {
			String[] reportIdSplit = reportSearchRequestDto.getReferenceNumber().split("-");
			userReportId = Long.valueOf(reportIdSplit[1]);
		}
		//List<String> roleCodes = engineServiceClient.getRoleList().getResults();
				List<String> roleCodes=Arrays.asList("commercial");
		Page<ReportListsDto> systemReports = systemReportsRepositoryExt.findSystemReports(reportSearchRequestDto,
				userReportId, roleCodes, pageable);
		return new PagedRestResponse<>(systemReports.getContent(), systemReports);
	}

}
