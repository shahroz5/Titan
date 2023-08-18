/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.RefundListRequestDto;
import com.titan.poss.sales.dto.request.RefundRequestCreateDto;
import com.titan.poss.sales.dto.request.RefundUpdateRequestDto;
import com.titan.poss.sales.dto.response.RefundCreateResponseDto;
import com.titan.poss.sales.dto.response.RefundResponseDto;
import com.titan.poss.sales.dto.response.RefundUpdateResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface RefundService {

	RefundCreateResponseDto createRefundRequest(String txnType, RefundRequestCreateDto refundRequest);

	PagedRestResponse<List<RefundResponseDto>> listRefundRequest(String txnType, RefundListRequestDto refundListDto,
			Pageable pageable);

	RefundResponseDto getRefundRequest(String id, String txnType);

	RefundUpdateResponseDto updateRefundRequest(String id, String status, String txnType,
			RefundUpdateRequestDto refundUpdateRequest);

	RefundUpdateResponseDto cancelRefundRequest(String refTxnId, String txnType);

}
