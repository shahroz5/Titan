/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.response.TransactionDetailsDto;
import com.titan.poss.sales.dto.response.TransactionStatusCountDto;

/**
 * Service interface for Transaction
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface TransactionService {

	/**
	 * This method will return the count of transaction based on status.
	 * 
	 * @param transactionType
	 * @param status
	 * @param subTxnType
	 * @return ListResponse<TransactionStatusCountDto>
	 */
	ListResponse<TransactionStatusCountDto> getCountOfTransaction(String transactionType, String status,
			String subTxnType);

	/**
	 * This method will return transaction details.
	 * 
	 * @param transactionType
	 * @param docNo
	 * @param customerName
	 * @param status
	 * @param subTxnType
	 * @param pageable
	 * @return PagedRestResponse<List<TransactionDetailsDto>>
	 */
	PagedRestResponse<List<TransactionDetailsDto>> getTransactionDetails(String transactionType, Integer docNo,
			Short fiscalYear, String customerName, String mobileNumber, String status, String subTxnType,
			Pageable pageable);


}
