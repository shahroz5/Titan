/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.DepositDateDto;
import com.titan.poss.sales.dto.DepositSummaryRequestDto;
import com.titan.poss.sales.dto.DepositSummaryResponseDto;
import com.titan.poss.sales.dto.FileUploadResponseDtoExt;
import com.titan.poss.sales.dto.GhsBankDepositDto;
import com.titan.poss.sales.dto.ServiceBankDepositDto;
import com.titan.poss.sales.dto.request.BankDepositUpdateRequestDto;
import com.titan.poss.sales.dto.request.BankingRequestDto;
import com.titan.poss.sales.dto.request.DepositAmountRequestDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.request.RevenueDateDto;
import com.titan.poss.sales.dto.response.BankDepositResponseDto;
import com.titan.poss.sales.dto.response.DepositAmountResponseDto;
import com.titan.poss.sales.dto.response.DepositResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface BankingService {

	/**
	 * API to get day wise bank deposit for BTQ & EGHS
	 *
	 * @param revenueDateDto
	 * @param pageable
	 * @return PagedRestResponse<List<DepositResponseDto>>
	 */
	PagedRestResponse<List<DepositResponseDto>> getBankDeposits(RevenueDateDto revenueDateDto, Pageable pageable);

	/**
	 * This method will return the list of bank deposit details.
	 * 
	 * @param paymentCode
	 * @param pageable 
	 * @param businessDateDto
	 * @return ListResponse<PaymentDto>
	 */
	PagedRestResponse<List<BankDepositResponseDto>> listBankDeposit(List<String> paymentCode, Pageable pageable);

	/**
	 * This method will update the cash denomination for bank deposit details.
	 * 
	 * @param bankDepositUpdate
	 * @return ListResponse<BankDepositDto>
	 */
	ListResponse<BankDepositResponseDto> updateBankDeposit(BankDepositUpdateRequestDto bankDepositUpdate);

	/**
	 * 
	 * @param businessDateDto
	 * @return ListResponse<BankDepositResponseDto>
	 */
	BooleanResponse getBankDeposit(BankingRequestDto businessDateDto);

	/**
	 * 
	 * @return ListResponse<BankDepositResponseDto>
	 */
	GhsBankDepositDto getGHSBankDeposit();
	
	/**
	 * @param reqFile
	 * @return
	 */
	FileUploadResponseDtoExt addGhsBankDeposit(MultipartFile reqFile);

	/**
	 * @param depositSummaryRequestDto
	 * @return
	 */
	DepositSummaryResponseDto addCashDenomination(DepositSummaryRequestDto depositSummaryRequestDto);
	
	 Map<String,List<PrintRequestDto>> getTransactionIds(DepositDateDto depositDate);
	 
	 
	 /**
	  * @param reqFile
	  * @return
	  */
	FileUploadResponseDtoExt addServicePossBankDeposit(MultipartFile reqFile);
	 
	 /**
		 * @param depositSummaryRequestDto
		 * @return
		 */
	 DepositAmountResponseDto getDepositAmount( DepositAmountRequestDto depositAmountRequest) ;
	 
	 ServiceBankDepositDto getServiceBankDeposit();

}
