/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.auth.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.auth.service.IntegrationService;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("authIntegrationService")
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	IntegrationServiceClient integrationServiceClient;

	@Autowired
	private TokenServiceImpl tokenService;

	@Autowired
	private VendorRepository vendorRepo;

	@Override
	@Transactional
	public void sendNotification(NotificationDto notification) {

		integrationServiceClient.sendNotificationWithApiUser("Bearer " + getApiUserToken(), notification);
	}

	private String getApiUserToken() {
		VendorDao vendor = vendorRepo.findByVendorCode(VendorCodeEnum.POSS_TITAN.toString());
		return tokenService.getAuthHeaderToken(vendor);
	}

}