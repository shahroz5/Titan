/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.LovTypeDto;
import com.titan.poss.engine.service.LovService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("engineLovController")
@RequestMapping(value = "engine/v2/lovs")
public class LovController {

	@Autowired
	private LovService lovService;

	@ApiOperation(value = "View the list of lovTypes", notes = "View the list of lovTypes")
	@GetMapping(value = "/lov-types")
	public ListResponse<LovTypeDto> getLovTypes() {
		return lovService.getLocationLovTypes();
	}
}
