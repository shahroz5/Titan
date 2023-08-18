/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.UUID_REGEX;

import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.StateTaxDetailsDto;
import com.titan.poss.location.dto.request.StateTaxMappingCreateDto;
import com.titan.poss.location.dto.request.StateTaxMappingUpdateDto;
import com.titan.poss.location.dto.response.StateTaxMappingDto;
import com.titan.poss.location.dto.response.TaxDetailsDto;
import com.titan.poss.location.service.StateTaxService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/state-taxes")
@Api(tags = { "state-tax-controller" })
@Validated
public class StateTaxController {

	@Autowired
	private StateTaxService stateTaxService;

	private static final String STATE_TAX_VIEW_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.TAX_STATE_TAX_VIEW + "' )";

	private static final String STATE_TAX_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.TAX_STATE_TAX_ADD_EDIT + "' )";

	/**
	 * This method will return the list of StateTax details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StateTaxDto>>
	 */
	@PreAuthorize(STATE_TAX_VIEW_PERMISSION)
	@ApiOperation(value = "API to get the list of StateTax details", notes = "This API will get the list of StateTax details based on **isActive** <br/> if **isActive** is null, then it will get all the results matching the criteria.")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<StateTaxMappingDto>> listStateTax(
			@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) String stateName,
			@RequestParam(name = "isPageable", required = false) Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		if (BooleanUtils.isFalse(isPageable))
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		return stateTaxService.listStateTax(isActive, stateName, pageable);
	}

	/**
	 * This method will return the StateTax details based on the id.
	 * 
	 * @param id
	 * @return StateTaxDto
	 */
	@PreAuthorize(STATE_TAX_VIEW_PERMISSION)
	@ApiOperation(value = "API to get the StateTax details based on the id", notes = "This API will get the StateTax details based on the **id**")
	@GetMapping(value = "/{id}")
	public StateTaxMappingDto getStateTax(@PathVariable("id") @PatternCheck(regexp = UUID_REGEX) String id) {
		return stateTaxService.getStateTax(id);
	}

	/**
	 * This method will save the StateTax details.
	 * 
	 * @param stateTaxMappingCreateDto
	 * @return StateTaxMappingDto
	 */
	@PreAuthorize(STATE_TAX_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to save the StateTax details", notes = "This API will save the StateTax details")
	@PostMapping
	public StateTaxMappingDto addStateTax(@RequestBody @Valid StateTaxMappingCreateDto stateTaxMappingCreateDto) {

		return stateTaxService.addStateTax(stateTaxMappingCreateDto);
	}

	/**
	 * This method will update the StateTax details.
	 * 
	 * @param id
	 * @param stateTaxMappingUpdateDto
	 * @return StateTaxUpdateDto
	 */
	@PreAuthorize(STATE_TAX_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to update the StateTax details", notes = "This API will update the StateTax details")
	@PatchMapping(value = "/{id}")
	public StateTaxMappingDto updateStateTax(@PathVariable("id") @PatternCheck(regexp = UUID_REGEX) String id,
			@RequestBody @Valid StateTaxMappingUpdateDto stateTaxMappingUpdateDto) {

		return stateTaxService.updateStateTax(id, stateTaxMappingUpdateDto);
	}

	/**
	 * 
	 * @param stateTaxMappingId
	 * @return TaxDetailsDto
	 */
	@ApiOperation(value = "This API will use to get the tax details object based on stateTaxMappingId", notes = "This API will give the mapped tax details with respect to particular state.")
	@GetMapping(value = "/{stateTaxMappingId}/taxDetails")
	public ListResponse<TaxDetailsDto> getTaxDetails(
			@PathVariable("stateTaxMappingId") @PatternCheck(regexp = UUID_REGEX) String stateTaxMappingId) {
		return stateTaxService.getTaxDetails(stateTaxMappingId);
	}

	/**
	 * 
	 * @param stateTaxMappingId
	 * @param stateTaxDetailsDto
	 * @return StateTaxDetailsDto
	 */
	@ApiOperation(value = "This API will use to save/update the tax details for the taxClassCode based on stateTaxMappingId.", notes = "This API will use to map the tax details with tax class code based on stateTaxMappingId")
	@PatchMapping(value = "/{stateTaxMappingId}/taxDetails")
	public StateTaxDetailsDto updateTaxDetails(
			@PathVariable("stateTaxMappingId") @PatternCheck(regexp = UUID_REGEX) String stateTaxMappingId,
			@RequestBody @Valid StateTaxDetailsDto stateTaxDetailsDto) {
		return stateTaxService.updateStateTaxDetails(stateTaxMappingId, stateTaxDetailsDto);
	}
}
