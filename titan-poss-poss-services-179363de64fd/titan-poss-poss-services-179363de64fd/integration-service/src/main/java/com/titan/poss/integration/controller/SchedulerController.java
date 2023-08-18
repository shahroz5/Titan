/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.SchedulerMasterResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.integration.dto.SchedulerAuditResponseDto;
import com.titan.poss.integration.service.SchedulerService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping(value = "integration/v2/scheduler")
public class SchedulerController {

	@Autowired
	private SchedulerService schedulerService;

	@ApiOperation(value = "Trigger a scheduler manually", notes = "This API can be used to trigger a scheduler manually based on the scheduler code.")
	@PostMapping()
	public void runScheduler(
			@ApiParam(name = "schedulerCode", value = "SchedulerCode that needs to run", required = true) @RequestParam(name = "schedulerCode", required = true) SchedulerCodeEnum schedulerCode) {

		schedulerService.runManualScheduler(schedulerCode.toString(), CalendarUtils.getCurrentDate());
	}

	@ApiOperation(value = "Update scheduler details.", notes = "This API can be used to update the timing of the scheduler based on the scheduler code. Or activate / inactivate any job")
	@PatchMapping()
	public void updateScheduler(
			@ApiParam(name = "schedulerCode", value = "SchedulerCode that needs to run", required = true) @RequestParam(name = "schedulerCode", required = true) SchedulerCodeEnum schedulerCode,
			@ApiParam(name = "cronExpression", value = "Cron expression to schedule the time", required = true) @RequestParam(name = "cronExpression", required = true) String cronExpression,
			@ApiParam(name = "isActive", value = "Is Active", required = true) @RequestParam(name = "isActive", required = true) boolean isActive) {

		schedulerService.updateCronExpression(schedulerCode.toString(), cronExpression, isActive);
	}

	@ApiPageable
	@PostMapping("/jobs")
	@ApiOperation(value = "View scheduler history data.", notes = "This API can be used to view the scheduler data like when did the last scheduler run and when will the next scheduler run.")
	public PagedRestResponse<List<SchedulerMasterResponseDto>> getSchedulersData(@ApiIgnore Pageable pageable,
			@ApiParam(name = "body", value = "businessDate", required = false) @RequestBody @Valid BusinessDateDto businessDate,
			@ApiParam(name = "schedulerCodes", value = "Scheduler codes", required = false) @RequestParam(name = "schedulerCodes", required = false) @ValueOfEnum(enumClass = SchedulerCodeEnum.class) List<String> schedulerCodes) {

		return schedulerService.getSchedulerData(pageable, businessDate.getBusinessDate(), schedulerCodes);
	}

	@ApiPageable
	@GetMapping()
	@ApiOperation(value = "View scheduler audit data.", notes = "This API can be used to view the scheduler audit data of an individual scheduler.")
	public PagedRestResponse<List<SchedulerAuditResponseDto>> getSchedulerAuditData(@ApiIgnore Pageable pageable,
			@ApiParam(name = "schedulerCode", value = "Scheduler code", required = false) @RequestParam(name = "schedulerCodes", required = false) @ValueOfEnum(enumClass = SchedulerCodeEnum.class) String schedulerCode) {

		return schedulerService.getSchedulerAuditData(pageable, schedulerCode);
	}
}
