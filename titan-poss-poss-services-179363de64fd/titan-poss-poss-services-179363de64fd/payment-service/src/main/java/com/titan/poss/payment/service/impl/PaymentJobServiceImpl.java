/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.PaymentJobService;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class PaymentJobServiceImpl implements PaymentJobService {
	
	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;
	
	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	private String authorizationToken;
	
	private static final String ERR_CORE_044 = "ERR-CORE-044";

	@Override
	public SchedulerResponseDto publishToDataSync() {
		try {
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
				authorizationToken = getToken();
			}
		List<SyncStaging> syncStagingList = new ArrayList<>();
		int i = -1;
		do {
			Pageable pageable = PageRequest.of(++i, 100, Sort.by("createdDate").ascending());
			syncStagingList.clear();
			syncStagingList = paymentSyncStagingRepository.findSyncStagingDetails(pageable);
			if (!syncStagingList.isEmpty()) {
				List<String> syncIdList = new ArrayList<>();
				syncStagingList.forEach(syncStaging -> {
					Response response = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
							MapperUtil.getObjectMapperInstance().convertValue(
									MapperUtil.getJsonFromString(syncStaging.getMessage()), MessageRequest.class));
					if (response.status() == 200) {
						syncIdList.add(syncStaging.getId());
					}
				});
				if (!syncIdList.isEmpty())
					paymentSyncStagingRepository.updateSyncStatus(syncIdList);
			}
		} while (!syncStagingList.isEmpty());
		paymentSyncStagingRepository.deletePublishedMessage();
		}
		catch(Exception e) {
			throw new ServiceException(e.getMessage(), ERR_CORE_044);
		}
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.PAYMENT_DATA_SYNC.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}
	private String getToken() {
		VendorDto vendorDto = integrationServiceClient.getVendor(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendorDto);
		return authorizationToken;
	}
	private String getAuthHeaderToken(VendorDto vendorDto) {
		List<String> credentials = TokenValidatorUtil.verifyDetails(vendorDto.getVendorDetails().toString());
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
			Map<String, String> vendorDetailsMap = TokenValidatorUtil
					.getMapFromJsonStr(vendorDto.getVendorDetails().toString());
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

}
