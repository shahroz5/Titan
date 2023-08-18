/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.enums.CustomerSearchTypeEnum;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.UlpService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationUlpCustomerController")
@RequestMapping(value = "integration/v2/customers/loyalty-points")
public class UlpCustomerController {

	@Autowired
	private UlpService ulpService;

	private static final String CUSTOMER_VIEW_PERMISSION = START + SalesAccessControls.CUSTOMER_VIEW + END;
	private static final String CUSTOMER_ADD_EDIT_PERMISSION = START + SalesAccessControls.CUSTOMER_ADD_EDIT + END;

	@ApiOperation(value = "Create Loyalty Customer", notes = "This API will create customer in 3rd party loyalty application and return the created customer which ever 3rd party is active at an instant")
	@PostMapping()
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public CustomerDto createLoyaltyCustomer(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "locationCode", value = "Location code", required = false) @RequestParam(name = "locationCode", required = false) String locationCode,
			@ApiParam(name = "body", value = "Customer object that needs to be inserted in loyalty", required = true) @RequestBody @Valid CustomerAddDto customerAddDto) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.createLoyaltyCustomer(vendor, locationCode, customerAddDto);
	}

	@ApiOperation(value = "Update Loyalty Customer", notes = "This API will update customer and returns null if it updated sucessfully in 3rd party loyalty application which ever 3rd party is active at an instant")
	@PutMapping()
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public UlpBaseResponseDto updateLoyaltyCustomer(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Customer object that needs to be updated in loyalty", required = true) @RequestBody @Valid CustomerUpdateDto customerUpdateDto) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.updateLoyaltyCustomer(vendor, customerUpdateDto);
	}

	@ApiOperation(value = "Search Loyalty Customer", notes = "This API will search customer in 3rd party loyalty application which ever 3rd party is active at an instant"
			+ "<br>" + "Customer can be searched either by mobile number or else ulp Id")
	@GetMapping()
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION + PreAuthorizeDetails.OR + "isUserName('" + PreAuthorizeDetails.LEGACY_USER
			+ "')")
	public CustomerDto searchLoyaltyCustomer(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "customerSearchType", value = "Options by which you can search customer(s)", allowableValues = "MOBILE_NO, ULP_ID", required = true) @RequestParam(name = "customerSearchType", required = true) @ValueOfEnum(enumClass = CustomerSearchTypeEnum.class) String customerSearchType,
			@ApiParam(name = "locationCode", value = "Location code", required = false) @RequestParam(name = "locationCode", required = false) String locationCode,
			@ApiParam(name = "value", required = true) @RequestParam(name = "value") @PatternCheck(regexp = RegExConstants.ULP_SEARCH_REGEX, message = "Invalid ulp search value", nullCheck = true) String value) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return ulpService.searchLoyaltyCustomer(vendor, customerSearchType, locationCode, value);
	}

}
