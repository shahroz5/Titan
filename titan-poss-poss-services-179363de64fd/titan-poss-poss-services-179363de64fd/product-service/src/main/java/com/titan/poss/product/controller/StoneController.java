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
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dto.StoneDto;
import com.titan.poss.product.dto.request.StoneUpdateDto;
import com.titan.poss.product.service.StoneService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/stones")
public class StoneController {

	@Autowired
	private StoneService stoneService;

	private static final String PRODUCT_STONE_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_STONE_VIEW + "' )";
	private static final String PRODUCT_STONE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_STONE_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Stone details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StoneDto>>
	 */
	@ApiOperation(value = "View the list of Stone details", notes = "This API returns the list of Stone details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PRODUCT_STONE_VIEW_PERMISSION)
	public PagedRestResponse<List<StoneDto>> listStone(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return stoneService.listStone(isActive, pageable);
	}

	/**
	 * This method will return the Stone details based on the stoneCode.
	 * 
	 * @param stoneCode
	 * @return StoneDto
	 */
	@ApiOperation(value = "View the Stone details based on the stoneCode", notes = "This API returns the Stone details based on the **stoneCode**")
	@GetMapping(value = "/{stoneCode}")
	@PreAuthorize(PRODUCT_STONE_VIEW_PERMISSION)
	public StoneDto getStone(
			@PathVariable("stoneCode") @PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX) String stoneCode) {
		return stoneService.getStone(stoneCode);
	}

	/**
	 * This method will save the Stone details.
	 * 
	 * @param stoneDto
	 * @param bindingResult
	 * @return StoneDto
	 */
	@ApiOperation(value = "Save the Stone details", notes = "This API saves the Stone details")
	@PostMapping
	@PreAuthorize(PRODUCT_STONE_ADD_EDIT_PERMISSION)
	public StoneDto addStone(@RequestBody @Valid StoneDto stoneDto) {
		return stoneService.addStone(stoneDto);
	}

	/**
	 * This method will update the Stone details.
	 * 
	 * @param stoneCode
	 * @param stoneUpdateDto
	 * @param bindingResult
	 * @return StoneDto
	 */
	@ApiOperation(value = "Update the Stone details", notes = "This API updates the Stone details <br/> if **isActive** is false, then it will be soft deleted based on the **stoneCode**")
	@PatchMapping(value = "/{stoneCode}")
	@PreAuthorize(PRODUCT_STONE_ADD_EDIT_PERMISSION)
	public StoneDto updateStone(
			@PathVariable("stoneCode") @PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX) String stoneCode,
			@RequestBody @Valid StoneUpdateDto stoneUpdateDto) {

		return stoneService.updateStone(stoneCode, stoneUpdateDto);

	}

	/**
	 * This method will return the Stone details based on the stoneCode.
	 * 
	 * @param stoneCode
	 * @return StoneDto
	 */
	@ApiOperation(value = "View the Stone details based on the stoneCode", notes = "This API returns the Stone details based on the **stoneCode**")
	@GetMapping(value = "/datasync/{stoneCode}")
	@PreAuthorize(PRODUCT_STONE_VIEW_PERMISSION)
	public StoneDao getStoneDao(
			@PathVariable("stoneCode") @PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX) String stoneCode) {
		return stoneService.getStoneDao(stoneCode);
	}
}
