/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.response.ProductPriceDto;
import com.titan.poss.product.service.PriceService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@Validated
@RequestMapping("product/v2/product-price")
public class ProductPriceController {

	@Autowired
	private PriceService priceService;
	/**
	 * This API returns the list of product price mapping details
	 * 
	 * @param isActive
	 * @param itemCode
	 * @param priceGroup
	 * @param pageable
	 * @return PagedRestResponse<List<PriceDto>>
	 */

	private static final String PRODUCT_PRICE_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_PRICE_VIEW + " ' )";

	@PreAuthorize(PRODUCT_PRICE_VIEW_PERMISSION)
	@ApiOperation(value = "View the list of Product Price details", notes = "This API returns the list of product price details. Response will be pageable")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<ProductPriceDto>> listProductPrice(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode,
			@ApiIgnore Pageable pageable) {
		return priceService.listProductPrice(productGroupCode, pageable);
	}

}
