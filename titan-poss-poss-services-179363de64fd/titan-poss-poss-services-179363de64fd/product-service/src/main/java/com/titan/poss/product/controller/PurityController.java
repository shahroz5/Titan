/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.controller;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.dto.request.PurityCreateDto;
import com.titan.poss.product.service.PurityService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/purities")
public class PurityController {

	@Autowired
	private PurityService purityService;

	private static final String PRODUCT_PURITY_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_PURITY_MASTER_VIEW + "' )";
	private static final String PRODUCT_PURITY_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_PURITY_MASTER_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Purity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PurityDto>>
	 */
	@ApiOperation(value = "View the list of Purity details", notes = "This API returns the list of Purity details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PRODUCT_PURITY_VIEW_PERMISSION)
	public PagedRestResponse<List<PurityDto>> listPurity(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) BigDecimal purity,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX) String itemTypeCode,
			@ApiIgnore Pageable pageable) {
		return purityService.listPurity(isActive, purity, itemTypeCode, pageable);
	}

	/**
	 * This method will save the Purity details.
	 * 
	 * @param purityCreateDto
	 * @param bindingResult
	 * @return PurityDto
	 */
	@ApiOperation(value = "Save the Purity details", notes = "This API saves the Purity details")
	@PostMapping
	@PreAuthorize(PRODUCT_PURITY_ADD_EDIT_PERMISSION)
	public PurityDto addPurity(@RequestBody @Valid PurityCreateDto purityCreateDto) {
		return purityService.addPurity(purityCreateDto);
	}

}
