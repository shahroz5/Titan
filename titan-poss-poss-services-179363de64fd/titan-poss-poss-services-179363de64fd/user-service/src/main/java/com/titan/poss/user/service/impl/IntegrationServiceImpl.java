/*  
 * Copyright 2019. Titan Company Limited
 * 
 */
package com.titan.poss.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.user.service.IntegrationService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userIntegrationService")
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	IntegrationServiceClient integrationServiceClient;

	@Autowired
	private TokenServiceImpl tokenService;

	@Autowired
	private VendorRepository vendorRepo;

	@Override
	public void sendNotification(NotificationDto notification) {

		// check if security principle there or not, if not there use API token

		boolean isLoggedIn = CommonUtil.isLoggedIn();
		if (!isLoggedIn) {
			integrationServiceClient.sendNotificationWithApiUser("Bearer " + getApiUserToken(), notification);
		} else {
			integrationServiceClient.sendNotification(notification);
		}

	}

	private String getApiUserToken() {
		VendorDao vendor = vendorRepo.findByVendorCode(VendorCodeEnum.POSS_TITAN.toString());
		return tokenService.getAuthHeaderToken(vendor);
	}

}
