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
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.MaterialDto;
import com.titan.poss.product.dto.request.MaterialUpdateDto;
import com.titan.poss.product.service.MaterialService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/materials")
public class MaterialController {

	@Autowired
	private MaterialService materialService;

	private static final String MATERIAL_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_MATERIAL_ADD_EDIT + " ' )";

	private static final String MATERIAL_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_MATERIAL_VIEW + " ' )";

	/**
	 * This method will return the list of Material details based on the
	 * materialType and isActive
	 * 
	 * @param materialType
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialDto>>
	 */
	@PreAuthorize(MATERIAL_VIEW_PERMISSION)
	@ApiOperation(value = "View the list of Material details", notes = "This API returns the list of Material details based on **materialType** and **isActive**")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<MaterialDto>> listMaterial(@RequestParam(required = false) String materialTypeCode,
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable) {
		return materialService.listMaterial(materialTypeCode, isActive, pageable);
	}

	/**
	 * This method will return the Material details based on the materialCode.
	 * 
	 * @param materialCode
	 * @return MaterialDto
	 */
	@PreAuthorize(MATERIAL_VIEW_PERMISSION)
	@ApiOperation(value = "View the Material details based on the materialCode", notes = "This API returns the Material details based on the **materialCode**")
	@GetMapping(value = "/{materialCode}")
	public MaterialDto getMaterial(@PathVariable("materialCode") String materialCode) {
		return materialService.getMaterial(materialCode);
	}

	/**
	 * This method will save the Material details.
	 * 
	 * @param materialDto
	 * @param bindingResult
	 * @return MaterialDto
	 */
	@PreAuthorize(MATERIAL_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Save the Material details", notes = "This API saves the Material details")
	@PostMapping
	public MaterialDto addMaterial(@RequestBody @Valid MaterialDto materialDto) {

		return materialService.addMaterial(materialDto);
	}

	/**
	 * This method will update the Material details.
	 * 
	 * @param materialCode
	 * @param materialUpdateDto
	 * @param bindingResult
	 * @return MaterialDto
	 */
	@PreAuthorize(MATERIAL_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Update the Material details", notes = "This API updates the Material details <br/> if **isActive** is false, then it will be soft deleted based on the **materialCode**")
	@PatchMapping(value = "/{materialCode}")
	public MaterialDto updateMaterial(@PathVariable("materialCode") String materialCode,
			@RequestBody @Valid MaterialUpdateDto materialUpdateDto) {

		return materialService.updateMaterial(materialCode, materialUpdateDto);
	}

}
