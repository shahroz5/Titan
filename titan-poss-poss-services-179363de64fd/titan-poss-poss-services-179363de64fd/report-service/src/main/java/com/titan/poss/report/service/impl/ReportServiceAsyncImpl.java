package com.titan.poss.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.report.dao.ReportFieldsDao;
import com.titan.poss.report.dao.ReportMasterDao;
import com.titan.poss.report.dao.SystemReportsDao;
import com.titan.poss.report.dao.UserReportsDao;
import com.titan.poss.report.dao.UserTemplatesDao;
import com.titan.poss.report.dto.constants.ReportStatusEnum;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import com.titan.poss.report.repository.ReportFieldsRepositoryExt;
import com.titan.poss.report.repository.SystemReportsRepositoryExt;
import com.titan.poss.report.repository.UserReportsRepositoryExt;
import com.titan.poss.report.repository.UserTemplatesRepositoryExt;
import com.titan.poss.report.service.ReportDecryptService;
import com.titan.poss.report.service.ReportGenerator;
import com.titan.poss.report.service.ReportNotificationService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ReportServiceAsyncImpl {

	@Autowired
	private ReportFieldsRepositoryExt reportFieldsRepositoryExt;

	@Autowired
	private ReportFactory reportFactory;

	@Autowired
	private ReportGenerator reportGenerator;

	@Autowired
	private ReportNotificationService reportNotificationService;

	@Autowired
	private UserReportsRepositoryExt userReportsRepositoryExt;

	@Autowired
	private SystemReportsRepositoryExt systemReportsRepositoryExt;

	@Autowired
	private ReportDecryptService reportDecryptService;

	@Autowired
	private UserTemplatesRepositoryExt userTemplatesRepositoryExt;

	/**
	 * Async call to generate report
	 * 
	 * @param userReportDao
	 * @param reportRequestDto
	 * @param reportMasterDao
	 * @param outputPath
	 */
	@Async
	public void reportGeneration(UserReportsDao userReportDao, ReportRequestDto reportRequestDto,
			ReportMasterDao reportMasterDao, String outputPath, AuthUser securityPrincipal, List<String> roleCodes) {
		try {
			List<ReportFieldsDao> reportFields = reportFieldsRepositoryExt.findReportFields(reportMasterDao.getId(),
					roleCodes);
			List<ReportFieldsDao> finalReportFields = checkIfColumnIsExcluded(reportFields, reportMasterDao,
					securityPrincipal.getEmployeeCode());
			if (CollectionUtils.isEmpty((finalReportFields))) {
				throw new ServiceException(
						"No report field found for the requested report id : " + reportMasterDao.getId(),
						"ERR-REPORT-008");
			}
			IReport iReport = reportFactory.getReportQuery(reportMasterDao.getReportName());
			String query = iReport.buildQuery(reportRequestDto);

			reportGenerator.generateReport(finalReportFields, reportMasterDao, query, outputPath);
			userReportDao.setStatus(ReportStatusEnum.COMPLETED.toString());
			updateUserReport(userReportDao, outputPath);

		} catch (Exception exe) {
			log.info("report generation error", exe);
			userReportDao.setErrorMessage(exe.getMessage());
			userReportDao.setStatus(ReportStatusEnum.FAILED.toString());
			updateUserReport(userReportDao, outputPath);

		}
		// deleting temp data
		reportDecryptService.deleteCustomerTemp(reportRequestDto.getReportId());
		Resource resource = new FileSystemResource(outputPath);
		if (resource.exists()) {
			try {
				reportNotificationService.sendReportNotification("REP-" + userReportDao.getId(),
						reportMasterDao.getReportName(), securityPrincipal);
			} catch (Exception e) {
				log.info(" send notification error", e);
			}
		}

	}

	/**
	 * Async call to generate report
	 * 
	 * @param systemReportsDao
	 * @param reportRequestDto
	 * @param reportMasterDao
	 * @param outputPath
	 */
	@Async
	public void autoReportGeneration(SystemReportsDao systemReportsDao, ReportRequestDto reportRequestDto,
			ReportMasterDao reportMasterDao, String outputPath) {
		try {
			List<ReportFieldsDao> reportFields = reportFieldsRepositoryExt.findByReportMaster(reportMasterDao);
			if (CollectionUtils.isEmpty((reportFields))) {
				throw new ServiceException(
						"No report field found for the requested report id : " + reportMasterDao.getId(),
						"ERR-REPORT-008");
			}
			IReport iReport = reportFactory.getReportQuery(reportMasterDao.getReportName());
			String query = iReport.buildQuery(reportRequestDto);
			reportGenerator.generateReport(reportFields, reportMasterDao, query, outputPath);
			log.info("automated report generate step completed. output path  : "+outputPath);
			systemReportsDao.setStatus(ReportStatusEnum.COMPLETED.toString());
			updateSystemReport(systemReportsDao, outputPath);

		} catch (Exception exe) {
			log.info("report generation error", exe);
			systemReportsDao.setErrorMessage(exe.getMessage());
			systemReportsDao.setStatus(ReportStatusEnum.FAILED.toString());
			updateSystemReport(systemReportsDao, outputPath);

		}

	}

	/**
	 * Update record into User_Reports table
	 * 
	 * @param userReportsDao
	 * @param fileOutputPath
	 * @return
	 */
	private UserReportsDao updateUserReport(UserReportsDao userReportsDao, String fileOutputPath) {
		long totalTime = CalendarUtils.getCurrentDate().getTime() - userReportsDao.getRequestTime().getTime();
		userReportsDao.setCompletionTime(CalendarUtils.getCurrentDate());
		userReportsDao.setFilePath(fileOutputPath);
		userReportsDao.setTotalTime(totalTime);
		return userReportsRepositoryExt.save(userReportsDao);
	}

	/**
	 * Update record into User_Reports table
	 * 
	 * @param systemReportsDao
	 * @param fileOutputPath
	 * @return
	 */
	private SystemReportsDao updateSystemReport(SystemReportsDao systemReportsDao, String fileOutputPath) {
		long totalTime = CalendarUtils.getCurrentDate().getTime() - systemReportsDao.getScheduleTime().getTime();
		systemReportsDao.setCompletionTime(CalendarUtils.getCurrentDate());
		systemReportsDao.setFilePath(fileOutputPath);
		systemReportsDao.setTotalTime(totalTime);
		systemReportsDao.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return systemReportsRepositoryExt.save(systemReportsDao);
	}

	private List<ReportFieldsDao> checkIfColumnIsExcluded(List<ReportFieldsDao> reportFields,
			ReportMasterDao reportMasterDao, String employeeCode) {
		UserTemplatesDao userTemplatesDao = getUserTemplatesDao(reportMasterDao, employeeCode);
		if (userTemplatesDao != null) {
			List<String> excludedFields = getExcludedFields(userTemplatesDao);
			if (!CollectionUtils.isEmpty(excludedFields)) {
				List<ReportFieldsDao> finalReportFields = new ArrayList<>();
				for (ReportFieldsDao reportField : reportFields) {
					if (!excludedFields.contains(reportField.getId())) {
						finalReportFields.add(reportField);
					}
				}
				return finalReportFields;
			}
		}
		return reportFields;

	}

	private UserTemplatesDao getUserTemplatesDao(ReportMasterDao reportMasterDao, String employeeCode) {
		UserTemplatesDao userTemplatesDao = new UserTemplatesDao();
		userTemplatesDao.setEmployeeCode(employeeCode);
		userTemplatesDao.setReportMaster(reportMasterDao);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<UserTemplatesDao> criteria = Example.of(userTemplatesDao, matcher);
		List<UserTemplatesDao> userTemplatesDaoList = userTemplatesRepositoryExt.findAll(criteria);
		if (!CollectionUtils.isEmpty(userTemplatesDaoList)) {
			return userTemplatesDaoList.get(0);
		}
		return null;
	}

	private List<String> getExcludedFields(UserTemplatesDao userTemplatesDao) {
		try {
			JsonObject jsonbject = new JsonParser().parse(userTemplatesDao.getOutputColumns()).getAsJsonObject();
			JsonArray jsonArray = jsonbject.getAsJsonObject("data").getAsJsonArray("fields").getAsJsonArray();
			List<String> excludedFields = new ArrayList<>();
			if (jsonArray != null) {
				for (int i = 0; i < jsonArray.size(); i++) {
					excludedFields.add(jsonArray.get(i).toString().replace("\"", ""));
				}
			}
			return excludedFields;
		} catch (Exception e) {
			throw new ServiceException("Exception while getting excluded fields", "ERR-REPORT-018");
		}
	}
}
