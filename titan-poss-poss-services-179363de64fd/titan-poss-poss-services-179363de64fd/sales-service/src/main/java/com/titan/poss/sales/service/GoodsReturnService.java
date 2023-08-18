/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import javax.validation.Valid;

import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.dto.print.GoodsReturnPrintDto;
import com.titan.poss.sales.dto.request.BaseGrnItemDto;
import com.titan.poss.sales.dto.request.ConfirmGRNDto;
import com.titan.poss.sales.dto.request.GRNConfirmAfterApprovalDto;
import com.titan.poss.sales.dto.request.GRNRequestDto;
import com.titan.poss.sales.dto.response.CancelAdvancePendingDto;
import com.titan.poss.sales.dto.response.CancelGRNResponseDto;
import com.titan.poss.sales.dto.response.GRNInitateResponseDto;
import com.titan.poss.sales.dto.response.GRNResponseDto;
import com.titan.poss.sales.dto.response.GrnPriceDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface GoodsReturnService {

	public GRNInitateResponseDto initiateGRNWithValidation(String locationCode, Integer refDocNo, Short refFiscalYear,
			String txnType, String subTxnType);

	public CancelGRNResponseDto confirmWithOutApproval(ConfirmGRNDto cancelGRNDto, String txnType, String subTxnType);

	public CancelAdvancePendingDto requestForApproval(GRNRequestDto grnRequestDto, String txnType, String subTxnType);

	public GRNResponseDto getById(String id, String txnType, String subTxnType,String creditNoteType);

	public CancelGRNResponseDto confirmAfterApproval(String id, GRNConfirmAfterApprovalDto grnConfirmAfterApprovalDto,
			String txnType, String subTxnType);

	public List<ReturnableItemsDto> listReturnableItems(String cmId);

	GoodsReturnPrintDto getPrintInfo(String txnId);

	ListResponse<String> listItemIdsAllowedForGRN(String cmId);

	ListResponse<ItemDetailsResponseDto> listItemsAllowedForReturnByGrnCn(String cnId);

	public GrnPriceDto calculateFinalPrice(@Valid BaseGrnItemDto grnItemDto, String txnType, String subTxnType);
	
	public ItemDetailsResponseDto getItemDetails(String refTxnId,ReturnableItemsDto returnableItemsDto);

	public void updateGrnFromLegacytoNap(GrnLegacyUpdateDto grnLegacyUpdateDto);
}
