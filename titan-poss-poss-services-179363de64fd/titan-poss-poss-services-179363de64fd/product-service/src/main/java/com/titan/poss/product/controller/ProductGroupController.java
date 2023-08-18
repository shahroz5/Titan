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
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dto.request.ProductGroupUpdateDto;
import com.titan.poss.product.service.ProductGroupService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/product-groups")
public class ProductGroupController {

	@Autowired
	private ProductGroupService productGroupService;

	private static final String PRODUCT_GROUP_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_CFA_PRODUCT_CODE_VIEW + "' )";
	private static final String PRODUCT_GROUP_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_CFA_PRODUCT_CODE_ADD_EDIT + "' )";

	/**
	 * This method will return the list of ProductGroup details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ProductGroupDto>>
	 */
	@ApiOperation(value = "View the list of ProductGroup details", notes = "This API returns the list of ProductGroup details based on **isActive** & **productGroupCode**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PRODUCT_GROUP_VIEW_PERMISSION)
	public PagedRestResponse<List<ProductGroupDto>> listProductGroup(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode,
			@ApiParam(name = "pricingType", value = "Provide to search by 'pricingType'", required = false) @RequestParam(name = "pricingType", required = false) @PatternCheck(regexp = RegExConstants.PRICING_TYPE) String pricingType,
			@RequestParam(required = false) Boolean isConversionEnabled,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return productGroupService.listProductGroup(isActive, productGroupCode, pricingType, isConversionEnabled,
				isPageable, pageable);
	}

	/**
	 * This method will return the ProductGroup details based on the
	 * productGroupCode.
	 * 
	 * @param productGroupCode
	 * @return ProductGroupDto
	 */
	@ApiOperation(value = "View the ProductGroup details based on the productGroupCode", notes = "This API returns the ProductGroup details based on the **productGroupCode**")
	@GetMapping(value = "/{productGroupCode}")
	//@PreAuthorize(PRODUCT_GROUP_VIEW_PERMISSION)
	public ProductGroupDto getProductGroup(
			@PathVariable("productGroupCode") @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode) {
		return productGroupService.getProductGroup(productGroupCode);
	}

	/**
	 * This method will save the ProductGroup details.
	 * 
	 * @param productGroupDto
	 * @param bindingResult
	 * @return ProductGroupDto
	 */
	// @formatter:off
	@ApiOperation(value = "Save the ProductGroup details", notes = "This API saves the ProductGroup details.<br>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/product-service/src/main/resources/com/titan/poss/product/json/ProductGroupConfigDetails.json\">"
			+ "PRODUCT_GROUP_CONFIG </a></li>" + "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/product-service/src/main/resources/com/titan/poss/product/json/ProductGroupPricingDetails.json\">"
			+ "PRODUCT_GROUP_PRICE </a></li>" + "<br><br>**orgCode** should be **TJEW**")
	// @formatter:on
	@PostMapping
	@PreAuthorize(PRODUCT_GROUP_ADD_EDIT_PERMISSION)
	public ProductGroupDto addProductGroup(
			@RequestBody @Valid @ApiParam(name = "body", value = "product group object that needs to be created", required = true) ProductGroupDto productGroupDto) {
		return productGroupService.addProductGroup(productGroupDto);
	}

	/**
	 * This method will update the ProductGroup details.
	 * 
	 * @param productGroupCode
	 * @param productGroupUpdateDto
	 * @param bindingResult
	 * @return ProductGroupDto
	 */
	// @formatter:off
	@ApiOperation(value = "Update the ProductGroup details", notes = "This API updates the ProductGroup details <br/> if **isActive** is false, then it will be soft deleted based on the **productGroupCode**"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/product-service/src/main/resources/com/titan/poss/product/json/ProductGroupConfigDetails.json\">"
			+ "PRODUCT_GROUP_CONFIG </a></li>" + "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/product-service/src/main/resources/com/titan/poss/product/json/ProductGroupPricingDetails.json\">"
			+ "PRODUCT_GROUP_PRICE </a></li>" + "<br><br>**orgCode** should be **TJEW**")
	// @formatter:on
	@PatchMapping(value = "/{productGroupCode}")
	@PreAuthorize(PRODUCT_GROUP_ADD_EDIT_PERMISSION)
	public ProductGroupDto updateProductGroup(
			@PathVariable("productGroupCode") @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "product group object that needs to be updated", required = true) ProductGroupUpdateDto productGroupUpdateDto) {
		return productGroupService.updateProductGroup(productGroupCode, productGroupUpdateDto);
	}

	/**
	 * This method will return the ProductGroup details based on the
	 * productGroupCode.
	 * 
	 * @param productGroupCode
	 * @return ProductGroupDto
	 */
	@ApiOperation(value = "View the ProductGroup details based on the productGroupCode", notes = "This API returns the ProductGroup details based on the **productGroupCode**")
	@GetMapping(value = "/datasync/{productGroupCode}")
	@PreAuthorize(IS_API_USER)
	public ProductGroupDao getProductGroupDao(
			@PathVariable("productGroupCode") @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode) {
		return productGroupService.getProductGroupDao(productGroupCode);
	}
}
