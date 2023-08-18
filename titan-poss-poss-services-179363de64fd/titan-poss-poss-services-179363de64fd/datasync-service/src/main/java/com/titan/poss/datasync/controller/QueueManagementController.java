/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.controller;

import java.util.List;

import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.datasync.dto.LocationQueueDto;
import com.titan.poss.datasync.service.QueueManagementService;

import io.swagger.annotations.ApiOperation;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "datasync/v2")
@Validated
public class QueueManagementController {

	@Autowired
	QueueManagementService queueManagementService;

	@PostMapping(value = "/queue/{locationcode}")
	@ApiOperation(value = "Creates Queue", notes = "This Api creates Queues required for datasync for the given Location code")
	public List<LocationQueueDto> addQueueToLocation(
			@PathVariable @Pattern(regexp = RegExConstants.LOCATION_CODE_REGEX, message = RegExConstants.REGEX_MSG) String locationcode) {

		return queueManagementService.createAllQueueForLocation(locationcode);
	}

	@ApiOperation(value = "Deletes Queue", notes = "This Api Deletes all the Queues of datasync for the given Location code")
	@DeleteMapping(value = "/queue/{locationcode}")
	public void disableQueueByLocation(
			@PathVariable @Pattern(regexp = RegExConstants.LOCATION_CODE_REGEX, message = RegExConstants.REGEX_MSG) String locationcode) {
		queueManagementService.disableLocationQueue(locationcode);

	}
}
