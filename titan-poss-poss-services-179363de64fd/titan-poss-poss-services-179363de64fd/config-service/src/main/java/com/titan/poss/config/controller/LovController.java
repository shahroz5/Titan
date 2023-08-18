/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.config.dto.LovTypesDto;
import com.titan.poss.config.dto.constants.LovTypeEnum;
import com.titan.poss.config.dto.request.LovUpdateDto;
import com.titan.poss.config.dto.response.LovCreateDto;
import com.titan.poss.config.service.LovService;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.utils.PreAuthorizeDetails;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("LOV_CONTROLLER")
@RequestMapping("config/v2/lovs")
public class LovController {

	@Autowired
	private LovService lovService;

//	private static final String RANGE_CONFIG_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
//			+ ConfigAccessControls.RANGE_CONFIGURATION_ADD_EDIT + PreAuthorizeDetails.END;
//	
	private static final String RANGE_CONFIG_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.RANGE_CONFIGURATION_VIEW + PreAuthorizeDetails.END;
	
 /**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@ApiOperation(value = "View the list of lovTypes", notes = "This API returns the list of lovTypes")
	@GetMapping(value = "/lov-types")
	@PreAuthorize(RANGE_CONFIG_VIEW_PERMISSION)
	public LovTypesDto getLovTypes() {
		return lovService.getLovTypes();
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@ApiOperation(value = "View the Lov details", notes = "This API returns the Lov details based on **lovType**"
			+ "lovCode should be alphanumeric and size should be <= 50")
	@GetMapping(value = "/{lovType}")
	@PreAuthorize(RANGE_CONFIG_VIEW_PERMISSION)
	public LovDto getLov(
			@PathVariable("lovType") @ApiParam(required = true, value = "Lov Type", allowableValues = "DISCOUNT_TYPE, RANGE_TYPE, CLUBBING_DISCOUNT_TYPE, APPROVAL_ROLES,RIVAAH_CARD") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX_50) String lovCode) {
		return lovService.getLov(lovType, lovCode);
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@ApiOperation(value = "Create the Lov details", notes = "This API creates the Lov details based on **lovType**</br>"
			+ "lovCode and lovValue should be alphanumeric and size should be <= 50")
	@PostMapping
	public LovCreateDto createLov(
			@RequestBody @Valid @ApiParam(name = "body", value = "LOV that needs to be created", required = true) LovCreateDto lovCreateDto) {
		return lovService.createLov(lovCreateDto);
	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@ApiOperation(value = "Update the Lov details", notes = "This API updates the Lov details based on **lovType**"
			+ "lovCode and lovValue should be alphanumeric and size should be <= 50")
	@PatchMapping(value = "/{lovType}")
	public LovDto updateLov(
			@PathVariable("lovType") @ApiParam(required = true, value = "Lov Type", allowableValues = "DISCOUNT_TYPE, RANGE_TYPE, CLUBBING_DISCOUNT_TYPE, APPROVAL_ROLES, RIVAAH_CARD") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestBody @Valid @ApiParam(name = "body", value = "LOV that needs to be updated", required = true) LovUpdateDto lovUpdateDto) {
		return lovService.updateLov(lovType, lovUpdateDto);
	}

}
