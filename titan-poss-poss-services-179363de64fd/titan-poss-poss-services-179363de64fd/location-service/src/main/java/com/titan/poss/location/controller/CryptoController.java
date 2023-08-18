/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.dto.DepositPasswordCreateDto;
import com.titan.poss.core.dto.ManualBillCreateDto;
import com.titan.poss.core.dto.MetalRateRequestDto;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.location.dto.response.BankDepositResponseDto;
import com.titan.poss.location.dto.response.ManualBillResponseDto;
import com.titan.poss.location.dto.response.MetalRateResponseDto;
import com.titan.poss.location.service.CryptoService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller to generate password for manual bill and metal rate.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("LocationCryptoController")
@RequestMapping("location/v2/password")
@Validated
public class CryptoController {

	@Autowired
	private CryptoService cryptoService;

	private static final String METAL_RATE_ADD_EDIT = PreAuthorizeDetails.START
			+ ConfigAccessControls.LOCATION_METAL_RATE_PASS + PreAuthorizeDetails.END;

	private static final String BANK_DEPOSITE_CREATE = PreAuthorizeDetails.START
			+ ConfigAccessControls.LOCATION_BANK_DEPOSITE_PASS + PreAuthorizeDetails.END;

	private static final String MANUAL_BILL_PASS_ADD_EDIT = PreAuthorizeDetails.START
			+ ConfigAccessControls.LOCATION_MANUAL_BILL_PASS + PreAuthorizeDetails.END;

	/**
	 * This method will generate password for manual bill
	 * 
	 * @param manualBillCreateDto
	 * @return ManualBillResponseDto
	 */
	@ApiOperation(value = "API to generate password for manual bill", notes = "This API will generate password for manual bill")
	@PostMapping("manual-bill")
	@PreAuthorize(MANUAL_BILL_PASS_ADD_EDIT)
	public ManualBillResponseDto generatePasswordForManualBill(
			@ApiParam(name = "body", value = "Manual bill details object that is required to generate password", required = true) @RequestBody @Valid ManualBillCreateDto manualBillCreateDto) {
		return cryptoService.generatePasswordForManualBill(manualBillCreateDto);
	}

	@ApiOperation(value = "API to generate password for metal rates", notes = "This API will generate password for metal rates")
	@PostMapping("metal-rates")
	@PreAuthorize(METAL_RATE_ADD_EDIT)
	public MetalRateResponseDto generatePasswordMetalRates(
			@ApiParam(name = "body", value = "Metalrate details object that is required to generate password", required = true) @RequestBody @Valid MetalRateRequestDto metalRateRequestDto) {
		return cryptoService.generatePasswordMetalRates(metalRateRequestDto);
	}

	/**
	 * This method will generate password for Bank Deposit
	 * 
	 * @param depositPasswordCreateDto
	 * @return BankDepositResponseDto
	 */
	@ApiOperation(value = "API to generate password for Bank deposits", notes = "This API will generate password for bank deposits")
	@PostMapping("bank-deposits")
	@PreAuthorize(BANK_DEPOSITE_CREATE)
	public BankDepositResponseDto generatePasswordBankDeposits(
			@ApiParam(name = "body", value = "Bank Deposit details object that is required to generate password", required = true) @RequestBody @Valid DepositPasswordCreateDto depositPasswordCreateDto) {
		return cryptoService.generatePasswordBankDeposits(depositPasswordCreateDto);
	}
}
