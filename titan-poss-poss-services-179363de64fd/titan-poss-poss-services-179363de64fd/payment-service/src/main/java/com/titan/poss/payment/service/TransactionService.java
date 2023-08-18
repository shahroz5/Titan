/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.response.TransactionResponseDto;

/**
 * Service interface for Transaction Master.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface TransactionService {

	/**
	 * This method will return the list of transaction types based on filter.
	 * 
	 * @param searchType
	 * @param isTrue
	 * @param transactionType
	 * @param pageable
	 * @param isPageable
	 * @return PagedRestResponse<List<TransactionResponseDto>>
	 */
	PagedRestResponse<List<TransactionResponseDto>> listTransactionTypes(String searchType, Boolean isTrue,
			String transactionType, Pageable pageable, Boolean isPageable);

	/**
	 * This method will get transaction type values only, based on input.
	 * 
	 * @param searchType
	 * @param isTrue
	 * @return List<String>
	 */
	List<String> getTransactionTypes(String searchType, Boolean isTrue);
}
