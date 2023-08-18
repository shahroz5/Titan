/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.service.ConfigSyncDataService;
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

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ConfigSyncDataServiceImpl implements ConfigSyncDataService {

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private EngineServiceClient engineServiceClient;

	private static final Logger LOGGER = LoggerFactory.getLogger(ConfigSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Override
	public void publishConfigMessagesToQueue(SyncStagingDto configSyncStagingDto) {
		LOGGER.info("**** SyncStagingDto in ConfigSyncDataServiceImpl *****");
		LOGGER.info(configSyncStagingDto.toString());
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		if (isEnabled) {
			try {
				String destType = configSyncStagingDto.getMessageRequest().getDestinationType();
				if (destType.equals(DestinationType.SELECTIVE.name())) {
					String dest = configSyncStagingDto.getMessageRequest().getDestinations().get(0);
					getStatus(statusMap, dest);
				}
				LOGGER.info("**** DestType *****");
				LOGGER.info(destType);
				LOGGER.info("**** StatusMap *****");
				LOGGER.info(statusMap.toString());
				if (statusMap.get(ISOFFLINE).booleanValue() || destType.equals(DestinationType.ALL.name())
						|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
					Response res = dataSyncServiceClient.publish(configSyncStagingDto.getMessageRequest());
					if (res.status() == 200) {
						configSyncStagingRepository.deleteById(configSyncStagingDto.getId());
						LOGGER.info("Published : {} ", configSyncStagingDto.getMessageRequest());
					}
				} else {
					configSyncStagingRepository.deleteById(configSyncStagingDto.getId());
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
	public void publishConfigMessages(Map<String, SyncStagingDto> configData) {
		if (configData.containsKey("EGHS")) {
			publishConfigMessagesToQueue(configData.get("EGHS"));
		}
		if (configData.containsKey("POSS")) {
			publishConfigMessagesToQueue(configData.get("POSS"));
		}

	}

	@Override
	public Map<String, SyncStagingDto> getConfigSyncStagingMap(List<SyncData> configSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType) {
		Map<String, SyncStagingDto> configStagingMap = new HashMap<>();
		if (isPublishToEGHS) {
			List<String> dest = new ArrayList<>();
			SyncStagingDto configEghsStagingDto = new SyncStagingDto();
			dest.add("EGHS");
			MessageRequest eghsMsgRqst = DataSyncUtil.createMessageRequest(configSyncDataList, operation, dest,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			String eghsRequestBody = MapperUtil.getJsonString(eghsMsgRqst);
			configEghsStagingDto.setMessageRequest(eghsMsgRqst);
			SyncStaging configEghsSyncStaging = new SyncStaging();
			configEghsSyncStaging.setMessage(eghsRequestBody);
			configEghsSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			configEghsSyncStaging = configSyncStagingRepository.save(configEghsSyncStaging);
			configEghsStagingDto.setId(configEghsSyncStaging.getId());
			configStagingMap.put("EGHS", configEghsStagingDto);
		}
		SyncStagingDto configStagingDto = new SyncStagingDto();
		MessageRequest msgRqst = DataSyncUtil.createMessageRequest(configSyncDataList, operation, destinations,
				messageType, destinationType);
		String requestBody = MapperUtil.getJsonString(msgRqst);
		configStagingDto.setMessageRequest(msgRqst);
		SyncStaging configSyncStaging = new SyncStaging();
		configSyncStaging.setMessage(requestBody);
		configSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		configSyncStaging = configSyncStagingRepository.save(configSyncStaging);
		configStagingDto.setId(configSyncStaging.getId());
		configStagingMap.put("POSS", configStagingDto);
		return configStagingMap;
	}

}
