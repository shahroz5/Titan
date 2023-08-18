/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.facade;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface UserJobFacade {

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

}
