/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_CONFIG_CONTROLLER;

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
import com.titan.poss.core.dto.MappedLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.dto.PayerBankConfigDto;
import com.titan.poss.payment.dto.request.PayerBankDetails;
import com.titan.poss.payment.dto.request.PayerBankLocationMapping;
import com.titan.poss.payment.dto.response.MappedConfigResponse;
import com.titan.poss.payment.dto.response.PayerBankConfigDetails;
import com.titan.poss.payment.dto.response.PayerBankConfigResponseDto;
import com.titan.poss.payment.dto.response.PayerLocationMappingResponse;
import com.titan.poss.payment.service.PayerBankConfigService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PAYER_BANK_CONFIG_CONTROLLER)
@RequestMapping("payment/v2/payer-bank-configs")
public class PayerBankConfigController {

	private static final String PAYER_BANK_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYER_BANK_VIEW + PreAuthorizeDetails.END;

	private static final String PAYER_BANK_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYER_BANK_ADD_EDIT + PreAuthorizeDetails.END;

	@Autowired
	private PayerBankConfigService payerBankConfigService;

	/**
	 * This method will return the list of payer bankConfigs based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PayerBankConfigDto>>
	 */
	@ApiOperation(value = "View the list of Payer Bank Configs", notes = "This API returns the list of Payer Bank Configs based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PAYER_BANK_VIEW_PERMISSION)
	public PagedRestResponse<List<PayerBankConfigResponseDto>> listPayerBankConfig(
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable,
			@RequestParam(required = false) String description) {
		return payerBankConfigService.listPayerBankConfig(isActive, pageable, description);
	}

	/**
	 * This method will return the Payer Bank based on the bankName.
	 * 
	 * @param id
	 * @return PayerBankConfigDto
	 */
	@ApiOperation(value = "View one Payer Bank Configs", notes = "This API returns one Payer Bank Configs based on **Config Id**")
	@GetMapping("/{config-id}")
	@PreAuthorize(PAYER_BANK_VIEW_PERMISSION)
	public PayerBankConfigResponseDto getPayerBankConfig(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		return payerBankConfigService.getPayerBankConfig(id);
	}

	/**
	 * This method will save the Payer Bank.
	 * 
	 * @param payerBankConfigDto
	 * @return PayerBankConfigDto
	 */
	@ApiOperation(value = "Save Payer Bank Configs", notes = "This API save the Payer Bank Configs")
	@PostMapping
	@PreAuthorize(PAYER_BANK_ADD_EDIT_PERMISSION)
	public PayerBankConfigResponseDto addPayerBankConfig(
			@RequestBody @Valid @ApiParam(name = "body", value = "payerBank configuration that needs to be created", required = true) PayerBankConfigDto payerBankConfigDto) {
		return payerBankConfigService.addPayerBankConfig(payerBankConfigDto);
	}

	/**
	 * This method will update the Payer bank.
	 * 
	 * @param id
	 * @param payerBankConfigDto
	 * @return PayerBankConfigDto
	 */
	@ApiOperation(value = "Update the Payer Bank Configs", notes = "This API Update Payer Bank Configs based on **configId**")
	@PatchMapping("/{config-id}")
	@PreAuthorize(PAYER_BANK_ADD_EDIT_PERMISSION)
	public PayerBankConfigResponseDto updatePayerBankConfig(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid @ApiParam(name = "body", value = "payeeBankConfiguration that needs to be updated", required = true) PayerBankConfigDto payerBankConfigDto) {
		return payerBankConfigService.updatePayerBankConfig(id, payerBankConfigDto);
	}

	/**
	 * This method will get the payer bank details.
	 * 
	 * @param configId
	 * @return ListResponse<PayerBankConfigMapping>
	 *
	 */
	@ApiOperation(value = "This Method will get the payer bank mapped to payment mode", notes = "This API will return the list of payer bank mapped to payment mode based on **ConfigId**")
	@GetMapping("/{config-id}/details")
	@PreAuthorize(PAYER_BANK_VIEW_PERMISSION)
	public ListResponse<PayerBankConfigDetails> getPayerBankConfigMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId) {

		return payerBankConfigService.getPayerBankConfigMapping(configId);
	}

	/**
	 * This Method will update/add/remove the payer bank details
	 * 
	 * @param configId
	 * @param payerBankDetails
	 * @return ListResponse<PayerBankConfigMapping>
	 */
	@ApiOperation(value = "This Method will add/remove the payer bank details", notes = "This API will use to add/remove the mapping of payer bank to payment mode based on config id")
	@PatchMapping("/{config-id}/details")
	@PreAuthorize(PAYER_BANK_ADD_EDIT_PERMISSION)
	public ListResponse<PayerBankConfigDetails> updatePayerBankConfigMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestBody @Valid @ApiParam(name = "body", value = "payeeBankConfigMapping that needs to be updated", required = true) PayerBankDetails payerBankDetails) {

		return payerBankConfigService.updatePayerBankConfigMapping(configId, payerBankDetails);
	}

	/**
	 * This method will get the payer bank details.
	 * 
	 * @param configId
	 * @return ListResponse<PayerBankConfigMapping>
	 *
	 */
	@ApiOperation(value = "This Method will get the mapped payer bank and payment mode on which and all location based on configId ", notes = "This API will return the list of payer bank mapped to payment mode on which and all location based on **ConfigId**")
	@GetMapping("/{config-id}/locations")
	@PreAuthorize(PAYER_BANK_VIEW_PERMISSION)
	public ListResponse<PayerLocationMappingResponse> getPayerBankLocationMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId) {

		return payerBankConfigService.getPayerBankLocationMapping(configId);
	}

	/**
	 * This method will return the list of location codes which is already mapped to
	 * configId based on location Codes ,
	 * 
	 * @param mappedLocationDto
	 * @return List<MappedConfigResponseDto>
	 */
	@PostMapping(value = "/configs/locations")
	@ApiOperation(value = "View the list of Unique location codes and configId which is already mapped ", notes = "This API returns the list of Unique location codes and configId mapped"
			+ "</br></br> It takes the following filters:</br>"
			+ "</br></t> 1. includeLocations: list of locationCodes to be included</br>"
			+ "</br></t> 2. excludeConfigId: ruleId to be excluded</br>")
	@PreAuthorize(PAYER_BANK_VIEW_PERMISSION)
	public ListResponse<MappedConfigResponse> getMappedLocationCodes(
			@Valid @RequestBody MappedLocationDto mappedLocationDto) {

		return payerBankConfigService.getMappedLocationCodes(mappedLocationDto);
	}

	/**
	 * This Method will update/add/remove the payer bank details
	 * 
	 * @param configId
	 * @param payerBankLocationMapping
	 * @return ListResponse<PayerBankConfigMapping>
	 */
	@ApiOperation(value = "This API will add/remove the location mapping", notes = "This API will use to add/remove the mapping of payer bank and payment mode to locations based on **ConfigId**")
	@PatchMapping("/{config-id}/locations")
	@PreAuthorize(PAYER_BANK_ADD_EDIT_PERMISSION)
	public ListResponse<PayerLocationMappingResponse> updatePayerBankLocationMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestBody @Valid @ApiParam(name = "body", value = "payerBankLocationMapping that needs to be updated", required = true) PayerBankLocationMapping payerBankLocationMapping) {

		return payerBankConfigService.updatePayerBankLocationMapping(configId, payerBankLocationMapping);
	}
}
