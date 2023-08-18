/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

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
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.BrandUpdateDto;
import com.titan.poss.location.service.BrandService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("location/v2/brands")
@Api(tags = { "brand-controller" })
public class BrandController {

	@Autowired
	private BrandService brandService;

	private static final String BRAND_SUBBRAND_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_BRAND_VIEW + " | "
			+ ProductMasterACLConstants.PRODUCT_MASTERS_SUB_BRAND_VIEW + " ' )";

	private static final String BRAND_SUBBRAND_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_MASTERS_BRAND_ADD_EDIT + " | "
			+ ProductMasterACLConstants.PRODUCT_MASTERS_SUB_BRAND_ADD_EDIT + " ' )";

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * isActive and parentBrandCode.
	 * 
	 * @param isActive
	 * @param parentBrandCode
	 * @param pageable
	 * @return PagedRestResponse<List<BrandDto>>
	 */
	@ApiOperation(value = "View the list of Brand/Sub Brand details", notes = "This API returns the list of Brand/Sub Brand details based on **isActive** and **parentBrandCode**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(BRAND_SUBBRAND_VIEW_PERMISSION)
	public PagedRestResponse<List<BrandDto>> listBrand(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String parentBrandCode,
			@ApiIgnore Pageable pageable) {
		return brandService.listBrand(isActive, parentBrandCode, pageable);
	}

	/**
	 * This method will return the Brand details based on the brandCode and
	 * parentBrandCode.
	 * 
	 * @param brandCode
	 * @param parentBrandCode
	 * @return BrandDto
	 */
	@ApiOperation(value = "View the Brand details based on the brandCode and parentBrandCode", notes = "This API returns the Brand details based on the **brandCode** and **parentBrandCode**")
	@GetMapping(value = "/{brandCode}")
	@PreAuthorize(BRAND_SUBBRAND_VIEW_PERMISSION)
	public BrandDto getBrand(
			@PathVariable("brandCode") @PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String brandCode,
			@RequestParam(required = false) String parentBrandCode) {

		return brandService.getBrand(parentBrandCode, brandCode);
	}

	/**
	 * This method will save the Brand details.
	 * 
	 * @param brandDto
	 * @param bindingResult
	 * @return BrandDto
	 */
	// @formatter:off
			@ApiOperation(value = "API to Save the Brand details", notes = "This API saves the Brand details<br><br>"
					+"if isActive is True, All Mandatory fields to be entered.</br>"
					+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks for Details Json Format:</span></b>\r\n" 
					+
					"<ul>" +
					"	<li>" +
					"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/Brand_ConfigDetails.json/\">"+
					"CONFIG_DETAILS </a>"+
					"</br></br>" +
				"  </li>" +
				"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/Brand_CustomerDetails.json/\">"+
				"CUSTOMER_DETAILS </a>"+
				"</br></br>" +
				"  </li>" +
				"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/Brand_TaxDetails.json/\">"+
				" TAX_DETAILS </a>"+
				"</br></br>" +
				"  </li>" +
				"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/Brand_CMDetails.json/\">"+
				" CM_DETAILS </a>"+
				"</br></br>" +
				"  </li>" +
				"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/Brand_PanCardDetails.json/\">"+
				" PANCARD_DETAILS </a>"+
				"</br></br>" +
				"  </li>" + "	<li>"
				+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/BrandTcsDetails.json/\">"
				+ " TCS_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
				+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/LocationTcsDetails.json/\">"
				+ " LOCATION_TCS_DETAILS </a>" + "</br></br>" + "  </li>")
	@PostMapping
	@PreAuthorize(BRAND_SUBBRAND_ADD_EDIT_PERMISSION)
	public BrandDto addBrand(@RequestBody @Valid BrandDto brandDto) {

		return brandService.addBrand(brandDto);
	}

	/**
	 * This method will update the Brand details.
	 * 
	 * @param brandCode
	 * @param brandUpdateDto
	 * @param bindingResult
	 * @return BrandDto
	 */
	@ApiOperation(value = "Update the Brand details", notes = "This API updates the Brand details <br/> if **isActive** is false, then it will be soft deleted based on the **brandCode**"
				+"if isActive is True, All Mandatory fields to be entered.</br>")
	@PatchMapping(value = "/{brandCode}")
	@PreAuthorize(BRAND_SUBBRAND_ADD_EDIT_PERMISSION)
	public BrandDto updateBrand(
			@PathVariable("brandCode") @PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String brandCode,
			@RequestBody @Valid BrandUpdateDto brandUpdateDto) {

		return brandService.updateBrand(brandCode, brandUpdateDto);
	}

	
}
