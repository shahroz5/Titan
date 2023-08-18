/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("userSchedulerService")
public interface UserJobService {

	/**
	 * 
	 */
	SchedulerResponseDto updateAllIsActive();

	/**
	 * 
	 */
	SchedulerResponseDto deactivateLoginUserBasedOnPasswordExpiryDate();

	/**
	 * 
	 */
	SchedulerResponseDto deactivateLoginUserBasedOnLastLoginDate();

	/**
	 * 
	 */
	SchedulerResponseDto removeTempRoles();

	/**
	 * 
	 */
	SchedulerResponseDto assignMobileNoAfterExpiryTime();

	/**
	 * 
	 */
	SchedulerResponseDto publishToDataSync();

}
