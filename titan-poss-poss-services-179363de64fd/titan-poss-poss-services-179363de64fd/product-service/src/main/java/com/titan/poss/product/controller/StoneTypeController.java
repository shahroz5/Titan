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
import com.titan.poss.product.dao.StoneTypeDao;
import com.titan.poss.product.dto.StoneTypeDto;
import com.titan.poss.product.dto.request.StoneTypeUpdateDto;
import com.titan.poss.product.service.StoneTypeService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/stone-types")
public class StoneTypeController {

	@Autowired
	private StoneTypeService stoneTypeService;

	private static final String STONE_TYPE_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_STONE_TYPE_VIEW + "' )";
	private static final String STONE_TYPE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_STONE_TYPE_ADD_EDIT + "' )";





	/**
	 * This method will return the list of StoneType details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StoneTypeDto>>
	 */
	@ApiOperation(value = "View the list of StoneType details", notes = "This API returns the list of StoneType details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(STONE_TYPE_VIEW_PERMISSION)
	public PagedRestResponse<List<StoneTypeDto>> listStoneType(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return stoneTypeService.listStoneType(isActive, pageable);
	}





	/**
	 * This method will return the StoneType details based on the stoneTypeCode.
	 * 
	 * @param stoneTypeCode
	 * @return StoneTypeDto
	 */
	@ApiOperation(value = "View the StoneType details based on the stoneTypeCode", notes = "This API returns the StoneType details based on the **stoneTypeCode**")
	@GetMapping(value = "/{stoneTypeCode}")
	@PreAuthorize(STONE_TYPE_VIEW_PERMISSION)
	public StoneTypeDto getStoneType(@PathVariable("stoneTypeCode")@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX) String stoneTypeCode) {
		return stoneTypeService.getStoneType(stoneTypeCode);
	}





	/**
	 * This method will save the StoneType details.
	 * 
	 * @param stoneTypeDto
	 * @param bindingResult
	 * @return StoneTypeDto
	 */
	@ApiOperation(value = "Save the StoneType details", notes = "This API saves the StoneType details")
	@PostMapping
	@PreAuthorize(STONE_TYPE_ADD_EDIT_PERMISSION)
	public StoneTypeDto addStoneType(@RequestBody @Valid StoneTypeDto stoneTypeDto) {
		return stoneTypeService.addStoneType(stoneTypeDto);
	}





	/**
	 * This method will update the StoneType details.
	 * 
	 * @param stoneTypeCode
	 * @param stoneTypeUpdateDto
	 * @param bindingResult
	 * @return StoneTypeDto
	 */
	@ApiOperation(value = "Update the StoneType details", notes = "This API updates the StoneType details <br/> if **isActive** is false, then it will be soft deleted based on the **stoneTypeCode**")
	@PatchMapping(value = "/{stoneTypeCode}")
	@PreAuthorize(STONE_TYPE_ADD_EDIT_PERMISSION)
	public StoneTypeDto updateStoneType(@PathVariable("stoneTypeCode")@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX) String stoneTypeCode,
			@RequestBody @Valid StoneTypeUpdateDto stoneTypeUpdateDto) {

		return stoneTypeService.updateStoneType(stoneTypeCode, stoneTypeUpdateDto);
	}

	/**
	 * This method will return the StoneType details based on the stoneTypeCode.
	 * 
	 * @param stoneTypeCode
	 * @return StoneTypeDto
	 */
	@ApiOperation(value = "View the StoneType details based on the stoneTypeCode", notes = "This API returns the StoneType details based on the **stoneTypeCode**")
	@GetMapping(value = "/datasync/{stoneTypeCode}")
	@PreAuthorize(STONE_TYPE_VIEW_PERMISSION)
	public StoneTypeDao getStoneTypeDao(
			@PathVariable("stoneTypeCode") @PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX) String stoneTypeCode) {
		return stoneTypeService.getStoneTypeDao(stoneTypeCode);
	}

}
