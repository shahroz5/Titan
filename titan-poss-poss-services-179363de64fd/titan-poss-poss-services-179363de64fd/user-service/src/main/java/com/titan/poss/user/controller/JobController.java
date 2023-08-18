/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.controller;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.user.facade.UserJobFacade;
import com.titan.poss.user.service.UserJobService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping(value = "${user.base-url}/jobs")
public class JobController {

	@Autowired
	UserJobFacade userJobFacade;

	@Autowired
	UserJobService userJobService;

	private static final Logger LOGGER = LoggerFactory.getLogger(JobController.class);

	@ApiOperation(value = "Deactivate users based on resignation date", notes = "This API deactivate user if resignation date passed"
			+ "<br>It will be needed where for an user resignation date is in future, this scheduler will check if resignation date crossed, deactivate those users")
	@DeleteMapping(value = "/deactivate-employee-resignation")
	public SchedulerResponseDto resetUserPassword() {
		LOGGER.info("Cron for reset password starts at = {}", new Date());
		return userJobFacade.updateAllIsActive();
	}

	@ApiOperation(value = "Deactivate user login, password exp related", notes = "This API makes login deactivate if password expiry time is crossed")
	@DeleteMapping(value = "/deactivate-user-password-expiry")
	public SchedulerResponseDto deactivateLoginUserBasedOnPasswordExpiryDate() {
		LOGGER.info("Cron for deactivating user login, pswd expiry starts at = {}", new Date());
		return userJobFacade.deactivateLoginUserBasedOnPasswordExpiryDate();
	}

	@ApiOperation(value = "Deactivate user login, login date related", notes = "This API makes login deactivate if last logged in date is less than configured")
	@DeleteMapping(value = "/deactivate-user-login-date")
	public SchedulerResponseDto deactivateLoginUserBasedOnlastLoginDate() {
		LOGGER.info("Cron for deactivating user login, last login date starts at = {}", new Date());
		return userJobFacade.deactivateLoginUserBasedOnLastLoginDate();
	}

	@ApiOperation(value = "Remove temporary roles", notes = "This API remove temporary roles assigned upon expiry time"
			+ "<br>And update assigned user count for boutiques for those roles")
	@DeleteMapping(value = "/remove-temp-role")
	public SchedulerResponseDto removeTempRoles() {
		LOGGER.info("Cron for remove temp roles starts at = {}", new Date());
		return userJobFacade.removeTempRoles();
	}

	@ApiOperation(value = "Assign mobile no. and block user", notes = "This API assigns mobile no.(if requested) to employees if OTP is expeired already and blockes them.")
	@PatchMapping(value = "/assign-new-mobile")
	public SchedulerResponseDto assignNewMobile() {
		LOGGER.info("Cron for assign new mobile starts at = {}", new Date());
		return userJobFacade.assignMobileNoAfterExpiryTime();
	}

	@GetMapping(value = "/publish-to-datasync")
	@ResponseBody
	@ApiOperation(value = "publish To DataSync Service", notes = "This API invocation will publish the persisted messages from sync-staging table to data-sync Service")
	public SchedulerResponseDto publishToDataSync() {

		return userJobService.publishToDataSync();
	}

}
