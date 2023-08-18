/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

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
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.integration.dto.VendorDto;
import com.titan.poss.integration.dto.request.VendorUpdateDto;
import com.titan.poss.integration.service.VendorService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationVendorController")
@RequestMapping(value = "integration/v2/vendors")
public class VendorController {

	private static final String VENDOR_MASTER_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_VENDOR_MASTER_VIEW + PreAuthorizeDetails.END;

	private static final String VENDOR_MASTER_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ProductMasterACLConstants.PRODUCT_ATTRIBUTES_VENDOR_MASTER_ADD_EDIT + PreAuthorizeDetails.END;
	
	@Autowired
	private VendorService vendorService;

	@ApiPageable
	@ApiOperation(value = "Get all the Vendors", notes = "This API will return all the vendors")
	@GetMapping(value = "")
	@PreAuthorize(VENDOR_MASTER_VIEW_PERMISSION)
	public PagedRestResponse<List<VendorDto>> getVendors(
			@ApiParam(name = "isActive", value = "Is Vendor Active", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return vendorService.getAllVendors(isActive, isPageable, pageable);
	}

	@ApiOperation(value = "Gets Vendor", notes = "This API will return the vendor based on vendor code")
	@GetMapping(value = "/{vendorCode}")
	//@PreAuthorize(VENDOR_MASTER_VIEW_PERMISSION)
	public VendorDto getVendor(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", required = true) @PathVariable(name = "vendorCode", required = true) String vendorCode) {

		return vendorService.getVendorByVendorCode(vendorCode);
	}

	@ApiOperation(value = "Gets Vendor by Vendor Type", notes = "This API will return the vendor based on vendor type")
	@GetMapping(value = "/vendor-type/{vendorType}")
	@PreAuthorize(VENDOR_MASTER_VIEW_PERMISSION)
	public VendorDto getVendorByType(
			@ApiParam(name = "vendorType", value = "Vendor type that needs to be used", required = true) @PathVariable(name = "vendorType", required = true) String vendorType) {

		return vendorService.getVendorByVendorType(vendorType);
	}

	@ApiOperation(value = "Update a Vendor", notes = "This API will update the vendor based on vendor code")
	@PatchMapping(value = "")
	//@PreAuthorize(VENDOR_MASTER_ADD_EDIT_PERMISSION)
	public VendorDto updateVendor(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", required = true) @RequestParam(name = "vendorCode", required = true) String vendorCode,
			@ApiParam(name = "body", value = "Vendor Object that needs to be updated", required = true) @RequestBody @Valid VendorUpdateDto vendorUpdateDto) {

		return vendorService.updateVendor(vendorCode, vendorUpdateDto);
	}

	@ApiOperation(value = "Create a Vendor", notes = "This API generate report based on search parameter.<br>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for vendor details:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/integration-service/src/main/resources/com/titan/poss/integration/json/\">"
			+ "VENDOR_DETAILS</a>" + "</br></br>" + "</li>")
	@PostMapping(value = "")
	@PreAuthorize(VENDOR_MASTER_ADD_EDIT_PERMISSION)
	public VendorDto createVendor(
			@ApiParam(name = "body", value = "Vendor Object that needs to be created", required = true) @RequestBody @Valid VendorDto vendorDto) {

		return vendorService.createVendor(vendorDto);
	}
}
