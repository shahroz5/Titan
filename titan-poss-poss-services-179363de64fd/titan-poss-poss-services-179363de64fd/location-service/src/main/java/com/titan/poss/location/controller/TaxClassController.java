/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.TAX_CLASS_CODE_REGEX;

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
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.TaxClassDto;
import com.titan.poss.location.dto.request.TaxClassUpdateDto;
import com.titan.poss.location.service.TaxClassService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/tax-classes")
@Api(tags = { "tax-class-controller" })
@Validated
public class TaxClassController {

	@Autowired
	private TaxClassService taxClassService;

	private static final String TAX_CLASS_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.TAX_TAX_CLASS_VIEW + "' )";

	private static final String TAX_CLASS_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.TAX_TAX_CLASS_ADD_EDIT + "' )";





	/**
	 * This method will return the list of TaxClass details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TaxClassDto>>
	 */
	@ApiOperation(value = "API to get the list of TaxClass details", notes = "This API will get the list of TaxClass details based on **isActive** <br/> if **isActive** is null, then it will get all the results matching the criteria.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(TAX_CLASS_VIEW_PERMISSION)
	public PagedRestResponse<List<TaxClassDto>> listTaxClass(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable) {

		return taxClassService.listTaxClass(isActive, pageable, isPageable);
	}





	/**
	 * This method will return the TaxClass details based on the taxClassCode.
	 * 
	 * @param taxClassCode
	 * @return TaxClassDto
	 */
	@ApiOperation(value = "API to get the TaxClass details based on the taxClassCode", notes = "This API will get the TaxClass details based on the **taxClassCode**")
	@GetMapping(value = "/{taxClassCode}")
	@PreAuthorize(TAX_CLASS_VIEW_PERMISSION)
	public TaxClassDto getTaxClass(@PathVariable("taxClassCode") @PatternCheck(regexp = TAX_CLASS_CODE_REGEX) String taxClassCode) {
		return taxClassService.getTaxClass(taxClassCode);
	}





	/**
	 * This method will save the TaxClass details.
	 * 
	 * @param taxClassDto
	 * @param bindingResult
	 * @return TaxClassDto
	 */
	@ApiOperation(value = "API to save the TaxClass details", notes = "This API will save the TaxClass details")
	@PostMapping
	@PreAuthorize(TAX_CLASS_ADD_EDIT_PERMISSION)
	public TaxClassDto addTaxClass(@RequestBody @Valid TaxClassDto taxClassDto) {
		
		return taxClassService.addTaxClass(taxClassDto);
	}





	/**
	 * This method will update the TaxClass details.
	 * 
	 * @param taxClassCode
	 * @param taxClassDto
	 * @param bindingResult
	 * @return TaxClassUpdateDto
	 */
	@ApiOperation(value = "API to update the TaxClass details", notes = "This API will update the TaxClass details")
	@PatchMapping(value = "/{taxClassCode}")
	@PreAuthorize(TAX_CLASS_ADD_EDIT_PERMISSION)
	public TaxClassDto updateTaxClass(@PathVariable("taxClassCode") @PatternCheck(regexp = TAX_CLASS_CODE_REGEX) String taxClassCode,
			@RequestBody @Valid TaxClassUpdateDto taxClassUpdateDto) {
		
		return taxClassService.updateTaxClass(taxClassCode, taxClassUpdateDto);
	}
}
