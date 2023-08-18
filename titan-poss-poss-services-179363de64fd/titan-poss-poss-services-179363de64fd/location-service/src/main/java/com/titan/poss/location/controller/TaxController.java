/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.TAX_CODE_REGEX;

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
import com.titan.poss.location.dto.TaxDto;
import com.titan.poss.location.dto.request.TaxUpdateDto;
import com.titan.poss.location.service.TaxService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/taxes")
@Api(tags = { "tax-controller" })
@Validated
public class TaxController {

	@Autowired
	private TaxService taxService;

	private static final String TAX_VIEW_PERMISSION = "hasPermission(true,'" + LocationACLConstants.TAX_TAX_MASTER_VIEW
			+ "' )";

	private static final String TAX_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.TAX_TAX_MASTER_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Tax details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TaxDto>>
	 */
	@ApiOperation(value = "API to get the list of Tax details", notes = "This API will get the list of Tax details based on **isActive** <br/> if **isActive** is null, then it will get all the results matching the criteria.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(TAX_VIEW_PERMISSION)
	public PagedRestResponse<List<TaxDto>> listTax(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable, @RequestParam(required = false) String taxSystem) {

		return taxService.listTax(isActive, pageable, taxSystem);
	}

	/**
	 * This method will return the Tax details based on the taxCode.
	 * 
	 * @param taxCode
	 * @return TaxDto
	 */
	@ApiOperation(value = "API to get the Tax details based on the taxCode", notes = "This API will get the Tax details based on the **taxCode**")
	@GetMapping(value = "/{taxCode}")
	@PreAuthorize(TAX_VIEW_PERMISSION)
	public TaxDto getTax(@PathVariable("taxCode") @PatternCheck(regexp = TAX_CODE_REGEX) String taxCode) {

		return taxService.getTax(taxCode);
	}

	/**
	 * This method will save the Tax details.
	 * 
	 * @param taxDto
	 * @return TaxDto
	 */
	@ApiOperation(value = "API to save the Tax details", notes = "This API will save the Tax details")
	@PostMapping
	@PreAuthorize(TAX_ADD_EDIT_PERMISSION)
	public TaxDto addTax(@RequestBody @Valid TaxDto taxDto) {

		return taxService.addTax(taxDto);
	}

	/**
	 * This method will update the Tax details.
	 * 
	 * @param taxCode
	 * @return TaxUpdateDto
	 */
	@ApiOperation(value = "API to update the Tax details", notes = "This API will update the Tax details")
	@PatchMapping(value = "/{taxCode}")
	@PreAuthorize(TAX_ADD_EDIT_PERMISSION)
	public TaxDto updateTax(@PathVariable("taxCode") @PatternCheck(regexp = TAX_CODE_REGEX) String taxCode,
			@RequestBody @Valid TaxUpdateDto taxUpdateDto) {

		return taxService.updateTax(taxCode, taxUpdateDto);
	}
}
