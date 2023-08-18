/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.datasync.dao.DatasyncAuditDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface DataSyncJobService {

	SchedulerResponseDto failedToPublishToQueue();

	void retryFailToPersist();

	SchedulerResponseDto publishToDataSync();

	SchedulerResponseDto checkHeartBeat();

	void publishMessage(List<DatasyncAuditDao> datasyncAuditDaoList);

	void transferMessage(List<DatasyncAuditDao> datasyncAuditDaoList);

}
