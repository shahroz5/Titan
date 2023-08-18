/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.PanDocDetailsResponseDto;
import com.titan.poss.core.enums.PanDocVerificationEnum;
import com.titan.poss.integration.service.PanDocService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationPanDocController")
@RequestMapping("integration/v2/pan")
public class PanDocController {

	@Autowired
	private PanDocService panDocService;

	@ApiOperation(value = "Pan Number", notes = "This API will send details to Pan service to verify Pan Number")
	@PostMapping
	public PanDocDetailsResponseDto verifyPanDetails(

			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "PAN_KHOSLA", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "verificationType", value = "type of the verification", allowableValues = "NUMBER", required = true) @RequestParam(name = "verificationType", required = true) @ValueOfEnum(enumClass = PanDocVerificationEnum.class) String verificationType,
			@ApiParam(name = "panCardNo", value = "pan card Number to verify", required = false) @RequestParam(name = "panCardNo", required = false) String panCardNo) {

		return panDocService.verifyPanDetails(vendorCode, verificationType, panCardNo);
	}

	

}
