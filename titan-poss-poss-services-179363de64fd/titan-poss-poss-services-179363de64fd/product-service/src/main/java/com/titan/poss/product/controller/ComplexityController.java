/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_API_USER;

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
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.request.ComplexityUpdateDto;
import com.titan.poss.product.service.ComplexityService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/complexities")
public class ComplexityController {

	@Autowired
	private ComplexityService complexityService;

	private static final String COMPLEXITY_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_COMPLEXITY_VIEW + "' )";
	private static final String COMPLEXITY_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_COMPLEXITY_ADD_EDIT + "' )";





	/**
	 * This method will return the list of Complexity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityDto>>
	 */
	@ApiOperation(value = "View the list of Complexity details", notes = "This API returns the list of Complexity details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(COMPLEXITY_VIEW_PERMISSION)
	public PagedRestResponse<List<ComplexityDto>> listComplexity(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return complexityService.listComplexity(isActive, pageable);
	}





	/**
	 * This method will return the Complexity details based on the complexityCode.
	 * 
	 * @param complexityCode
	 * @return ComplexityDto
	 */
	@ApiOperation(value = "View the Complexity details based on the complexityCode", notes = "This API returns the Complexity details based on the **complexityCode**")
	@GetMapping(value = "/{complexityCode}")
	@PreAuthorize(COMPLEXITY_VIEW_PERMISSION)
	public ComplexityDto getComplexity(@PathVariable("complexityCode")@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX) String complexityCode) {
		return complexityService.getComplexity(complexityCode);
	}





	/**
	 * This method will save the Complexity details.
	 * 
	 * @param complexityDto
	 * @param bindingResult
	 * @return ComplexityDto
	 */
	@ApiOperation(value = "Save the Complexity details", notes = "This API saves the Complexity details")
	@PostMapping
	@PreAuthorize(COMPLEXITY_ADD_EDIT_PERMISSION)
	public ComplexityDto addComplexity(@RequestBody @Valid ComplexityDto complexityDto) {
		return complexityService.addComplexity(complexityDto);
	}





	/**
	 * This method will update the Complexity details.
	 * 
	 * @param complexityCode
	 * @param complexityUpdateDto
	 * @param bindingResult
	 * @return ComplexityDto
	 */
	@ApiOperation(value = "Update the Complexity details", notes = "This API updates the Complexity details <br/> if **isActive** is false, then it will be soft deleted based on the **complexityCode**")
	@PatchMapping(value = "/{complexityCode}")
	@PreAuthorize(COMPLEXITY_ADD_EDIT_PERMISSION)
	public ComplexityDto updateComplexity(@PathVariable("complexityCode")@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX) String complexityCode,
			@RequestBody @Valid ComplexityUpdateDto complexityUpdateDto) {

		return complexityService.updateComplexity(complexityCode, complexityUpdateDto);

	}

	/**
	 * This method will return the Complexity details based on the complexityCode.
	 * 
	 * @param complexityCode
	 * @return ComplexityDto
	 */
	@ApiOperation(value = "View the Complexity details based on the complexityCode", notes = "This API returns the Complexity details based on the **complexityCode**")
	@GetMapping(value = "/datasync/{complexityCode}")
	@PreAuthorize(IS_API_USER)
	public ComplexityDao getComplexityDao(@PathVariable("complexityCode")@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX) String complexityCode) {
		return complexityService.getComplexityDao(complexityCode);
	
	}

}
