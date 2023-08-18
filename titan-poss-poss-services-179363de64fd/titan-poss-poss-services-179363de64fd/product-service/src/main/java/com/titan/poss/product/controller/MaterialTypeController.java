/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.MaterialTypeDto;
import com.titan.poss.product.dto.request.MaterialTypeUpdateDto;
import com.titan.poss.product.service.MaterialTypeService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/material-types")
public class MaterialTypeController {

	@Autowired
	private MaterialTypeService materialTypeService;

	private static final String MATERIAL_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_MATERIAL_TYPE_ADD_EDIT + " ' )";

	private static final String MATERIAL_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_MATERIAL_TYPE_VIEW + " ' )";

	/**
	 * This method will return the list of Material type details based on the
	 * materialType and isActive
	 * 
	 * @param materialType
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialTypeDto>>
	 */
	@PreAuthorize(MATERIAL_VIEW_PERMISSION)
	@ApiOperation(value = "View the list of Material type details", notes = "This API returns the list of Material type details based on **materialType** and **isActive**")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<MaterialTypeDto>> listMaterial(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return materialTypeService.listMaterial(isActive, pageable);
	}

	/**
	 * This method will return the Material type details based on the
	 * materialTypeCode.
	 * 
	 * @param materialTypeCode
	 * @return MaterialTypeDto
	 */
	@PreAuthorize(MATERIAL_VIEW_PERMISSION)
	@ApiOperation(value = "View the Material type details based on the materialTypeCode", notes = "This API returns the Material type details based on the **materialTypeCode**")
	@GetMapping(value = "/{materialTypeCode}")
	public MaterialTypeDto getMaterial(
			@PathVariable("materialTypeCode") @PatternCheck(regexp = RegExConstants.MATERIAL_TYPE_CODE_REGEX) String materialTypeCode) {
		return materialTypeService.getMaterial(materialTypeCode);
	}

	/**
	 * This method will save the Material type details.
	 * 
	 * @param materialTypeDto
	 * @param bindingResult
	 * @return MaterialtypeDto
	 */
	@PreAuthorize(MATERIAL_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Save the Material type details", notes = "This API saves the Material type details")
	@PostMapping
	public MaterialTypeDto addMaterial(@RequestBody @Valid MaterialTypeDto materialTypeDto) {

		return materialTypeService.addMaterial(materialTypeDto);
	}

	/**
	 * This method will update the Material type details.
	 * 
	 * @param materialTypeCode
	 * @param materialTypeUpdateDto
	 * @param bindingResult
	 * @return MateriaTypelDto
	 */
	@PreAuthorize(MATERIAL_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Update the Material type details", notes = "This API updates the Material type details <br/> if **isActive** is false, then it will be soft deleted based on the **materialTypeCode**")
	@PatchMapping(value = "/{materialTypeCode}")
	public MaterialTypeDto updateMaterial(
			@PathVariable("materialTypeCode") @PatternCheck(regexp = RegExConstants.MATERIAL_TYPE_CODE_REGEX) String materialTypeCode,
			@RequestBody @Valid MaterialTypeUpdateDto materialUpdateDto) {

		return materialTypeService.updateMaterial(materialTypeCode, materialUpdateDto);
	}

}
