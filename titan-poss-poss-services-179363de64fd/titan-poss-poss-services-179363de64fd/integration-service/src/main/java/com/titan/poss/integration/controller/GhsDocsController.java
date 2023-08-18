/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GhsDocsResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationGhsDocsController")
@RequestMapping(value = "integration/v2/ghs/docs")
public class GhsDocsController {
	
	@Autowired
	private GhsService ghsService;
	
	@ApiOperation(value = "This method will get docs from GHS", notes = "This API will get docs available in GHS system for the given customerId and accountId")
	@GetMapping(value = "")
	public ListResponse<GhsDocsResponseDto> getGhsDocs(
		@ApiParam(name = "customerId", value = "customerId", required = true) @RequestParam(name = "customerId", required = true) int customerId,
		@ApiParam(name = "accountNo", value = "accountNo", required = true) @RequestParam(name = "accountNo", required = true) int accountNo,
		@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode){
		return ghsService.getGhsDocs(customerId,accountNo,vendorCode);
	}
	
}
