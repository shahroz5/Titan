/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.service.impl;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronSequenceGenerator;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.report.dao.ReportSchedulerDao;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.repository.ReportSchedulerRepositoryExt;
import com.titan.poss.report.service.ReportSchedulerService;
import com.titan.poss.report.service.ReportService;

import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("reportSchedulerService")
@Slf4j
public class ReportSchedulerServiceImpl implements ReportSchedulerService {

	@Autowired
	private ReportService reportService;

	@Autowired
	private ReportSchedulerRepositoryExt reportSchedulerRepositoryExt;

	@Scheduled(cron = "${cron.expression.reportScheduler}")
	@SchedulerLock(name = "reportScheduler", lockAtLeastFor = CommonConstants.SHEDLOCK_PT2M, lockAtMostFor = CommonConstants.SHEDLOCK_PT3M)
	@Override
	public SchedulerResponseDto reportJob() {
		
		log.info("Scheduler ran at :  "+ new Date());

		Date currentDatetemp = CalendarUtils.getCurrentDate();
		
		Date currentDate = new Date(currentDatetemp.getTime()+(1 * 60000));
		
		log.info("Current date after  adding  MS :"+currentDate);
		
		LocalDateTime currentDate2 = LocalDateTime.now().minusMinutes(5);
		
		Calendar cal = Calendar.getInstance();
		Calendar cal2 = Calendar.getInstance();
		cal.add(Calendar.DATE, -1);
		Date yesterdayDate = cal.getTime();
		cal2.add(Calendar.DATE, -7);
		Date lastWeekDate = cal2.getTime();
		cal.add(Calendar.MONTH, -1);
		Date lastMonthDate = cal.getTime();
		List<ReportSchedulerDao> listOfReportsSchedulerDao = reportSchedulerRepositoryExt.findAll();
		if (!listOfReportsSchedulerDao.isEmpty()) {
			listOfReportsSchedulerDao.stream().forEach(reportSchedulerDao -> {
				if (reportSchedulerDao.getCronExpression() != null) {
					CronSequenceGenerator generator = new CronSequenceGenerator(reportSchedulerDao.getCronExpression());
					log.info("current date"+currentDate);
					log.info("local date time"+currentDate2);
					log.info(" before comparing date");
					log.info("gen next input : "+ CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDate2));
					log.info("generator date : " + generator.next(CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDate2)));
					log.info( "compared to output : " + currentDate.compareTo(
							generator.next(CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDate2))) );
					if (currentDate.compareTo(
							generator.next(CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDate2))) >= 0) {
					
							log.info("after comparing date");
							
						switch (reportSchedulerDao.getFrequency()) {
						case "DAILY":
							log.info("Daily scheduled jobs");
							generateAutomaticReport(reportSchedulerDao.getReportMaster().getId(), yesterdayDate,
									yesterdayDate);
							break;

						case "WEEKLY":
							generateAutomaticReport(reportSchedulerDao.getReportMaster().getId(), lastWeekDate,
									yesterdayDate);
							break;

						case "MONTHLY":
							int max = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
							cal.set(Calendar.DAY_OF_MONTH, max);
							generateAutomaticReport(reportSchedulerDao.getReportMaster().getId(), lastMonthDate,
									yesterdayDate);
							break;
						default:
							break;
						}
					}
				}
			});
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.REPORT_GENERATE_JOB.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	@Override
	public void generateAutomaticReport(String reportId, Date fromDate, Date toDate) {
		ReportRequestDto reportRequestDto = new ReportRequestDto();
		reportRequestDto.setFromDate(fromDate);
		reportRequestDto.setToDate(toDate);
		reportRequestDto.setReportId(reportId);
		log.info("Automated report id : "+ reportId);
		reportService.autoGenerateReport(reportId, reportRequestDto);
	}

}
