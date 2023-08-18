/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.constant.LovTypeEnum;
import com.titan.poss.inventory.dto.request.LovUpdateDto;
import com.titan.poss.inventory.dto.response.LovCreateDto;
import com.titan.poss.inventory.dto.response.LovDto;
import com.titan.poss.inventory.dto.response.LovTypesDto;
import com.titan.poss.inventory.service.LovService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("InventoryLovController")
@RequestMapping("inventory/v2/lovs")
@Validated
public class LovController {

	@Autowired
	private LovService lovService;





	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@ApiOperation(value = "View the list of lovTypes", notes = "View the list of lovTypes")
	@GetMapping(value = "/lov-types")
	public LovTypesDto getLovTypes() {
		return lovService.getLovTypes();
	}





	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@ApiOperation(value = "View the Lov details", notes = "View the Lov details based on **lovType**")
	@GetMapping(value = "/{lovType}")
	public LovDto getLov(
			@PathVariable("lovType") @ApiParam(value = "Inventory Lov type", allowableValues = "DEFECTTYPE,DEFECTCODE", required = true) @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@ApiParam(value = "Provide if you want to search LOV records by 'is active'", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive) {
		return lovService.getLov(lovType,isActive);
	}





	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@ApiOperation(value = "Create the Lov details", notes = "Create the Lov details based on **lovType**")
	@PostMapping()
	public LovCreateDto createLov(@RequestBody @Valid LovCreateDto lovCreateDto) {

		return lovService.createLov(lovCreateDto);

	}





	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@ApiOperation(value = "Update the Lov details", notes = "Update the Lov details based on **lovType**")
	@PatchMapping(value = "/{lovType}")
	public LovDto updateLov(
			@PathVariable("lovType") @ApiParam(value = "Inventory Lov type", allowableValues = "DEFECTTYPE,DEFECTCODE", required = true) @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestBody @Valid LovUpdateDto lovUpdateDto) {

		return lovService.updateLov(lovType, lovUpdateDto);
	}

}
