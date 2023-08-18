/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.support.CronSequenceGenerator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.dto.SchedulerMasterResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.integration.dto.SchedulerAuditResponseDto;
import com.titan.poss.integration.intg.dao.SchedulerAuditDao;
import com.titan.poss.integration.intg.dao.SchedulerHistoryDao;
import com.titan.poss.integration.intg.dao.SchedulerMasterDao;
import com.titan.poss.integration.intg.repository.SchedulerAuditRepository;
import com.titan.poss.integration.intg.repository.SchedulerHistoryRepository;
import com.titan.poss.integration.intg.repository.SchedulerMasterRepository;
import com.titan.poss.integration.service.SchedulerService;
import com.titan.poss.integration.service.factory.SchedulerRouter;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class SchedulerServiceImpl implements SchedulerService {

	@Autowired
	private SchedulerMasterRepository schedulerMasterRepository;

	@Autowired
	private SchedulerHistoryRepository schedulerHistoryRepository;

	@Autowired
	private SchedulerAuditRepository schedulerAuditRepository;

	@Autowired
	private SchedulerRouter schedulerRouter;

	@Value("${app.name}")
	private String appName;

	@Value("${scheduler.audit.days:7}")
	private Integer schedulerAuditDays;

	private static final String ERR_INT_064 = "ERR-INT-064";

	@Override
	public void triggerSchedulers() {

		Set<String> jobsToRun = new HashSet<>();

		// getting the list of scheduler and evaluating the cron expression

		List<SchedulerMasterDao> schedulerMasters = schedulerMasterRepository.getAllValidSchedulers(appName, true);
        log.info("scheduler master  {} ", schedulerMasters);
		Date currentDate = CalendarUtils.getCurrentDate();
		LocalDateTime currentDateMinus1Min = LocalDateTime.now().minusSeconds(30);
		schedulerMasters.stream().forEach(sm -> {
			CronSequenceGenerator generator = new CronSequenceGenerator(sm.getCronExpression());
			if (CronSequenceGenerator.isValidExpression(sm.getCronExpression()) && currentDate.compareTo(
					generator.next(CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDateMinus1Min))) >= 0) {
				jobsToRun.add(sm.getCode());
			}
		});

		// getting the jobs which did not run previously
		List<String> schedulerCodes = schedulerHistoryRepository.getSchedulerCodesWhichDidNotRun(currentDate, true);
		jobsToRun.addAll(schedulerCodes);

		// removing scheduler codes which are in progress and less than the scheduler
		// gap
		List<String> schedulerCodesToBeRemoved = new ArrayList<>();
		schedulerMasters.stream().forEach(sm -> {
			if (sm.getSchedulerGap() != null) {
				LocalDateTime currentDateMinusSchedulerGap = LocalDateTime.now().minusHours(sm.getSchedulerGap());
				List<SchedulerAuditDao> schedulerAudits = schedulerAuditRepository
						.findBySchedulerMasterCodeAndStatusAndStartTimeAfter(sm.getCode(),
								JobProcessStatusEnum.INPROGRESS.toString(),
								CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDateMinusSchedulerGap));
				if (!schedulerAudits.isEmpty()) {
					schedulerCodesToBeRemoved.add(sm.getCode());
				}
			}
		});

        log.info("jobsToRun  {} ", jobsToRun);
        log.info("schedulerCodesToBeRemoved  {} ", schedulerCodesToBeRemoved);
		jobsToRun.removeAll(schedulerCodesToBeRemoved);
		for (String job : jobsToRun) {
			runScheduler(job, false, currentDate);
		}
	}

	@Override
	public void runManualScheduler(String code, Date currentDate) {
		SchedulerMasterDao schedulerMaster = schedulerMasterRepository.findByCodeAndIsActive(code, true);
		if (schedulerMaster == null) {
			throw new ServiceException("Scheduler master is not present/active", ERR_INT_064,
					"Scheduler master is not present/active: " + code);
		}
		List<SchedulerAuditDao> schedulerAudits = getInprogressSchedulers(code, schedulerMaster.getSchedulerGap());
		if (!schedulerAudits.isEmpty()) {
			long totalTime = (currentDate.getTime() - schedulerAudits.get(0).getStartTime().getTime()) / 60000;
			if (schedulerMaster.getSchedulerGap() != null && totalTime < schedulerMaster.getSchedulerGap()) {
				throw new ServiceException("Same scheduler is in-progress. Please try again after some time",
						"ERR-INT-061");
			} else {
				runScheduler(code, true, currentDate);
			}
		} else {
			runScheduler(code, true, currentDate);
		}
	}

	private void runScheduler(String code, boolean manualJob, Date currentDate) {
		String auditId = insertSchedulerAudit(code, manualJob, currentDate);
		String locationCode = null;
		String authorizationToken = null;
		String authorizationCookie = null;
		try {
			locationCode = CommonUtil.getLocationCode();
			authorizationToken = getBearerToken(CommonConstants.AUTH_HEADER);
			authorizationCookie = getBearerToken(CommonConstants.COOKIE_HEADER);
		} catch (Exception exception) {
			log.debug("Automatic scheduler");
			exception.printStackTrace();
		}
		log.info("triggering schedule job {}",code);
		schedulerRouter.triggerScheduledJob(code, auditId, currentDate, manualJob, locationCode, authorizationToken,
				authorizationCookie);
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

	private String insertSchedulerAudit(String code, boolean manualJob, Date currentDate) {
		SchedulerAuditDao schedulerAudit = new SchedulerAuditDao();

		Optional<SchedulerMasterDao> schedulerMaster = schedulerMasterRepository.findById(code);
		if (!schedulerMaster.isPresent()) {
			throw new ServiceException("Scheduler Master not found", ERR_INT_064);
		}
		schedulerAudit.setSchedulerMaster(schedulerMaster.get());
		schedulerAudit.setSchedulerRunTime(currentDate);
		schedulerAudit.setStatus(JobProcessStatusEnum.INPROGRESS.toString());
		schedulerAudit.setStartTime(currentDate);
		schedulerAudit.setManualJob(manualJob);
		String locationCode = null;
		try {
			if (CommonUtil.isAStoreUser()) {
				locationCode = CommonUtil.getLocationCode();
			}
		} catch (Exception ex) {
			log.debug("Automatic scheduler");
			ex.printStackTrace();
		}
		schedulerAudit.setLocationCode(locationCode);
		SchedulerAuditDao savedSchedulerAudit = schedulerAuditRepository.save(schedulerAudit);
		return savedSchedulerAudit.getId();
	}

	@Transactional
	@Override
	public void updateCronExpression(String code, String cronExpression, boolean isActive) {

		if (CronSequenceGenerator.isValidExpression(cronExpression)) {
			Optional<SchedulerMasterDao> schedulerMaster = schedulerMasterRepository.findById(code);
			if (!schedulerMaster.isPresent()) {
				throw new ServiceException("Scheduler Master not found", ERR_INT_064);
			}
			schedulerMaster.get().setCronExpression(cronExpression);
			schedulerMaster.get().setActive(isActive);
			schedulerMasterRepository.save(schedulerMaster.get());

			// updating scheduler history next run time
			SchedulerHistoryDao schedulerHistory = schedulerHistoryRepository.findByCode(code);
			if (schedulerHistory != null) {
				CronSequenceGenerator generator = new CronSequenceGenerator(cronExpression);
				Date nextDate = generator.next(CalendarUtils.getCurrentDate());
				schedulerHistory.setNextRunTime(nextDate);
				schedulerHistoryRepository.save(schedulerHistory);
			}
		} else {
			throw new ServiceException("Invalid cron expression", "ERR-INT-062", cronExpression + " is not valid");
		}

	}

	@Override
	public PagedRestResponse<List<SchedulerMasterResponseDto>> getSchedulerData(Pageable pageable, Date businessDate,
			List<String> schedulerCodes) {

		String type = "POSS";
		String locationCode = null;
		if (CommonUtil.isACorpUser()) {
			type = "EPOSS";
		} else {
			locationCode = CommonUtil.getLocationCode();
		}
		Date possBusinessDate = businessDate == null ? businessDate
				: CalendarUtils.convertStringToDate(CalendarUtils.formatDateToSql(businessDate), "yyyy-MM-dd");
		Page<SchedulerMasterResponseDto> schedulerMasterList = schedulerMasterRepository.listPossSchedulerMaster(type,
				locationCode, possBusinessDate, schedulerCodes, pageable);
		return new PagedRestResponse<>(schedulerMasterList.stream().collect(Collectors.toList()), schedulerMasterList);
	}

	@Override
	public PagedRestResponse<List<SchedulerAuditResponseDto>> getSchedulerAuditData(Pageable pageable,
			String schedulerCode) {
		String type = "POSS";
		String locationCode = null;
		if (CommonUtil.isACorpUser()) {
			type = "EPOSS";
		} else {
			locationCode = CommonUtil.getLocationCode();
		}

		// querying only for 7 days of audit data
		Date startDate = CalendarUtils
				.convertLocalDateTimeToDateUsingInstant(LocalDateTime.now().minusDays(schedulerAuditDays));
		Page<SchedulerAuditResponseDto> schedulerAuditList = schedulerAuditRepository.listSchedulerAuditData(type,
				locationCode, schedulerCode, startDate, CalendarUtils.getCurrentDate(), pageable);
		return new PagedRestResponse<>(schedulerAuditList.stream().collect(Collectors.toList()), schedulerAuditList);
	}

	private List<SchedulerAuditDao> getInprogressSchedulers(String code, Integer schedulerGap) {
		if (schedulerGap == null) {
			schedulerGap = 0;
		}
		LocalDateTime currentDateMinusSchedulerGap = LocalDateTime.now().minusHours(schedulerGap);
		return schedulerAuditRepository.findBySchedulerMasterCodeAndStatusAndStartTimeAfter(code,
				JobProcessStatusEnum.INPROGRESS.toString(),
				CalendarUtils.convertLocalDateTimeToDateUsingInstant(currentDateMinusSchedulerGap));
	}
}
