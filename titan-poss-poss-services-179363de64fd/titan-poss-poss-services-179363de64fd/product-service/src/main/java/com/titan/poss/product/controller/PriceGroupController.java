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
import com.titan.poss.product.dto.PriceGroupDto;
import com.titan.poss.product.dto.request.PriceGroupUpdateDto;
import com.titan.poss.product.service.PriceGroupService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/price-groups")
public class PriceGroupController {

	@Autowired
	private PriceGroupService priceGroupService;


	private static final String PRODUCT_PRICE_GROUP_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICING_PRICE_GROUP_VIEW + "' )";
	private static final String PRODUCT_PRICE_GROUP_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICING_PRICE_GROUP_ADD_EDIT + "' )";





	/**
	 * This method will return the list of PriceGroup details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PriceGroupDto>>
	 */
	@ApiOperation(value = "View the list of PriceGroup details", notes = "This API returns the list of PriceGroup details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PRODUCT_PRICE_GROUP_VIEW_PERMISSION)
	public PagedRestResponse<List<PriceGroupDto>> listPriceGroup(@RequestParam(required = false) Boolean isActive,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return priceGroupService.listPriceGroup(isActive, isPageable, pageable);
	}





	/**
	 * This method will return the PriceGroup details based on the priceGroup.
	 * 
	 * @param priceGroup
	 * @return PriceGroupDto
	 */
	@ApiOperation(value = "View the PriceGroup details based on the priceGroup", notes = "This API returns the PriceGroup details based on the **priceGroup**")
	@GetMapping(value = "/{priceGroup}")
	@PreAuthorize(PRODUCT_PRICE_GROUP_VIEW_PERMISSION)
	public PriceGroupDto getPriceGroup(@PathVariable("priceGroup")@PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX) String priceGroup) {
		return priceGroupService.getPriceGroup(priceGroup);
	}





	/**
	 * This method will save the PriceGroup details.
	 * 
	 * @param priceGroupDto
	 * @param bindingResult
	 * @return PriceGroupDto
	 */
	@ApiOperation(value = "Save the PriceGroup details", notes = "This API saves the PriceGroup details")
	@PostMapping
	@PreAuthorize(PRODUCT_PRICE_GROUP_ADD_EDIT_PERMISSION)
	public PriceGroupDto addPriceGroup(@RequestBody @Valid PriceGroupDto priceGroupDto) {
		return priceGroupService.addPriceGroup(priceGroupDto);
	}





	/**
	 * This method will update the PriceGroup details.
	 * 
	 * @param priceGroup
	 * @param priceGroupUpdateDto
	 * @param bindingResult
	 * @return PriceGroupDto
	 */
	@ApiOperation(value = "Update the PriceGroup details", notes = "This API updates the PriceGroup details <br/> if **isActive** is false, then it will be soft deleted based on the **priceGroup**")
	@PatchMapping(value = "/{priceGroup}")
	@PreAuthorize(PRODUCT_PRICE_GROUP_ADD_EDIT_PERMISSION)
	public PriceGroupDto updatePriceGroup(@PathVariable("priceGroup")@PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX) String priceGroup,
			@RequestBody @Valid PriceGroupUpdateDto priceGroupUpdateDto) {

		return priceGroupService.updatePriceGroup(priceGroup, priceGroupUpdateDto);
	}
}

