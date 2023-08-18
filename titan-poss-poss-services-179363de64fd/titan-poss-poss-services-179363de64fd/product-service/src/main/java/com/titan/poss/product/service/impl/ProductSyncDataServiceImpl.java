/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.ProductSyncDataService;

import feign.Response;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ProductSyncDataServiceImpl implements ProductSyncDataService {

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;
	
	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Value("${datasync.enable}")
	private boolean isEnabled;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ProductSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";


	@Override
	public void publishProductMessagesToQueue(SyncStagingDto data) {
		if (isEnabled) {
			Map<String, Boolean> statusMap = new HashMap<>();
			statusMap.put(ISOFFLINE, false);
			statusMap.put(ISPUBLISHTOEGHS, false);
			try {
				String destType = data.getMessageRequest().getDestinationType();
				if (destType.equals(DestinationType.SELECTIVE.name())) {
					String dest = data.getMessageRequest().getDestinations().get(0);
					getStatus(statusMap, dest);
				}
				if (statusMap.get(ISOFFLINE).booleanValue() || destType.equals(DestinationType.ALL.name())
						|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
					Response res = dataSyncServiceClient.publish(data.getMessageRequest());
					if (res.status() == 200) {
						productSyncStagingRepository.deleteById(data.getId());
					}
				} else {
					productSyncStagingRepository.deleteById(data.getId());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
	}

	/**
	 * @param statusMap
	 * @param dest
	 */
	private void getStatus(Map<String, Boolean> statusMap, String dest) {
		if (!dest.equals("EGHS")) {
			LocationCacheDto locationDto = engineServiceClient.getStoreLocation(dest);
			if (locationDto != null)
				statusMap.replace(ISOFFLINE, locationDto.getIsOffline());
		} else {
			statusMap.replace(ISPUBLISHTOEGHS, true);
		}

	}
	@Override
	public void publishProductMessages(Map<String, SyncStagingDto> data) {
		if (data.containsKey("EGHS")) {
			publishProductMessagesToQueue(data.get("EGHS"));
		}
		if (data.containsKey("POSS")) {
			publishProductMessagesToQueue(data.get("POSS"));
		}
	}

	/**
	 * @param syncDataList
	 * @param operation
	 * @param destinations
	 * @param isPublishToEGHS
	 * @param destinationType
	 * @param messageType
	 * @return Map<String, SyncStagingDto>
	 */
	public Map<String, SyncStagingDto> getProductSyncStagingMap(List<SyncData> syncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType) {

		Map<String, SyncStagingDto> stagingMap = new HashMap<>();
		if (isPublishToEGHS) {
			List<String> dest = new ArrayList<>();
			SyncStagingDto eghsStagingDto = new SyncStagingDto();
			dest.add("EGHS");
			MessageRequest eghsMsgRqst = DataSyncUtil.createMessageRequest(syncDataList, operation, dest,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			String eghsRequestBody = MapperUtil.getJsonString(eghsMsgRqst);
			eghsStagingDto.setMessageRequest(eghsMsgRqst);
			SyncStaging eghsSyncStaging = new SyncStaging();
			eghsSyncStaging.setMessage(eghsRequestBody);
			eghsSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			eghsSyncStaging = productSyncStagingRepository.save(eghsSyncStaging);
			eghsStagingDto.setId(eghsSyncStaging.getId());
			stagingMap.put("EGHS", eghsStagingDto);
		}
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest msgRqst = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				messageType, destinationType);
		String requestBody = MapperUtil.getJsonString(msgRqst);
		syncStagingDto.setMessageRequest(msgRqst);
		SyncStaging syncStaging = new SyncStaging();
		syncStaging.setMessage(requestBody);
		syncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		syncStaging = productSyncStagingRepository.save(syncStaging);
		syncStagingDto.setId(syncStaging.getId());
		stagingMap.put("POSS", syncStagingDto);
		return stagingMap;
	}

}
