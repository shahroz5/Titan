/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.OnlineStatusDto;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dao.LocationQueueDao;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DatasyncAuditMessageResponseDto;
import com.titan.poss.datasync.dto.DatasyncAuditResponseDto;
import com.titan.poss.datasync.dto.DatasyncMessageRequestDto;
import com.titan.poss.datasync.dto.DatasyncStatusCountDto;
import com.titan.poss.datasync.dto.DatasyncStatusRequestDto;
import com.titan.poss.datasync.dto.LocationQueueDto;
import com.titan.poss.datasync.dto.NotificationRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface DatasyncAuditService {

	@Transactional
	String addDatasyncAudit(DatasyncAuditDao datasyncAudit);

	@Transactional
	void addDatasyncAuditList(List<DatasyncAuditDao> datasyncAuditList);

	@Transactional
	void updateMessageRefIdAndStatus(String id, String destination, String messageRefId, String status);

	@Transactional
	void updateDatasyncAuditStatus(String id, String destination, String status);

	@Transactional
	void updateDatasyncAuditStatus(NotificationRequestDto notificationRequest);

	@Transactional
	void updateDatasyncAuditStatusById(String id,String destination, String status);

	void updateMessageRefIdAndStatusById(String id, String messageRefId, String status);

	DatasyncAuditDao getMessageById(String id, String destination);

	List<DatasyncAuditDao> listUnnotifiedMessage();

	void addQueueToLocation(String locationCode, List<LocationQueueDto> queue);

	List<LocationQueueDao> getAllActiveLocation();

	void inActiveLocation(String location);

	@Transactional
	void updateDatasyncAuditStatusAndExceptionById(String messageId,String destination, String name, String message);

	void updateStatus(List<DataSyncAuditDto> syncData, String messageId,String dest);

	void updateSyncTime(String location);

	OnlineStatusDto getOnlineStatus(String location);

	public List<DatasyncStatusCountDto> getStatusCount(DatasyncStatusRequestDto statusRequestDto);

	public Page<DatasyncAuditResponseDto> listMessage(DatasyncMessageRequestDto datasyncMessageRequest,
			Pageable pageable);

	public DatasyncAuditMessageResponseDto getMessage(String id, String destination);

	void retryMessageSync(String id, String destination);

	void updateMessageRefIdAndStatusByIdAndDestination(String id, String messageRefId, String status, String dest);
}
