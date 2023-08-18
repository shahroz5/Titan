/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.dto.CancellationListDto;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.print.ReturnDto;
import com.titan.poss.sales.dto.request.CancelRequestDto;
import com.titan.poss.sales.dto.request.ConfirmCancelAfterApprovalDto;
import com.titan.poss.sales.dto.request.ConfirmCancelDto;
import com.titan.poss.sales.dto.response.CancelAdvancePendingDto;
import com.titan.poss.sales.dto.response.CancelAdvanceResponseDto;

/**
 * Service interface for Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CancellationService {

	PagedRestResponse<List<CancellationListDto>> listBillCancel(Integer docNo, String customerName, String txnType,
			String subTxnType, String customerMobileNo, Short fiscalYear, Long docDate, Pageable pageable);

	ListResponse<CancellationTypeEnum> listAllowedCancelTypes(String refTxnId, String txnType, String subTxnType);

	CancelAdvanceResponseDto confirmCancel(ConfirmCancelDto confirmCancelDto, String txnType, String subTxnType);

	/**
	 * This method will raise request for bill cancellation.
	 * 
	 * @param cancelRequestDto
	 * @param txnType
	 * @param subTxnType
	 * @return CancelAdvancePendingDto
	 */
	CancelAdvancePendingDto requestForBillCancelApproval(CancelRequestDto cancelRequestDto, String txnType,
			String subTxnType);

	/**
	 * This method will cancel the request raised.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 */
	void cancelPendingRequest(String id, String txnType, String subTxnType);

	/**
	 * this method will confirm cancel once request is approved.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param confirmCancelAfterApprovalDto
	 * @return CancelAdvanceResponseDto
	 */
	CancelAdvanceResponseDto confirmAfterApproval(String id, String txnType, String subTxnType,
			ConfirmCancelAfterApprovalDto confirmCancelAfterApprovalDto);

	ReturnDto getHeaderPrintInfo(String txnId, TxnTypeCancelEnum txnType);

}
