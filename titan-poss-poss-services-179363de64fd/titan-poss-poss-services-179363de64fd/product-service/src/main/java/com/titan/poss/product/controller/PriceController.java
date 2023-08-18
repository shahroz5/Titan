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
import com.titan.poss.product.dto.PriceDto;
import com.titan.poss.product.service.PriceService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/prices")
public class PriceController {

	@Autowired
	private PriceService priceService;

	private static final String PRICE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICE_ADD_EDIT + " ' )";

	private static final String PRICE_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICE_VIEW + " ' )";

	/**
	 * This API returns the list of price details
	 * 
	 * @param isActive
	 * @param itemCode
	 * @param priceGroup
	 * @param pageable
	 * @return PagedRestResponse<List<PriceDto>>
	 */
	@PreAuthorize(PRICE_VIEW_PERMISSION)
	@ApiOperation(value = "View the list of Price details", notes = "This API returns the list of price details. Response will be pageable and sorting is available."
			+ " **itemCode,priceGroup & isActive** is search parameter and both are optional.")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<PriceDto>> listPrice(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX) String priceGroup,
			@ApiIgnore Pageable pageable) {
		return priceService.listPrice(isActive, itemCode, priceGroup, pageable);
	}

	/**
	 * This method will save the Price details.
	 *
	 * @param priceDto
	 * @param bindingResult
	 * @return PriceDto
	 */
	@PreAuthorize(PRICE_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Save the Price details", notes = "This API saves the Price details")
	@PostMapping
	public PriceDto addPrice(@RequestBody @Valid PriceDto priceDto) {
		return priceService.addPrice(priceDto);
	}

	/**
	 * This method will update the Price details.
	 *
	 * @param id
	 * @param priceDto
	 * @param bindingResult
	 * @return PriceDto
	 */
	@PreAuthorize(PRICE_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Update the Price details", notes = "This API updatesthe Price details<br/>"
			+ "if**isActive**is false then it will be soft deleted based on the**id**")
	@PatchMapping
	public PriceDto updatePrice(@RequestBody @Valid PriceDto priceDto) {
		return priceService.updatePrice(priceDto);
	}
}
