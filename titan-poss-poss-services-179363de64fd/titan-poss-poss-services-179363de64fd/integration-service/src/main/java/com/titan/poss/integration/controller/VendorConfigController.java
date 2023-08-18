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
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.VendorConfigDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.integration.dto.request.VendorConfigAddDto;
import com.titan.poss.integration.service.VendorConfigService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationVendorConfigController")
@RequestMapping(value = "integration/v2/vendor-config")
public class VendorConfigController {

	private static final String VENDOR_CONFIG_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.VENDOR_CONFIG_VIEW + PreAuthorizeDetails.END;

	private static final String VENDOR_CONFIG_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.VENDOR_CONFIG_ADD_EDIT + PreAuthorizeDetails.END;
	
	@Autowired
	private VendorConfigService vendorConfigService;

	// @formatter:off
	@ApiOperation(value = "Create Vendor Config", notes = "This API will create the vendor config "
			+ "</br><span style=\"font-size:14px;\">Find Below the HyperLinks for config details Json Format:</span>\r\n" 
			+ "<ul>" +
			 "<li>"
			 + "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/integration-service/src/main/resources/com/titan/poss/integration/json/AirpayConnectionDetails.json/\">" + 
			 "AIRPAY\r\n" + 
					"</br>" +
			"  </li>" +
			 "<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/integration-service/src/main/resources/com/titan/poss/integration/json/AirpayConnectionDetails.json/\">"+
				" QCGC"+
				"</a>"+
				"</br>" +
			"  </li></ul>" +
				"</br><b>NOTE:</b>"
				+ "<ul><li>Config Details are required for contacting the third party API's. This is usually given by the third parties and inserted to our system through file upload or API.</li>"
				+ "<li>Connection details are data needed to connect with third party api's. This is the response from the third party initilization api.</li></ul?")
	// @formatter:on
	@PostMapping(value = "")
	@PreAuthorize(VENDOR_CONFIG_ADD_EDIT_PERMISSION)
	public VendorConfigDto createVendorConfig(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "AIRPAY, QC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Vendor config Object that needs to be created", required = true) @RequestBody @Valid VendorConfigAddDto vendorConfigAddDto) {

		return vendorConfigService.createVendorConfig(vendorCode, vendorConfigAddDto);
	}

	@ApiOperation(value = "Update Vendor Config", notes = "This API will update the vendor config")
	@PatchMapping(value = "")
	@PreAuthorize(VENDOR_CONFIG_ADD_EDIT_PERMISSION)
	public VendorConfigDto updateVendorConfig(
			@ApiParam(name = "configId", value = "Vendor config id", required = true) @RequestParam(name = "configId", required = true) String configId,
			@ApiParam(name = "body", value = "Vendor config Object that needs to be updated", required = true) @RequestBody @Valid VendorConfigAddDto vendorConfigUpdateDto) {

		return vendorConfigService.updateVendorConfig(configId, vendorConfigUpdateDto);
	}

	@ApiOperation(value = "Get all the Vendor config details", notes = "This API will return all the vendor configs")
	@GetMapping(value = "")
	@PreAuthorize(VENDOR_CONFIG_VIEW_PERMISSION)
	public List<VendorConfigDto> getAllVendorConfigs(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS, EMAIL_GMAIL, SMS_KAP, QC_GC, PAYMENT_AIRPAY", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "isActive", value = "Is Vendor Config Active", required = true) @RequestParam(name = "isActive", required = true) Boolean isActive) {

		return vendorConfigService.getAllVendorConfigs(vendorCode, isActive);
	}

	@ApiOperation(value = "Get the Vendor config details", notes = "This API will return the vendor configs")
	@GetMapping(value = "/{configId}")
	@PreAuthorize(VENDOR_CONFIG_VIEW_PERMISSION)
	public VendorConfigDto getVendorConfig(
			@ApiParam(name = "configId", value = "Vendor config id", required = true) @PathVariable(name = "configId", required = true) String configId) {

		return vendorConfigService.getVendorConfig(configId);
	}

	@ApiPageable
	@ApiOperation(value = "Gets all the Vendor configuration details", notes = "This API will return all the vendor configurations for that particular vendor")
	@GetMapping(value = "/configuration")
	@PreAuthorize(VENDOR_CONFIG_VIEW_PERMISSION)
	public PagedRestResponse<Object> getVendorConfiuations(
			@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "PAYMENT_AIRPAY, QC_GC, PAYMENT_RAZORPAY", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiIgnore Pageable pageable) {

		return vendorConfigService.getAllVendorConfigurations(vendorCode, locationCode, isActive, pageable);
	}

}
