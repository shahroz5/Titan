/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.auth.dto.request.ClientErrorDto;
import com.titan.poss.auth.dto.response.ClientResDto;
import com.titan.poss.auth.service.LoggingService;
import com.titan.poss.core.exception.RequestException;

import io.swagger.annotations.ApiOperation;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "${auth.base-url}")
public class LoggingController {

	@Autowired
	private LoggingService loggingService;

	/**
	 * This method will save the client error log details.
	 * 
	 * @param clientErrorDto
	 * @param bindingResult
	 * @return ClientResDto
	 */
	@ApiOperation(value = "Save the client error log details", notes = "This API saves the Client error log details")
	@PostMapping(value = "/client/error-log")
	public ClientResDto addBrand(@RequestBody @Valid ClientErrorDto clientErrorDto, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new RequestException("Error while adding Client error log details", bindingResult);
		}
		return loggingService.addClientLog(clientErrorDto);
	}

}
