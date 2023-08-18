/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.controller;

import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.ContextTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.StorePasswordRequestDto;
import com.titan.poss.sales.dto.response.StorePasswordResponseDto;
import com.titan.poss.sales.service.StorePasswordService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("salesStorePasswordController")
@RequestMapping("sales/v2/store-passwords")
@Validated
public class StorePasswordController {

	@Autowired
	private StorePasswordService storePasswordService;

	/**
	 * This method will list the history password generated.
	 */
	@ApiOperation(value = "API to list password for Store GHS Offline BOD", notes = "This API will list password for Store GHS Offline BOD")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<StorePasswordResponseDto>> listStorePassword(
			@ApiParam(name = "contextType", value = "Provide 'contextType'", allowableValues = "GHS_OFFLINE_BOD,GHS_OFFLINE_EOD", required = true) @RequestParam(name = "contextType", required = true) @ValueOfEnum(enumClass = ContextTypeEnum.class) String contextType,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate' in this format yyyy-MM-dd ", required = false) @RequestParam(name = "businessDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date businessDate,
			@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable) {

		return storePasswordService.listStorePassword(contextType, businessDate, pageable, isPageable);
	}

	/**
	 * This method will generate password for GHS OFFLINE BOD
	 * 
	 * @param depositPasswordCreateDto
	 * @return StorePasswordResponseDto
	 */
	@ApiOperation(value = "API to generate password for Store GHS Offline BOD", notes = "This API will generate password for Store GHS Offline BOD")
	@PostMapping
	public StorePasswordResponseDto generateStorePassword(
			@ApiParam(name = "body", value = "object that is required to generate password", required = true) @RequestBody @Valid StorePasswordRequestDto storePasswordDto) {

		return storePasswordService.generateStorePassword(storePasswordDto);
	}
}
