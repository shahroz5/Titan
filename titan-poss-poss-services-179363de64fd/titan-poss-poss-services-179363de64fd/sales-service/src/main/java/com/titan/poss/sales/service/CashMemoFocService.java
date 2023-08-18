/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.IssueFocRequestDto;
import com.titan.poss.sales.dto.response.FocIssueResponseDto;
import com.titan.poss.sales.dto.response.FocPendingCMResponseDto;

/**
 * Service interface for operation on FOC pending Cash memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CashMemoFocService {

	PagedRestResponse<List<FocPendingCMResponseDto>> listFocPendingCMs(String txnType, String subTxnType, Integer docNo,
			Integer fiscalYear, Integer customerId, String transactionId, String status, Pageable pageable);

	FocIssueResponseDto issueFocItems(String txnType, String subTxnType, String refTxnId,
			IssueFocRequestDto issueFocRequestDto);

}
