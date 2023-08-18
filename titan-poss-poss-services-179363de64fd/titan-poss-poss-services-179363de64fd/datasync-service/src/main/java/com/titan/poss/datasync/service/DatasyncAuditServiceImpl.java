/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.titan.poss.core.dto.OnlineStatusDto;
import com.titan.poss.core.enums.OnlineStatusEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dao.DatasyncId;
import com.titan.poss.datasync.dao.LocationQueueDao;
import com.titan.poss.datasync.dao.LocationQueueMappingDao;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DatasyncAuditMessageResponseDto;
import com.titan.poss.datasync.dto.DatasyncAuditResponseDto;
import com.titan.poss.datasync.dto.DatasyncMessageRequestDto;
import com.titan.poss.datasync.dto.DatasyncStatusCountDto;
import com.titan.poss.datasync.dto.DatasyncStatusRequestDto;
import com.titan.poss.datasync.dto.LocationQueueDto;
import com.titan.poss.datasync.dto.NotificationRequestDto;
import com.titan.poss.datasync.dto.StatusCountDto;
import com.titan.poss.datasync.repository.DatasyncAuditRepository;
import com.titan.poss.datasync.repository.LocationQueueMappingRepository;
import com.titan.poss.datasync.repository.LocationQueueRepository;

import brave.Tracer;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class DatasyncAuditServiceImpl implements DatasyncAuditService {

	@Autowired
	private DatasyncAuditRepository datasyncAuditRepository;

	@Autowired
	DataSyncJobService dataSyncJobService;

	@Autowired
	private LocationQueueRepository locationRepository;

	@Autowired
	LocationQueueMappingRepository locationQueueMappingRepository;

	@Autowired
	private Tracer tracer;

	@Value("${aws.sqs.profile}")
	String destination;

	private static final Logger LOGGER = LoggerFactory.getLogger(DatasyncAuditServiceImpl.class);

	@Override
	@Transactional
	public String addDatasyncAudit(DatasyncAuditDao datasyncAudit) {
		DatasyncAuditDao destDa = datasyncAuditRepository.findByIdAndDestination(datasyncAudit.getId(), destination);
		if (destDa != null) {
			destDa.setStatus(DatasyncStatusEnum.RECEIVED.name());
			destDa.setSyncTime(new Date().getTime());
			datasyncAudit = datasyncAuditRepository.saveAndFlush(destDa);
		} else {
			datasyncAudit = datasyncAuditRepository.saveAndFlush(datasyncAudit);
		}
		return datasyncAudit.getId();
	}

	@Override
	@Transactional
	public void addDatasyncAuditList(List<DatasyncAuditDao> datasyncAuditList) {
		datasyncAuditRepository.saveAll(datasyncAuditList);
	}

	@Override
	@Transactional
	public void updateMessageRefIdAndStatus(String id, String destination, String messageRefId, String status) {
		DatasyncAuditDao da = datasyncAuditRepository.findByIdAndDestination(id, destination);
		da.setMessageRefId(messageRefId);
		da.setStatus(status);
		datasyncAuditRepository.save(da);

	}

	@Override
	@Transactional
	public void updateDatasyncAuditStatus(String id, String destination, String status) {
		DatasyncAuditDao da = datasyncAuditRepository.findByIdAndDestination(id, destination);
		da.setStatus(status);
		datasyncAuditRepository.save(da);
	}

	@Override
	@Transactional
	public void updateDatasyncAuditStatus(NotificationRequestDto notificationRequest) {
		datasyncAuditRepository.updateDataSyncWithNotification(notificationRequest, new Date().getTime());
		datasyncAuditRepository.updateNotification(notificationRequest, DatasyncStatusEnum.NOTIFIED.name(), new Date());
		LOGGER.info("\n\nNOTIFIED : {} : {} ::: ntyStatus : {} \n", notificationRequest.getMessageId(),
				notificationRequest.getOperation(), notificationRequest.getStatus());
	}

	@Override
	public DatasyncAuditDao getMessageById(String id, String destination) {
		return datasyncAuditRepository.findByIdAndDestination(id, destination);
	}

	@Override
	@Transactional
	public void updateDatasyncAuditStatusById(String id, String dest, String status) {
		datasyncAuditRepository.updateDatasyncAuditStatusById(id, status, dest, new Date());
	}

	@Override
	public void updateMessageRefIdAndStatusById(String id, String messageRefId, String status) {
		datasyncAuditRepository.updateMessageRefIdAndStatusById(id, messageRefId, status, new Date());

	}

	@Override
	public void updateMessageRefIdAndStatusByIdAndDestination(String id, String messageRefId, String status,
			String dest) {
		datasyncAuditRepository.updateMessageRefIdAndStatusAndDestinationById(id, messageRefId, status, dest,
				new Date());
	}

	@Override
	public List<DatasyncAuditDao> listUnnotifiedMessage() {
		return datasyncAuditRepository.findTop10ByIsNotifiedOrderByLastModifiedDateDesc(false);
	}

	@Override
	@Transactional
	public void addQueueToLocation(String locationCode, List<LocationQueueDto> queue) {

		LocationQueueDao loc = new LocationQueueDao();
		loc.setLocationCode(locationCode);

		List<LocationQueueMappingDao> lqmList = new ArrayList<>();
		for (LocationQueueDto l : queue) {
			LocationQueueMappingDao lqm = new LocationQueueMappingDao();
			lqm.setQueueName(l.getQueueName());
			lqm.setQueueUrl(l.getQueueUrl());
			lqm.setLocation(loc);
			lqmList.add(lqm);
		}
		loc.setLocationQueueList(lqmList);
		locationRepository.save(loc);
	}

	@Override
	public List<LocationQueueDao> getAllActiveLocation() {

		return locationRepository.findByIsActiveTrue();
	}

	@Override
	public void updateSyncTime(String location) {

		Optional<LocationQueueDao> locationQueue = locationRepository.findByLocationCode(location);

		if (locationQueue.isPresent()) {
			locationQueue.get().setLastSyncTime(new Date());
			locationRepository.save(locationQueue.get());
		}
	}

	@Override
	public OnlineStatusDto getOnlineStatus(String location) {

		OnlineStatusDto onlineStatusDto = new OnlineStatusDto();
		Optional<LocationQueueDao> locationQueue = locationRepository.findByLocationCode(location);
		if (locationQueue.isEmpty()) {
			onlineStatusDto.setStatus(OnlineStatusEnum.ONLINE_STORE);
		} else {
			if (locationQueue.isPresent()) {
				long difftime = CalendarUtils.getMinutesDifference(locationQueue.get().getLastSyncTime(), new Date());
				if (difftime <= 1) {
					onlineStatusDto.setStatus(OnlineStatusEnum.OFFLINE_STORE_CONNECTED);
				} else {
					onlineStatusDto.setStatus(OnlineStatusEnum.OFFLINE_STORE_DISCONNECTED);
				}
			}
		}
		return onlineStatusDto;
	}

	@Override
	public void inActiveLocation(String location) {

		Optional<LocationQueueDao> loc = locationRepository.findById(location);
		if (loc.isPresent()) {
			loc.get().setIsActive(false);
			locationRepository.save(loc.get());
		}

	}

	@Transactional
	@Override
	public void updateDatasyncAuditStatusAndExceptionById(String messageId, String dest, String status,
			String exception) {

		StringBuilder errDetails = new StringBuilder();
		if (tracer != null && tracer.currentSpan() != null) {
			errDetails.append("Trace ID : ").append(tracer.currentSpan().context().spanIdString()).append(" , ");
		}
		errDetails.append("Exception: ").append(exception);

		datasyncAuditRepository.updateDatasyncAuditStatusByIdAndDestination(messageId, status, exception, dest,
				new Date());
	}

	@Override
	@Transactional
	public void updateStatus(List<DataSyncAuditDto> dataSyncAuditDtos, String messageId, String dest) {
		String finalStatus = null;
		String exception = null;

		if (dataSyncAuditDtos == null) {
			LOGGER.info("Data is null for messageId"+messageId);
			return;
		}

		for (DataSyncAuditDto dataSyncAudit : dataSyncAuditDtos) {
			if (dataSyncAudit.getStatus().equals(DatasyncStatusEnum.FAILED_DEPENDENCY.name())
					|| dataSyncAudit.getStatus().equals(DatasyncStatusEnum.FAILED_PERSIST.name())) {
				finalStatus = dataSyncAudit.getStatus();
				exception = dataSyncAudit.getException();
				break;
			} else if (!dataSyncAudit.getStatus().equals(DatasyncStatusEnum.SYNCED.name())) {
				finalStatus = dataSyncAudit.getStatus();
			}

		}
		List<DataSyncAuditDto> syncedStatusList = dataSyncAuditDtos.stream()
				.filter(dataSyncAuditDto -> dataSyncAuditDto.getStatus().equals(DatasyncStatusEnum.SYNCED.name()))
				.collect(Collectors.toList());
		if (!syncedStatusList.isEmpty()) {
			finalStatus = DatasyncStatusEnum.SYNCED.name();
		}
		updateDatasyncAuditStatusAndExceptionById(messageId, dest, finalStatus, exception);
	}

	@Override
	public List<DatasyncStatusCountDto> getStatusCount(DatasyncStatusRequestDto statusRequestDto) {
		String loc = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		if (loc == null) {
			loc = destination;
		}
		if (statusRequestDto.getLocation() != null) {
			loc = statusRequestDto.getLocation();
		}
		Date date = statusRequestDto.getDate();
		long date1 = CalendarUtils.convertDateToStartOftheDayEpoch(date);
		Date nextDate = CalendarUtils.addNnoOfDays(1, date);
		long date2 = CalendarUtils.convertDateToStartOftheDayEpoch(nextDate);

		List<StatusCountDto> statusCount = datasyncAuditRepository.getStatusCount(date1, date2, loc);
		List<DatasyncStatusCountDto> datasyncStatusCountDtoList = new ArrayList<>();
		for (StatusCountDto s : statusCount) {
			DatasyncStatusCountDto d = new DatasyncStatusCountDto();
			d.setStatusCode(s.getStatusCode());
			d.setStatusDecs(DatasyncStatusEnum.valueOf(s.getStatusCode()).getStatusDesc());
			d.setMessageCount(s.getMessageCount());
			datasyncStatusCountDtoList.add(d);
		}
		return datasyncStatusCountDtoList;

	}

	@Override
	public Page<DatasyncAuditResponseDto> listMessage(DatasyncMessageRequestDto datasyncMessageRequest,
			Pageable pageable) {

		String loc = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		if (loc == null) {
			loc = destination;
		}
		if (datasyncMessageRequest.getLocation() != null) {
			loc = datasyncMessageRequest.getLocation();
		}
		Date date = datasyncMessageRequest.getDate();
		long date1 = CalendarUtils.convertDateToStartOftheDayEpoch(date);
		Date nextDate = CalendarUtils.addNnoOfDays(1, date);
		long date2 = CalendarUtils.convertDateToStartOftheDayEpoch(nextDate);

		return datasyncAuditRepository.listMessage(date1, date2, loc, datasyncMessageRequest.getStatusCode().name(),
				pageable);

	}

	@Override
	public DatasyncAuditMessageResponseDto getMessage(String id, String destination) {

		DatasyncId datasyncId = new DatasyncId();
		datasyncId.setId(id);
		datasyncId.setDestination(destination);

		DatasyncAuditMessageResponseDto daResp = new DatasyncAuditMessageResponseDto();
		Optional<DatasyncAuditDao> da = datasyncAuditRepository.findById(datasyncId);
		if (da.isPresent()) {
			Gson gson = new Gson();
			MapperUtil.beanMapping(da.get(), daResp);
			Object obj = gson.fromJson(da.get().getData(), Object.class);
			daResp.setData(obj);
		}
		return daResp;

	}

	@Override
	public void retryMessageSync(String id, String destination) {
		DatasyncAuditDao datasyncAuditDao = getMessageById(id, destination);
		if (datasyncAuditDao != null) {
			List<DatasyncAuditDao> datasyncAuditDaoList = new ArrayList<>();
			datasyncAuditDaoList.add(datasyncAuditDao);
			if ("OUT".equalsIgnoreCase(datasyncAuditDao.getDataflowDirection())
					&& (DatasyncStatusEnum.SAVED.name().equalsIgnoreCase(datasyncAuditDao.getStatus())
							|| DatasyncStatusEnum.IN_QUEUE.name().equalsIgnoreCase(datasyncAuditDao.getStatus()))) {
				LOGGER.info("\n\nPUBLISH RETRY-JOB :: {} :: {}\n\n", id, destination);
				dataSyncJobService.publishMessage(datasyncAuditDaoList);
			} else if ("IN".equalsIgnoreCase(datasyncAuditDao.getDataflowDirection())
					&& (DatasyncStatusEnum.RECEIVED.name().equalsIgnoreCase(datasyncAuditDao.getStatus())
							|| datasyncAuditDao.getStatus().contains("FAIL"))) {
				LOGGER.info("\n\nRECEIVER RETRY-JOB :: {} :: {}\n\n", id, destination);
				dataSyncJobService.transferMessage(datasyncAuditDaoList);
			}
		}
	}

}
