/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.config.dto.constants.RangeTypeEnum;
import com.titan.poss.config.dto.request.RangeRequestDto;
import com.titan.poss.config.dto.response.RangeResponseDto;
import com.titan.poss.config.service.RangeService;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Validated
@RestController
@RequestMapping("config/v2/ranges")
public class RangeController {

	@Autowired
	private RangeService rangeService;

	private static final String RANGE_TYPE_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ProductMasterACLConstants.PRODUCT_RANGE_MASTER_VIEW + PreAuthorizeDetails.END;

	private static final String RANGE_TYPE_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ProductMasterACLConstants.PRODUCT_RANGE_MASTER_ADD_EDIT + PreAuthorizeDetails.END;

	@ApiOperation(value = "List of range details", notes = "This API return list of range details."
			+ "<br>Search by **id** is allowed. API will return pageable response.")
	@GetMapping
	@PreAuthorize(RANGE_TYPE_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<RangeResponseDto>> listRange(@RequestParam(required = false) String id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Range Type Enum", allowableValues = "GEP_GOLD_PURITY, GEP_SILVER_PURITY, GEP_PLATINUM_PURITY, WEIGHT_TOLERANCE, TEP_CARAT, ORDER_RESIDUAL_WEIGHT, ORDER_TOTAL_WEIGHT, BGR_WEIGHT_TOLERANCE,TEP_DURATION_DAYS") @ValueOfEnum(enumClass = RangeTypeEnum.class) String rangeType,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@RequestParam(value = "isActive", required = false) Boolean isActive, @ApiIgnore Pageable pageable) {
		return rangeService.listRange(id, rangeType, isPageable, isActive, pageable);
	}

	// @formatter:off
	@ApiOperation(value = "Add/Update range details", notes = "This API is to add/update range details.<br> "
			+ "In add range there is no validation & range can be like **0-10**,**0-5**,**5-10**. But **from range** "
			+ "should be lesser than **to range**. In add range, all fields are manadatory.<br> "
			+ "For update range, range can be made as active/inactive. User cannot delete the range & if user wants to add duplicate "
			+ "range then user will get an exception.<br>")
	// @formatter:on
	@PatchMapping
	@PreAuthorize(RANGE_TYPE_ADD_EDIT_PERMISSION)
	public ListResponse<RangeResponseDto> updateRange(
			@RequestParam(required = true) @ApiParam(required = true, value = "Range Type Enum", allowableValues = "GEP_GOLD_PURITY, GEP_SILVER_PURITY, GEP_PLATINUM_PURITY, WEIGHT_TOLERANCE, TEP_CARAT, ORDER_RESIDUAL_WEIGHT, ORDER_TOTAL_WEIGHT, BGR_WEIGHT_TOLERANCE,TEP_DURATION_DAYS") @ValueOfEnum(enumClass = RangeTypeEnum.class) String rangeType,
			@RequestBody @Valid @ApiParam(name = "body", value = "'rangeDetails' object that needs to be added/updated", required = true) RangeRequestDto rangeRequestDto) {
		return rangeService.updateRange(rangeType, rangeRequestDto);
	}

	@ApiOperation(value = "Get range details by id", notes = "This API is to get existing range details by id.")
	@GetMapping("/{id}")
	@PreAuthorize(RANGE_TYPE_VIEW_PERMISSION)
	public RangeResponseDto getRange(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Range Type Enum", allowableValues = "GEP_GOLD_PURITY, GEP_SILVER_PURITY, GEP_PLATINUM_PURITY, WEIGHT_TOLERANCE, TEP_CARAT, ORDER_RESIDUAL_WEIGHT, ORDER_TOTAL_WEIGHT, BGR_WEIGHT_TOLERANCE,TEP_DURATION_DAYS") @ValueOfEnum(enumClass = RangeTypeEnum.class) String rangeType) {
		return rangeService.getRange(id, rangeType);
	}

}
