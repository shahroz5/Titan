/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.facade.impl;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.user.facade.UserJobFacade;
import com.titan.poss.user.service.UserJobService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class UserJobFacadeImpl implements UserJobFacade {

	@Autowired
	UserJobService userJobService;

	@Override
	@Transactional
	public SchedulerResponseDto updateAllIsActive() {
		return userJobService.updateAllIsActive();
	}

	@Override
	@Transactional
	public SchedulerResponseDto deactivateLoginUserBasedOnPasswordExpiryDate() {
		return userJobService.deactivateLoginUserBasedOnPasswordExpiryDate();

	}

	@Override
	public SchedulerResponseDto deactivateLoginUserBasedOnLastLoginDate() {
		return userJobService.deactivateLoginUserBasedOnLastLoginDate();
	}

	@Override
	@Transactional
	public SchedulerResponseDto removeTempRoles() {
		return userJobService.removeTempRoles();
	}

	@Override
	@Transactional
	public SchedulerResponseDto assignMobileNoAfterExpiryTime() {
		return userJobService.assignMobileNoAfterExpiryTime();
	}

}
