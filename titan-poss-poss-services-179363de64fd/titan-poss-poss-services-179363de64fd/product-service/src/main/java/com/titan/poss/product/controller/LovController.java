/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.product.constant.LovTypeEnum;
import com.titan.poss.product.dto.request.LovUpdateDto;
import com.titan.poss.product.dto.response.LovCreateDto;
import com.titan.poss.product.dto.response.LovTypesDto;
import com.titan.poss.product.service.LovService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("ProductLovController")
@RequestMapping("product/v2/lovs")
@Validated
public class LovController {

	@Autowired
	private LovService lovService;

	// NO ACL for REASONTYPE

	private static final String LOV_ADD_EDIT_PERMISSION = START
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_PRODUCT_TYPE_ADD_EDIT + END;

	private static final String LOV_TYPE_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_PRODUCT_TYPE_VIEW + " | "
			+ ProductMasterACLConstants.PRODUCT_PRICING_PRICE_GROUP_TYPE_VIEW + " | "
			+ ProductMasterACLConstants.PRODUCT_MASTERS_SUPPLY_CHAIN_VIEW + " | "
			+ ProductMasterACLConstants.PRODUCT_PRICING_PRICING_TYPE_VIEW + " | "
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_FINDING_VIEW + "' )";

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@PreAuthorize(LOV_TYPE_VIEW_PERMISSION)
	@ApiOperation(value = "View the list of lovTypes", notes = "This API returns the list of lovTypes")
	@GetMapping(value = "/lov-types")
	public LovTypesDto getLovTypes() {
		return lovService.getProductLovTypes();
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@ApiOperation(value = "View the Lov details", notes = "This API returns the Lov details based on **lovType**")
	@GetMapping(value = "/{lovType}")
	public LovDto getLov(
			@PathVariable("lovType") @ApiParam(value = "LOV Type", required = true, allowableValues = "PRODUCTTYPE, REASONTYPE, PRICINGGROUPTYPE, SUPPLYCHAIN, PRICINGTYPE, FINDING, MATERIALTYPE,GEPITEMTYPE,INDENTTYPE, PLAINSTUDDEDTYPE, WEIGHT_EDIT_REASON_TYPE,HALLMARK_KARAT") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType) {
		return lovService.getProductLov(lovType);
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@PreAuthorize(LOV_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Create the Lov details", notes = "This API creates the Lov details based on **lovType**")
	@PostMapping()
	public LovCreateDto createLov(@RequestBody @Valid LovCreateDto lovCreateDto) {

		return lovService.createLov(lovCreateDto);

	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@PreAuthorize(LOV_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Update the Lov details", notes = "This API updates the Lov details based on **lovType**")
	@PatchMapping(value = "/{lovType}")
	public LovDto updateLov(
			@PathVariable("lovType") @ApiParam(value = "LOV Type", required = true, allowableValues = "PRODUCTTYPE, REASONTYPE, PRICINGGROUPTYPE, SUPPLYCHAIN, PRICINGTYPE, FINDING, MATERIALTYPE, GEPITEMTYPE, INDENTTYPE,PLAINSTUDDEDTYPE, WEIGHT_EDIT_REASON_TYPE") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestBody @Valid LovUpdateDto lovUpdateDto) {

		return lovService.updateLov(lovType, lovUpdateDto);
	}

}
