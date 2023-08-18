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
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.ComplexityPriceGroupMappingDto;
import com.titan.poss.product.dto.request.CompPriceGrpCreateDto;
import com.titan.poss.product.dto.request.CompPriceGrpUpdateDto;
import com.titan.poss.product.dto.response.ComplexitityPriceGroupDTOList;
import com.titan.poss.product.service.ComplexityPriceGroupService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/complexity-price-groups")
public class ComplexityPriceGroupController {

	@Autowired
	private ComplexityPriceGroupService complexityPriceGroupService;

	private static final String PRODUCT_COMPLEXITY_PRICE_GROUP_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICING_COMPLEXITY_PRICE_GROUP_MAPPING_VIEW + "' )";
	private static final String PRODUCT_COMPLEXITY_PRICE_GROUP_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICING_COMPLEXITY_PRICE_GROUP_MAPPING_ADD_EDIT + "' )";

	@ApiOperation(value = "View the list of Complexity price group mapping", notes = "This API returns the list of Complexity price group mapping. Response will be pageable and sorting is available."
			+ " **complexityCode,priceGroup & isActive** is search parameter and both are optional.")
	@ApiPageable
	@GetMapping
	@PreAuthorize(PRODUCT_COMPLEXITY_PRICE_GROUP_VIEW_PERMISSION)
	public PagedRestResponse<List<ComplexityPriceGroupMappingDto>> listComplexityPriceGroup(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX)String complexityCode,
			@RequestParam(required = false)@PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX) String priceGroup,
			@ApiIgnore Pageable pageable, @RequestParam(required = false) Boolean isActive) {
		return complexityPriceGroupService.listComplexityPriceGroup(complexityCode, priceGroup, pageable, isActive);
	}

	@ApiOperation(value = "View the Complexity price group mapping details based on the id", notes = "This API returns the Complexity details based on the **id**"
			+ " Here **id** is mandatory fields.")
	@GetMapping(value = "{id}")
	@PreAuthorize(PRODUCT_COMPLEXITY_PRICE_GROUP_VIEW_PERMISSION)
	public ComplexityPriceGroupMappingDto getComplexityPriceGroup(@PathVariable("id")@PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		return complexityPriceGroupService.getComplexityPriceGroup(id);
	}

	@ApiOperation(value = "Add new Complexity price group mapping details based on the complexityCode and priceGroup", notes = "This API adds new Complexity details based on the **complexityCode & priceGroup**."
			+ " Here **complexityCode & priceGroup** cannot be duplicate.")
	@PostMapping
	@PreAuthorize(PRODUCT_COMPLEXITY_PRICE_GROUP_ADD_EDIT_PERMISSION)
	public ComplexityPriceGroupMappingDto addComplexityPriceGroup(
			@RequestBody @Valid CompPriceGrpCreateDto compPriceGrpCreateDto) {
		return complexityPriceGroupService.addComplexityPriceGroup(compPriceGrpCreateDto);
	}

	@ApiOperation(value = "Update Complexity price group mapping details based on the id", notes = "This API updates new Complexity details based on the **id**."
			+ " Here **id** are mandatory.")
	@PatchMapping(value = "{id}")
	@PreAuthorize(PRODUCT_COMPLEXITY_PRICE_GROUP_ADD_EDIT_PERMISSION)
	public ComplexityPriceGroupMappingDto updateComplexityPriceGroup(
			@PathVariable("id")@PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid CompPriceGrpUpdateDto compPriceGrpUpdateDto) {
		return complexityPriceGroupService.updateComplexityPriceGroup(id, compPriceGrpUpdateDto);
	}
	
	@ApiOperation(value = "API to upload .csv document", notes = "API to upload .csv file having complexitycode and priceGroup.<br/>")
	@PostMapping("/uploadItemsCSV")
	public ComplexitityPriceGroupDTOList uploadFile(@RequestParam(required = true) MultipartFile reqFile) {

		return complexityPriceGroupService.uploadFile(reqFile);
	}

}
