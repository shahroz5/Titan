/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.HeartBeatDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageTransferData;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dao.SyncStaging;
import com.titan.poss.datasync.dto.DataflowDirectionEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.facade.ConsumeFacade;
import com.titan.poss.datasync.repository.DataSyncRepository;
import com.titan.poss.datasync.repository.DatasyncAuditRepository;
import com.titan.poss.datasync.repository.LocationQueueRepository;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
@Slf4j
public class DataSyncJobServiceImpl implements DataSyncJobService {

	@Autowired
	PublisherServiceImpl publisherServiceImpl;

	@Autowired
	ConsumeFacade consumeFacade;

	@Autowired
	DatasyncAuditRepository datasyncAuditRepository;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private DataSyncRepository dataSyncRepository;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private LocationQueueRepository locationQueueRepository;

	private static final String ERR_CORE_044 = "ERR-CORE-044";

	private String authorizationToken;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	@Value("${aws.sqs.profile}")
	private String locationCode;

	@Value("${app.name}")
	private String appName;

	private static final String CREATED_DATE = "createdDate";

	@Override
	public SchedulerResponseDto failedToPublishToQueue() {
		List<DatasyncAuditDao> datasyncAuditDaoList  = null;
		int i = -1;
		do {
			datasyncAuditDaoList = new ArrayList<>();
			Pageable pageable = PageRequest.of(++i, 100, Sort.by(CREATED_DATE));
			datasyncAuditDaoList = datasyncAuditRepository.findByStatusInAndDataflowDirectionAndSource(
					Arrays.asList("SAVED"), DataflowDirectionEnum.OUT.name(), locationCode, pageable).getContent();
			if (!datasyncAuditDaoList.isEmpty()) {
				publishMessage(datasyncAuditDaoList);
			}
		} while (!datasyncAuditDaoList.isEmpty());
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.DATASYNC_PUBLISH_FAILED.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	@Override
	public void publishMessage(List<DatasyncAuditDao> datasyncAuditDaoList) {
		if (appName.equalsIgnoreCase(AppTypeEnum.EPOSS.name())) {
			List<String> locationCodes = locationQueueRepository.getLocationCodes();
			datasyncAuditDaoList.forEach(datasyncAuditDao -> {
				if (locationCodes.contains(datasyncAuditDao.getDestination())) {
					MessageTransfer messageTransfer = createMessageTransferDetails(datasyncAuditDao);
					try {
						publisherServiceImpl.publishMessageTransfer(messageTransfer, datasyncAuditDao.getDestination(),
								datasyncAuditDao.getId());
					} catch (Exception e) {
						log.info("Error in publishing" + e.getMessage());
					}
				}

			});
		} else {
			datasyncAuditDaoList.forEach(datasyncAuditDao -> {
				MessageTransfer messageTransfer = createMessageTransferDetails(datasyncAuditDao);
				try {
					publisherServiceImpl.publishMessageTransfer(messageTransfer, datasyncAuditDao.getDestination(),
							datasyncAuditDao.getId());
				} catch (Exception e) {
					log.info("Error in publishing" + e.getMessage());
				}

			});
		}
	}

	@Override
	@Async
	public void retryFailToPersist() {
		List<DatasyncAuditDao> datasyncAuditDaoList = null;
		int i = -1;
//		do {
			datasyncAuditDaoList = new ArrayList<>();
			Pageable pageable = PageRequest.of(++i, 500, Sort.by(CREATED_DATE));
			datasyncAuditDaoList = datasyncAuditRepository.findByStatusInAndDataflowDirectionAndSource(
					Arrays.asList("FAILED_DEPENDENCY", "FAILED_PERSIST", "RECEIVED"), DataflowDirectionEnum.IN.name(),
					locationCode, pageable).getContent();
			log.info("******retryFailToPersist******");
			log.info(locationCode);
			log.info("Retry Fail count : "+ datasyncAuditDaoList.size());
			if (!datasyncAuditDaoList.isEmpty()) {
				log.info("Retry Fail count : "+ datasyncAuditDaoList.size());
				transferMessage(datasyncAuditDaoList);
			}
//		} while (!datasyncAuditDaoList.isEmpty());

		
	}

	@Override
	public void transferMessage(List<DatasyncAuditDao> datasyncAuditDaoList) {
		datasyncAuditDaoList.forEach(datasyncAuditDao -> {
			MessageTransfer messageTransfer = createMessageTransferDetails(datasyncAuditDao);
			try {
				consumeFacade.consumeMessageTransfer(messageTransfer, datasyncAuditDao.getId());
			} catch (Exception e) {
				log.info("Error in transferring message" + e.getMessage());
			}

		});
	}

	private MessageTransfer createMessageTransferDetails(DatasyncAuditDao datasyncAuditDao) {
		MessageTransfer messageTransfer = new MessageTransfer();
		messageTransfer.setMessageType(datasyncAuditDao.getMessageType());
		MessageTransferData messageTransferData = new MessageTransferData();
		messageTransferData.setId(datasyncAuditDao.getId());
		messageTransferData.setOperation(datasyncAuditDao.getOperation());
		messageTransferData.setSource(datasyncAuditDao.getSource());
		messageTransferData.setDestination(datasyncAuditDao.getDestination());
		messageTransferData.setSyncData(MapperUtil.jsonStrToList(datasyncAuditDao.getData(), SyncData.class));
		messageTransfer.setMessageTransferData(messageTransferData);
		return messageTransfer;
	}

	@Override
	public SchedulerResponseDto publishToDataSync() {
		List<SyncStaging> syncStagingList = null;
		int i = -1;
		do {
			syncStagingList = new ArrayList<>();
			Pageable pageable = PageRequest.of(++i, 100, Sort.by(CREATED_DATE).ascending());
			syncStagingList = dataSyncRepository.findSyncStagingDetails(pageable).getContent();
			List<String> syncIdList = new ArrayList<>();
			if (!syncStagingList.isEmpty()) {
				syncStagingList.forEach(syncStaging -> {
					Response response = dataSyncServiceClient.publish(MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(syncStaging.getMessage()), MessageRequest.class));
					if (response.status() == 200) {
						syncIdList.add(syncStaging.getId());
					}
				});
				if (!syncIdList.isEmpty())
					dataSyncRepository.updateSyncStatus(syncIdList);
			}
		} while (!syncStagingList.isEmpty());
		dataSyncRepository.deletePublishedMessage();
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.DATASYNC_PUBLISH_RETRY.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
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
			vendorUpdateDto.setVendorDetails(
					MapperUtil.getObjectMapperInstance().convertValue(vendorMap, Object.class));
			integrationServiceClient.updateVendor(vendorDto.getVendorCode(), vendorUpdateDto);
		}
		return token;
	}

	@Override
	public SchedulerResponseDto checkHeartBeat() {
		try {
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
				authorizationToken = getToken();
			}
			HeartBeatDto heart = new HeartBeatDto();
			heart.setLocationCode(locationCode);
			Response response = dataSyncServiceClient.heartBeat("Bearer " + authorizationToken, heart);
			if (response.status() == 200) {
				datasyncAuditService.updateSyncTime(locationCode);
				failedToPublishToQueue();
			}

		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), ERR_CORE_044);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.DATASYNC_HEARTBEAT_CHECK.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

}
