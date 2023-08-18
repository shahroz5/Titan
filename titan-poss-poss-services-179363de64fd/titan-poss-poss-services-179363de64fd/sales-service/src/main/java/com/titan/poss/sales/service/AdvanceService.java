/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.AdvanceDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.request.AdvanceConfirmDto;
import com.titan.poss.sales.dto.request.AdvanceMergeDto;
import com.titan.poss.sales.dto.request.AdvanceUpdateDto;
import com.titan.poss.sales.dto.response.AdvMergeResDto;
import com.titan.poss.sales.dto.response.AdvanceDto;
import com.titan.poss.sales.dto.response.CancelAdvanceResponseDto;
import com.titan.poss.sales.dto.response.GRFLiteDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.TransactionResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface AdvanceService {

	TransactionResponseDto openAdvance(String txnType, String subTxnType, TransactionCreateDto transactionCreateDto);

	void updateAdvance(String id, AdvanceUpdateDto advUpdateDto, String txnType, String subTxnType);

	CancelAdvanceResponseDto confirmAdvance(String id, AdvanceConfirmDto advConfirmDto, String txnType,
			String subTxnType, String status);

	AdvanceDto getAdvance(String id, String txnType, String subTxnType);

	void deleteAdvance(String id, String remarks, String txnType, String subTxnType);

	AdvanceDaoExt getById(String id);

	AdvMergeResDto mergeRateFreeze(AdvanceMergeDto advMergeDto, String txnType, String subTxnType);

	ListResponse<GRFLiteDto> getRateFreezeList(Integer customerId, String txnType, String subTxnType);

	AdvanceDto advanceResponse(AdvanceDaoExt adv, SalesTxnDaoExt salesTxn, String subTxnType);

	PublishResponse mergeRateFreezeTransactional(AdvanceMergeDto advMergeDto, String txnType, String subTxnType);

	PublishResponse confirmAdvanceTransactional(String id, AdvanceConfirmDto advConfirmDto, String txnType,
			String subTxnType, String status);

}
