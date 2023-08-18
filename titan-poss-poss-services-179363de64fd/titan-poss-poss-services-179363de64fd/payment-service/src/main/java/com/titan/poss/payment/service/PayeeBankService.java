/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYEE_BANK_SERVICE;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.PayeeBankDto;
import com.titan.poss.payment.dto.request.MappedConfigDto;
import com.titan.poss.payment.dto.request.PayeeBankMappingDto;
import com.titan.poss.payment.dto.request.PayeeBankUpdateDto;
import com.titan.poss.payment.dto.response.PayeeBankLocationDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYEE_BANK_SERVICE)
public interface PayeeBankService {

	/**
	 * This method will return the list of payee bank based on the isActive.
	 * @param bankName 
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PayeeBankDto>>
	 */
	PagedRestResponse<List<PayeeBankDto>> listPayeeBank(String bankName, Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Payee Bank based on the bankName.
	 * 
	 * @param bankName
	 * @return PayeeBankDto
	 */
	PayeeBankDto getPayeeBank(String bankName);

	/**
	 * This method will save the Payee Bank.
	 * 
	 * @param payeeBankDto
	 * @return PayeeBankDto
	 */
	PayeeBankDto addPayeeBank(PayeeBankDto payeeBankDto);

	/**
	 * This method will update the Payee bank.
	 * 
	 * @param bankName
	 * @param payeeBankDto
	 * @return PayeeBankDto
	 */
	PayeeBankDto updatePayeeBank(String bankName, PayeeBankUpdateDto payeeBankDto);

	/**
	 * This method will get the list of gl_code for Payee bank based on location
	 * Code and bankName.
	 *
	 * @param bankName
	 * @param locationCode
	 * @param paymentCode
	 * @param isPageable 
	 * @return PayeeBankLocationDto
	 */
	PagedRestResponse<List<PayeeBankLocationDto>> getLocationMapping(String bankName, List<String> locationCode,
			Pageable pageable, List<String> paymentCodes, Boolean isPageable);

	/**
	 * This method will mapped the bankName with paymentCodes in multiple locations.
	 *
	 * @param bankName
	 * @param payeeBankLocationMappingDto
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	ListResponse<PayeeBankLocationDto> updateLocationMappings(String bankName,
			PayeeBankMappingDto payeeBankLocationMappingDto);

	/**
	 * This method will give the list of Payee bank location mapping for which
	 * default is true already Configured.
	 *
	 * @param payeeBankMapping
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	ListResponse<PayeeBankLocationDto> getConflictLocationMapping(MappedConfigDto payeeBankMapping);
}
