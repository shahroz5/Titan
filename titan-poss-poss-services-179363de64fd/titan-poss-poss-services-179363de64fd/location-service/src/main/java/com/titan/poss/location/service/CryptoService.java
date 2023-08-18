/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DepositPasswordCreateDto;
import com.titan.poss.core.dto.ManualBillCreateDto;
import com.titan.poss.core.dto.MetalRateRequestDto;
import com.titan.poss.location.dto.response.BankDepositResponseDto;
import com.titan.poss.location.dto.response.ManualBillResponseDto;
import com.titan.poss.location.dto.response.MetalRateResponseDto;

/**
 * Service interface to generate password for manual bill and metal rate.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("LocationCryptoService")
public interface CryptoService {

	/**
	 * This method will generate password for manual bill
	 * 
	 * @param manualBillCreateDto
	 * @return ManualBillResponseDto
	 */
	ManualBillResponseDto generatePasswordForManualBill(ManualBillCreateDto manualBillCreateDto);

	/**
	 * This method will generate password for metal rates
	 * 
	 * @param metalRateCreateRequestDto
	 * @return MetalRateResponseDto
	 */
	MetalRateResponseDto generatePasswordMetalRates(MetalRateRequestDto metalRateRequestDto);
	
	/**
	 * This method will generate password for Bank Deposit
	 * 
	 * @param depositPasswordCreateDto
	 * @return BankDepositResponseDto
	 */
	BankDepositResponseDto generatePasswordBankDeposits(DepositPasswordCreateDto depositPasswordCreateDto);

}
