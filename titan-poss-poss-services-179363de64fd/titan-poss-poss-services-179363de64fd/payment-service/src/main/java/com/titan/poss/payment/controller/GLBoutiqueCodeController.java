/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_GL_CODE_CONTROLLER;

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
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.GLBoutiqueCodeDto;
import com.titan.poss.core.dto.LocationCodeFilterDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.dto.request.GLBoutiqueCodeMappingRequestDto;
import com.titan.poss.payment.dto.request.GLBoutiqueCodeUpdateDto;
import com.titan.poss.payment.dto.response.GLBoutiqueCodeMappingDto;
import com.titan.poss.payment.service.GLBoutiqueCodeService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController(PAYMENT_GL_CODE_CONTROLLER)
@RequestMapping("payment/v2/gl-boutique-codes")
public class GLBoutiqueCodeController {

	private static final String GL_BOUTIQUE_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.GL_BOUTIQUE_VIEW + PreAuthorizeDetails.END;

	private static final String GL_BOUTIQUE_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.GL_BOUTIQUE_ADD_EDIT + PreAuthorizeDetails.END;

	private static final String GL_BOUTIQUE_PAYMENT_MAPPING_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.GL_BOUTIQUE_PAYMENT_MAPPING_VIEW + PreAuthorizeDetails.END;

	private static final String GL_BOUTIQUE_PAYMENT_MAPPING_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.GL_BOUTIQUE_PAYMENT_MAPPING_ADD_EDIT + PreAuthorizeDetails.END;

	@Autowired
	private GLBoutiqueCodeService glCodeService;

	/**
	 * This method will return the list of all gl_btq_codess based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<GLCodeDto>>
	 */
	@ApiOperation(value = "This method will return the list of all gl_btq_codes based on the isActive", notes = "This method will return the list of all gl_btq_codess based on the isActive")
	@GetMapping
	@ApiPageable
	@PreAuthorize(GL_BOUTIQUE_VIEW_PERMISSION)
	public PagedRestResponse<List<GLBoutiqueCodeDto>> listGLCodes(
			@RequestParam(required = false) String locationCode, 
			Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return glCodeService.listGLCodes(locationCode, isActive, pageable);
	}

	/**
	 * This method will return the GL Code based on the locationCode.
	 * 
	 * @param locationCode
	 * @return GLCodeDto
	 */
	@ApiOperation(value = "This method will return the GL Code based on the locationCode", notes = "This method will return the GL Code based on the locationCode")
	@GetMapping(value = "/{locationCode}")
	@PreAuthorize(GL_BOUTIQUE_VIEW_PERMISSION)
	public GLBoutiqueCodeDto getGLCode(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
		return glCodeService.getGLCode(locationCode);
	}

	/**
	 * This method will save the GLCode.
	 * 
	 * @param glCodeDto
	 * @return GLCodeDto
	 */
	// @Formatter:off
	@ApiOperation(value = "This method will save the GLCode", notes = "This method will save the GLCode")
	// @Formatter:on
	@PostMapping
	@PreAuthorize(GL_BOUTIQUE_ADD_EDIT_PERMISSION)
	public GLBoutiqueCodeDto addGLCode(
			@RequestBody @Valid @ApiParam(name = "body", value = "GL Boutique that needs to be created", required = true) GLBoutiqueCodeDto glCodeDto) {
		return glCodeService.addGLCode(glCodeDto);
	}

	/**
	 * This method will update the GL Code.
	 * 
	 * @param locationCode
	 * @param glCodeUpdateDto
	 * @return GLCodeDto
	 */
	// @Formatter:off
	@ApiOperation(value = "This method will update the GL Code", notes = "This method will update the GL Code")
	// @Formatter:on
	@PatchMapping(value = "/{locationCode}")
	@PreAuthorize(GL_BOUTIQUE_ADD_EDIT_PERMISSION)
	public GLBoutiqueCodeDto updateGLCode(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "GL Boutique that needs to be updated", required = true) GLBoutiqueCodeUpdateDto glCodeUpdateDto) {
		return glCodeService.updateGLCode(locationCode, glCodeUpdateDto);
	}

	/**
	 * This method will get the list of gl_code for based on location Code and
	 * PaymentCode.
	 *
	 * @param locationCode
	 * @return ListResponse<GLCodeMappingDto>
	 */
	@ApiOperation(value = "This method will get the list of gl_code based on location Code and PaymentCode", notes = "This method will get the list of gl_code for based on **location Code** and **PaymentCode**")
	@PostMapping(value = "/payments")
	@ApiPageable
	@PreAuthorize(GL_BOUTIQUE_PAYMENT_MAPPING_VIEW_PERMISSION)
	public PagedRestResponse<List<GLBoutiqueCodeMappingDto>> getPaymentLocationMapping(
			@RequestBody @Valid @ApiParam(name = "body", value = "location filter", required = false) LocationCodeFilterDto locationCodeFilter,
			@ApiIgnore Pageable pageable) {
		return glCodeService.getPaymentLocationMapping(locationCodeFilter.getLocationCode(), pageable);
	}

	/**
	 * This method will mapped the glCodes for multiple paymentCodes in multiple
	 * locations.
	 *
	 * @param glCodeMappingRequestDto
	 * @return ListResponse<GLCodeMappingRequestDto>
	 */
	@ApiOperation(value = "This method will mapped the glCodes for multiple paymentCodes in multiple locations", notes = "This API will mapped the glCode of **paymentCodes** with a multiple **location**<br>"
			+ "GLCodeMappingRequestDto :-<br>"
			+ "1. removeLocations :- pass all locations for which user wants to delete all configuration<br>"
			+ "2. removePaymentCodes :- remove all paymentCodes which user wants to remove for the location mentioned in add location field<br>"
			+ "3. addLocations :- pass location for which payment modes to be added or removed<br>"
			+ "4. addPaymentCodes :- add all payment modes for location mentioned in addPaymentCodes<br>"
			+ "         I. glCode :- It is numeric 6 digit code for payment mode<br>"
			+ "         II. paymentCode :- Payment mode should be alphanumeric Example(CASH, DD, CHEQUE)<br>")
	@PatchMapping(value = "/payments")
	@PreAuthorize(GL_BOUTIQUE_PAYMENT_MAPPING_ADD_EDIT_PERMISSION)
	public ListResponse<GLBoutiqueCodeMappingDto> updatePaymentLocationMapping(
			@RequestBody @Valid @ApiParam(name = "body", value = "GL Boutique Mapping that needs to be created", required = true) GLBoutiqueCodeMappingRequestDto glCodeMappingRequestDto) {
		return glCodeService.updatePaymentLocationMapping(glCodeMappingRequestDto);
	}

}
