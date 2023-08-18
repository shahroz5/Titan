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
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dto.request.ProductCategoryUpdateDto;
import com.titan.poss.product.service.ProductCategoryService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/product-categories")
public class ProductCategoryController {

	@Autowired
	private ProductCategoryService productCategoryService;

	private static final String PRODUCT_CATEGORY_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_PRODUCT_CATEGORY_VIEW + "' )";
	private static final String PRODUCT_CATEGORY_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_PRODUCT_CATEGORY_ADD_EDIT + "' )";

	/**
	 * This method will return the list of ProductCategory details based on the
	 * isActive.
	 * 
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ProductCategoryDto>>
	 */
	@ApiOperation(value = "View the list of ProductCategory details", notes = "This API returns the list of ProductCategory details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PRODUCT_CATEGORY_VIEW_PERMISSION)
	public PagedRestResponse<List<ProductCategoryDto>> listProductCategory(
			@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) Boolean isConversionEnabled,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return productCategoryService.listProductCategory(isActive, isConversionEnabled, isPageable, pageable);
	}

	/**
	 * This method will return the ProductCategory details based on the
	 * productCategoryCode.
	 * 
	 * @param productCategoryCode
	 * @return ProductCategoryDto
	 */
	@ApiOperation(value = "View the ProductCategory details based on the productCategoryCode", notes = "This API returns the ProductCategory details based on the **productCategoryCode**")
	@GetMapping(value = "/{productCategoryCode}")
	//@PreAuthorize(PRODUCT_CATEGORY_VIEW_PERMISSION)
	public ProductCategoryDto getProductCategory(
			@PathVariable("productCategoryCode") @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategoryCode) {
		return productCategoryService.getProductCategory(productCategoryCode);
	}

	/**
	 * This method will save the ProductCategory details.
	 * 
	 * @param productCategoryDto
	 * @param bindingResult
	 * @return ProductCategoryDto
	 */
	@ApiOperation(value = "Save the ProductCategory details", notes = "This API saves the ProductCategory details"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/product-service/src/main/resources/com/titan/poss/product/json/HallmarkDetails.json\">"
			+ "HALLMARK_DETAILS </a></li>"
			+ "&nbsp;&nbsp;<li>")
	@PostMapping
	@PreAuthorize(PRODUCT_CATEGORY_ADD_EDIT_PERMISSION)
	public ProductCategoryDto addProductCategory(
			@RequestBody @Valid @ApiParam(name = "body", value = "product category object that needs to be created", required = true) ProductCategoryDto productCategoryDto) {
		return productCategoryService.addProductCategory(productCategoryDto);
	}

	/**
	 * This method will update the ProductCategory details.
	 * 
	 * @param productCategoryCode
	 * @param productCategoryUpdateDto
	 * @param bindingResult
	 * @return ProductCategoryDto
	 */
	@ApiOperation(value = "Update the ProductCategory details", notes = "This API updates the ProductCategory details <br/> if **isActive** is false, then it will be soft deleted based on the **productCategoryCode**"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/product-service/src/main/resources/com/titan/poss/product/json/HallmarkDetails.json\">"
			+ "HALLMARK_DETAILS </a></li>"
			+ "&nbsp;&nbsp;<li>")
	@PatchMapping(value = "/{productCategoryCode}")
	@PreAuthorize(PRODUCT_CATEGORY_ADD_EDIT_PERMISSION)
	public ProductCategoryDto updateProductCategory(
			@PathVariable("productCategoryCode") @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategoryCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "product category object that needs to be updated", required = true) ProductCategoryUpdateDto productCategoryUpdateDto) {
		return productCategoryService.updateProductCategory(productCategoryCode, productCategoryUpdateDto);

	}

	/**
	 * This method will return the ProductCategory details based on the
	 * productCategoryCode.
	 * 
	 * @param productCategoryCode
	 * @return ProductCategoryDto
	 */
	@ApiOperation(value = "View the ProductCategory details based on the productCategoryCode", notes = "This API returns the ProductCategory details based on the **productCategoryCode**")
	@GetMapping(value = "/datasync/{productCategoryCode}")
	@PreAuthorize(IS_API_USER)
	public ProductCategoryDao getProductCategoryDao(
			@PathVariable("productCategoryCode") @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategoryCode) {
		return productCategoryService.getProductCategoryDao(productCategoryCode);
	}
}
