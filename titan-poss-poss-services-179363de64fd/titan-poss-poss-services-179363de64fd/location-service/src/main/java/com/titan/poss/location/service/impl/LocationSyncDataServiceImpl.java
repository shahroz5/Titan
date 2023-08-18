/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.repository.LocationRepositoryExt;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.service.LocationSyncDataService;

import feign.Response;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class LocationSyncDataServiceImpl implements LocationSyncDataService {

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private LocationRepositoryExt locationRepository;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	private String authorizationToken;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	private static final Logger LOGGER = LoggerFactory.getLogger(LocationSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Override
	public void createQueue(String locationCode) {
		if (isEnabled) {
			try {
				dataSyncServiceClient.addQueueToLocation(locationCode);
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
	}

	@Override
	public void publishLocationMessagesToQueue(SyncStagingDto locStagingDto) {
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		if (isEnabled) {
			try {
				String destType = locStagingDto.getMessageRequest().getDestinationType();
				if (destType.equals(DestinationType.SELECTIVE.name())) {
					String dest = locStagingDto.getMessageRequest().getDestinations().get(0);
					getStatus(statusMap, dest);
				}
				if (statusMap.get(ISOFFLINE).booleanValue() || destType.equals(DestinationType.ALL.name())
						|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
					Response res = dataSyncServiceClient.publish(locStagingDto.getMessageRequest());
					if (res.status() == 200) {
						locationSyncStagingRepository.deleteById(locStagingDto.getId());
						LOGGER.info("Published : {}", locStagingDto.getMessageRequest());
					}
				} else {
					locationSyncStagingRepository.deleteById(locStagingDto.getId());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
	}

	@Override
	public void publishLocationMessagesToQueueWithToken(SyncStagingDto locStagingDto) {
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		if (isEnabled) {
			try {
				authorizationToken = getToken();
				String destType = locStagingDto.getMessageRequest().getDestinationType();
				if (destType.equals(DestinationType.SELECTIVE.name())) {
					String dest = locStagingDto.getMessageRequest().getDestinations().get(0);
					getStatus(statusMap, dest);
				}
				if (statusMap.get(ISOFFLINE).booleanValue() || destType.equals(DestinationType.ALL.name())
						|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
					// Response res =
					// dataSyncServiceClient.publish(locStagingDto.getMessageRequest());
					Response res = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
							locStagingDto.getMessageRequest());
					if (res.status() == 200) {
						locationSyncStagingRepository.deleteById(locStagingDto.getId());
						LOGGER.info("Published : {}", locStagingDto.getMessageRequest());
					}
				} else {
					locationSyncStagingRepository.deleteById(locStagingDto.getId());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
	}

	public String getToken() {
		VendorDto vendorDto = integrationServiceClient.getVendor(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendorDto);
		return authorizationToken;
	}

	private String getAuthHeaderToken(VendorDto vendorDto) {
		List<String> credentials = TokenValidatorUtil
				.verifyDetails(MapperUtil.getJsonString(vendorDto.getVendorDetails()));
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
			oauthToken = authServiceClient.generateToken(clientLogin);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			Object obj = MapperUtil.getJsonFromString(MapperUtil.getJsonString(vendorDto.getVendorDetails().getData()));
			@SuppressWarnings("unchecked")
			Map<String, String> vendorDetailsMap = (Map<String, String>) obj;
			vendorDetailsMap.put("token", token);
			vendorDetailsMap.put("exp", exp);
			Map<String, Object> vendorMap = new LinkedHashMap<>();
			vendorMap.put("type", "TOKEN");
			vendorMap.put("data", vendorDetailsMap);
			VendorUpdateDto vendorUpdateDto = (VendorUpdateDto) MapperUtil.getObjectMapping(vendorDto,
					new VendorUpdateDto());
			vendorUpdateDto
					.setVendorDetails(MapperUtil.getObjectMapperInstance().convertValue(vendorMap, Object.class));
			integrationServiceClient.updateVendor(vendorDto.getVendorCode(), vendorUpdateDto);
		}
		return token;
	}

	/**
	 * @param statusMap
	 * @param dest
	 */
	private void getStatus(Map<String, Boolean> statusMap, String dest) {
		if (!dest.equals("EGHS")) {
			LocationDao locationDao = locationRepository.findOneByLocationCode(dest);
			if (locationDao != null)
				statusMap.replace(ISOFFLINE, locationDao.getIsOffline());
		} else {
			statusMap.replace(ISPUBLISHTOEGHS, true);
		}

	}

	@Override
	public void publishLocationMessages(Map<String, SyncStagingDto> data) {
		if (data.containsKey("EGHS")) {
			publishLocationMessagesToQueue(data.get("EGHS"));
		}
		if (data.containsKey("POSS")) {
			publishLocationMessagesToQueue(data.get("POSS"));
		}
	}

	@Override
	public Map<String, SyncStagingDto> getLocationSyncStagingMap(List<SyncData> syncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType) {
		Map<String, SyncStagingDto> locStagingMap = new HashMap<>();
		if (isPublishToEGHS) {
			List<String> dest = new ArrayList<>();
			SyncStagingDto locEghsStagingDto = new SyncStagingDto();
			dest.add("EGHS");
			MessageRequest eghsMsgRqst = DataSyncUtil.createMessageRequest(syncDataList, operation, dest,
					MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			String eghsRequestBody = MapperUtil.getJsonString(eghsMsgRqst);
			locEghsStagingDto.setMessageRequest(eghsMsgRqst);
			SyncStaging locEghsSyncStaging = new SyncStaging();
			locEghsSyncStaging.setMessage(eghsRequestBody);
			locEghsSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			locEghsSyncStaging = locationSyncStagingRepository.save(locEghsSyncStaging);
			locEghsStagingDto.setId(locEghsSyncStaging.getId());
			locStagingMap.put("EGHS", locEghsStagingDto);
		}
		SyncStagingDto locStagingDto = new SyncStagingDto();
		MessageRequest msgRqst = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations, messageType,
				destinationType);
		String requestBody = MapperUtil.getJsonString(msgRqst);
		locStagingDto.setMessageRequest(msgRqst);
		SyncStaging locSyncStaging = new SyncStaging();
		locSyncStaging.setMessage(requestBody);
		locSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		locSyncStaging = locationSyncStagingRepository.save(locSyncStaging);
		locStagingDto.setId(locSyncStaging.getId());
		locStagingMap.put("POSS", locStagingDto);
		return locStagingMap;
	}

}
