/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.user.dao.SyncStaging;
import com.titan.poss.user.repository.UserSyncStagingRepository;
import com.titan.poss.user.service.EpossTokenService;
import com.titan.poss.user.service.UserSyncDataService;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class UserSyncDataServiceImpl implements UserSyncDataService {

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private UserSyncStagingRepository userSyncStagingRepository;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private EpossTokenService epossTokenService;


	private static final Logger LOGGER = LoggerFactory.getLogger(UserSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Override
	public void publishUserMessagesToQueue(SyncStagingDto userStagingDto) {
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		String operationCode = userStagingDto.getMessageRequest().getMessageRequestData().getOperation();
		String destType = userStagingDto.getMessageRequest().getDestinationType();
		if (isEnabled) {
			try {
				String token = getStatusAndToken(userStagingDto, statusMap);
				if (statusMap.get(ISOFFLINE).booleanValue() || destType.equals(DestinationType.ALL.name())
						|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
					Response response = null;
					if (operationCode.equals(UserOperationCodes.VERIFYOTP)) {
						response = dataSyncServiceClient.publishWithToken("Bearer " + token,
								userStagingDto.getMessageRequest());
					} else {
						response = dataSyncServiceClient.publish(userStagingDto.getMessageRequest());
					}
					if (response.status() == 200)
						userSyncStagingRepository.deleteById(userStagingDto.getId());
				} else {
					userSyncStagingRepository.deleteById(userStagingDto.getId());
				}

			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
	}

	/**
	 * @param userStagingDto
	 * @param statusMap
	 * @return token
	 */
	private String getStatusAndToken(SyncStagingDto userStagingDto, Map<String, Boolean> statusMap) {
		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.POSS_TITAN.name());
		String token = epossTokenService.getAuthHeaderToken(vendor);
		String destType = userStagingDto.getMessageRequest().getDestinationType();
		if (destType.equals(DestinationType.SELECTIVE.name())) {
			String dest = userStagingDto.getMessageRequest().getDestinations().get(0);
			if (!dest.equals("EGHS")) {
				LocationCacheDto locationDto = engineServiceClient.getStoreLocationWithToken("Bearer " + token, dest);
				if (locationDto != null)
					statusMap.replace(ISOFFLINE, locationDto.getIsOffline());
			} else {
				statusMap.replace(ISPUBLISHTOEGHS, true);
			}
		}
		return token;
	}

	@Override
	public void publishUserMessages(Map<String, SyncStagingDto> data) {

		if (data.containsKey("EGHS")) {
			publishUserMessagesToQueue(data.get("EGHS"));
		}
		if (data.containsKey("POSS")) {
			publishUserMessagesToQueue(data.get("POSS"));
		}
	}

	@Override
	public Map<String, SyncStagingDto> getUserSyncStagingMap(List<SyncData> userSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType) {
		Map<String, SyncStagingDto> userStagingMap = new HashMap<>();
		if (isPublishToEGHS) {
			List<String> dest = new ArrayList<>();
			SyncStagingDto userEghsStagingDto = new SyncStagingDto();
			dest.add("EGHS");
			MessageRequest eghsMsgRqst = DataSyncUtil.createMessageRequest(userSyncDataList, operation, dest,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			String eghsRequestBody = MapperUtil.getJsonString(eghsMsgRqst);
			userEghsStagingDto.setMessageRequest(eghsMsgRqst);
			SyncStaging userEghsSyncStaging = new SyncStaging();
			userEghsSyncStaging.setMessage(eghsRequestBody);
			userEghsSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			userEghsSyncStaging = userSyncStagingRepository.save(userEghsSyncStaging);
			userEghsStagingDto.setId(userEghsSyncStaging.getId());
			userStagingMap.put("EGHS", userEghsStagingDto);
		}
		SyncStagingDto userStagingDto = new SyncStagingDto();
		MessageRequest msgRqst = DataSyncUtil.createMessageRequest(userSyncDataList, operation, destinations,
				messageType,
				destinationType);
		String requestBody = MapperUtil.getJsonString(msgRqst);
		userStagingDto.setMessageRequest(msgRqst);
		SyncStaging userSyncStaging = new SyncStaging();
		userSyncStaging.setMessage(requestBody);
		userSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		userSyncStaging = userSyncStagingRepository.save(userSyncStaging);
		userStagingDto.setId(userSyncStaging.getId());
		userStagingMap.put("POSS", userStagingDto);
		return userStagingMap;
	}
}
