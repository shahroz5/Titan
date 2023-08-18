/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYEE_BANK_CONTROLLER;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

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
import com.titan.poss.core.dto.LocationCodeFilterDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dto.PayeeBankDto;
import com.titan.poss.payment.dto.request.MappedConfigDto;
import com.titan.poss.payment.dto.request.PayeeBankMappingDto;
import com.titan.poss.payment.dto.request.PayeeBankUpdateDto;
import com.titan.poss.payment.dto.response.PayeeBankLocationDto;
import com.titan.poss.payment.service.PayeeBankService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController(PAYEE_BANK_CONTROLLER)
@RequestMapping("payment/v2/payee-banks")
public class PayeeBankController {

	private static final String PAYEE_BANK_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYEE_BANK_VIEW + PreAuthorizeDetails.END;

	private static final String PAYEE_BANK_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYEE_BANK_ADD_EDIT + PreAuthorizeDetails.END;

	@Autowired
	private PayeeBankService payeeBankService;

	/**
	 * This method will return the list of payee bank based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PayeeBankDto>>
	 */
	@ApiOperation(value = "View the list of Payee Bank", notes = "This API returns the list of Payee Bank based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PAYEE_BANK_VIEW_PERMISSION)
	public PagedRestResponse<List<PayeeBankDto>> listPayeeBank(@RequestParam(required = false) String bankName, 
			Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return payeeBankService.listPayeeBank(bankName, isActive, pageable);
	}

	/**
	 * This method will return the Payee Bank based on the bankName.
	 * 
	 * @param bankName
	 * @return PayeeBankDto
	 */
	@ApiOperation(value = "View the Payee Bank based on the bankName", notes = "This API returns the Payee Bank based on the **bankName**<br>"
			+ "bankName :-  Bank Name should be alphanumeric Example(ICICI, AMERICAN EXPRESS) and size should be less than 100.")
	@GetMapping(value = "/{bank-name}")
	@PreAuthorize(PAYEE_BANK_VIEW_PERMISSION)
	public PayeeBankDto getPayment(
			@PathVariable("bank-name") @PatternCheck(message = PaymentConstants.INVALID_BANK_NAME, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String bankName) {
		return payeeBankService.getPayeeBank(bankName);
	}

	/**
	 * This method will save the Payee Bank.
	 * 
	 * @param payeeBankDto
	 * @return PayeeBankDto
	 */
	// @Formatter:off
	@ApiOperation(value = "Save the Payee Bank Details", notes = "This API saves the Payee Bank Details<br>"
			+ "PayeeBank DTO :- <br>"
			+ "1. bankName :-  Bank Name should be alphanumeric Example(ICICI, AMERICAN EXPRESS) and size should be less than 100<br>"
			+ "2. isActive :- it should be true or false.<br>"
			+ "3. address :- Bank Address alphanumeric and size should be less than 100.<br>"
			+ "4. mailId :- Mail Id should be in proper format.<br>"
			+ "5. contactPerson :- Size Should be less than 100 and alphanumeric"
			+ "6. stateId :- pass valid state Id in integer.<br>"
			+ "7. townId :- pass valid in town Id in integer. <br>" + "8. countryCode :- pass valid CountryCode<br>"
			+ "9. mobileNumber :- Pass valid mobile Number.")
	// @Formatter:on
	@PostMapping
	@PreAuthorize(PAYEE_BANK_ADD_EDIT_PERMISSION)
	public PayeeBankDto addPayeeBank(
			@RequestBody @Valid @ApiParam(name = "body", value = "payeeBank that needs to be created", required = true) PayeeBankDto payeeBankDto) {
		return payeeBankService.addPayeeBank(payeeBankDto);
	}

	/**
	 * This method will update the Payee bank.
	 * 
	 * @param bankName
	 * @param payeeBankDto
	 * @return PayeeBankDto
	 */
	// @Formatter:off
	@ApiOperation(value = "Update the Payee Bank ", notes = "This API updates the Payee Bank <br/> if **isActive** is false, then it will be soft deleted based on the **bankName**<br>"
			+ "PayeeBankUpdateDto :- <br>"
			+ "1. bankName :-  Bank Name should be alphanumeric Example(ICICI, AMERICAN EXPRESS) and size should be less than 100<br>"
			+ "2. isActive :- it should be true or false.<br>"
			+ "3. address :- Bank Address alphanumeric and size should be less than 100.<br>"
			+ "4. mailId :- Mail Id should be in proper format.<br>"
			+ "5. contactPerson :- Size Should be less than 100 and alphanumeric"
			+ "6. stateId :- pass valid state Id in integer.<br>"
			+ "7. townId :- pass valid in town Id in integer. <br>" + "8. countryCode :- pass valid CountryCode<br>"
			+ "9. mobileNumber :- Pass valid mobile Number.")
	// @Formatter:on
	@PatchMapping(value = "/{bank-name}")
	@PreAuthorize(PAYEE_BANK_ADD_EDIT_PERMISSION)
	public PayeeBankDto updatePayeeBank(
			@PathVariable("bank-name") @PatternCheck(message = PaymentConstants.INVALID_BANK_NAME, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) @Size(min = 1, max = 50, message = "bank name min length {min} and max length is {max}") String bankName,
			@RequestBody @Valid @ApiParam(name = "body", value = "payeeBank that needs to be updated", required = true) PayeeBankUpdateDto payeeBankDto) {
		return payeeBankService.updatePayeeBank(bankName, payeeBankDto);
	}

	/**
	 * This method will get the list of gl_code for Payee bank based on location
	 * Code and bankName.
	 *
	 * @param bankName
	 * @param locationCode
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	@ApiOperation(value = "This method will get the list of gl_code for Payee bank based on location Code and bankName", notes = "This method will get the list of gl_code for Payee bank based on location Code and bankName")
	@PostMapping("/{bank-name}/locations")
	@ApiPageable
	@PreAuthorize(PAYEE_BANK_VIEW_PERMISSION)
	public PagedRestResponse<List<PayeeBankLocationDto>> getLocationMapping(
			@PathVariable("bank-name") @PatternCheck(message = PaymentConstants.INVALID_BANK_NAME, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String bankName,
			@RequestBody @Valid @ApiParam(name = "body", value = "location filter", required = false) LocationCodeFilterDto locationCodeFilter,
			@RequestParam(value = "paymentCodes", required = false) List<@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String> paymentCodes,
			@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable) {
		return payeeBankService.getLocationMapping(bankName, locationCodeFilter.getLocationCode(), pageable,
				paymentCodes, isPageable);
	}

	/**
	 * This method will mapped the bankName with paymentCodes in multiple locations.
	 *
	 * @param bankName
	 * @param payeeBankLocationMappingDto
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	// @Formatter:off
	@ApiOperation(value = "This method will mapped the bankName with paymentCodes in multiple locations", notes = "This API will mapped the **bankName**, **paymentCodes** with a multiple **location**<br>"
			+ "PayeeBankLocationMappingDto :-<br>"
			+ "1. removeLocations :- pass all locations for which user wants to delete all configuration<br>"
			+ "2. removePaymentCodes :- remove all paymentCodes which user wants to remove for the location mentioned in add location field<br>"
			+ "3. addLocations :- pass location for which payment modes to be added or removed<br>"
			+ "4. addPaymentCodes :- add all payment modes for location mentioned in addPaymentCodes<br>"
			+ "         I. glCode :- It is numeric 6 digit code for payment mode<br>"
			+ "         II. paymentCode :- Payment mode should be alphanumeric Example(CASH, DD, CHEQUE)<br>"
			+ "         III. isDefault :- It can be true/false and if in one location multiple bank can be mapped and the paymentCode and locationCode with isDefault true. these combination can be only for one bank<br>"
			+ "               Example: a. if one configuration is like -> ICICI | CASH | URB | TRUE  => (TRUE)"
			+ "                        b. another one configuration if you wants to add -> HDFC| CASH | URB | TRUE  => (False) "
			+ "                        if configuration **a** exist already in db  then you can not configure **b**.")
	// @Formatter:on
	@PatchMapping("/{bank-name}/locations")
	@PreAuthorize(PAYEE_BANK_ADD_EDIT_PERMISSION)
	public ListResponse<PayeeBankLocationDto> updateLocationMappings(
			@PathVariable("bank-name") @PatternCheck(message = PaymentConstants.INVALID_BANK_NAME, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String bankName,
			@RequestBody @Valid @ApiParam(name = "body", value = "payeeBankLocationMapping that needs to be updated", required = true) PayeeBankMappingDto payeeBankLocationMappingDto) {
		return payeeBankService.updateLocationMappings(bankName, payeeBankLocationMappingDto);
	}

	/**
	 * This method will give the list of Payee bank location mapping for which
	 * default is true already Configured.
	 *
	 * @param payeeBankMapping
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	@ApiOperation(value = "This method will give the list of Payee bank location mapping for which default is true already Configured.", notes = "After the selection of mapping In this api we have to pass the record for which "
			+ "user has selected is default true ")
	@PostMapping("/locations/defaults")
	@PreAuthorize(PAYEE_BANK_VIEW_PERMISSION)
	public ListResponse<PayeeBankLocationDto> getConflictLocationMapping(
			@RequestBody @Valid @ApiParam(name = "body", value = "body", required = true) MappedConfigDto payeeBankMapping) {
		return payeeBankService.getConflictLocationMapping(payeeBankMapping);
	}

}
