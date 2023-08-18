/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_CONFIG_SERVICE;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.MappedLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.PayerBankConfigDto;
import com.titan.poss.payment.dto.request.PayerBankDetails;
import com.titan.poss.payment.dto.request.PayerBankLocationMapping;
import com.titan.poss.payment.dto.response.MappedConfigResponse;
import com.titan.poss.payment.dto.response.PayerBankConfigDetails;
import com.titan.poss.payment.dto.response.PayerBankConfigResponseDto;
import com.titan.poss.payment.dto.response.PayerLocationMappingResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYER_BANK_CONFIG_SERVICE)
public interface PayerBankConfigService {

	/**
	 * @param isActive
	 * @param pageable
	 * @param description
	 * @return PagedRestResponse<List<PayerBankConfigDto>>
	 */
	PagedRestResponse<List<PayerBankConfigResponseDto>> listPayerBankConfig(Boolean isActive, Pageable pageable,
			String description);

	/**
	 * @param id
	 * @return PayerBankConfigDto
	 */
	PayerBankConfigResponseDto getPayerBankConfig(String id);

	/**
	 * @param payerBankConfigDto
	 * @return PayerBankConfigDto
	 */
	PayerBankConfigResponseDto addPayerBankConfig(PayerBankConfigDto payerBankConfigDto);

	/**
	 * @param id
	 * @param payerBankConfigDto
	 * @return PayerBankConfigDto
	 */
	PayerBankConfigResponseDto updatePayerBankConfig(String id, PayerBankConfigDto payerBankConfigDto);

	/**
	 * @param id
	 * @return ListResponse<PayerBankConfigMapping>
	 */
	ListResponse<PayerBankConfigDetails> getPayerBankConfigMapping(String id);

	/**
	 * @param id
	 * @param payerBankDetails
	 * @return ListResponse<PayerBankConfigDetails>
	 */
	ListResponse<PayerBankConfigDetails> updatePayerBankConfigMapping(String id, PayerBankDetails payerBankDetails);

	/**
	 * @param id
	 * @return ListResponse<PayerLocationMappingResponse>
	 */
	ListResponse<PayerLocationMappingResponse> getPayerBankLocationMapping(String id);

	/**
	 * @param id
	 * @param payerBankLocationMapping
	 * @return ListResponse<PayerLocationMappingResponse>
	 */
	ListResponse<PayerLocationMappingResponse> updatePayerBankLocationMapping(String id,
			PayerBankLocationMapping payerBankLocationMapping);

	/**
	 * This method will return the list of location codes which is already mapped to
	 * configId based on location Codes,
	 * 
	 * @param mappedLocationDto,
	 * @return List<MappedConfigResponseDto>
	 */
	ListResponse<MappedConfigResponse> getMappedLocationCodes(MappedLocationDto mappedLocationDto);

}
