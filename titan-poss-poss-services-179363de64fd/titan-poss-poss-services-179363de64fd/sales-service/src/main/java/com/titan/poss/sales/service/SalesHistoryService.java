/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.dto.CustomerDocumentsRequestDto;
import com.titan.poss.core.dto.InvoiceDocumentsDetailsDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.dto.request.CashMemoHistoryReqDto;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.AdvanceBookingHistoryDto;
import com.titan.poss.sales.dto.response.AdvanceHistoryDto;
import com.titan.poss.sales.dto.response.BillCancellationHistoryDto;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CashMemoHistoryResponse;
import com.titan.poss.sales.dto.response.GoodsExchangeDto;
import com.titan.poss.sales.dto.response.GrnHistoryResponse;
import com.titan.poss.sales.dto.response.OrderTransactionDetailsDto;

/**
 * Service interface for History
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface SalesHistoryService {

	PagedRestResponse<List<CashMemoHistoryResponse>> getCashMemoHistoryService(String searchField, String searchType,
			String subTxnType, String txnType, CashMemoHistoryReqDto cashMemoHistoryDto, Pageable pageable);

	PagedRestResponse<List<AdvanceHistoryDto>> getAdvanceHistoryService(String searchField, String searchType,
			String status, String subTxnType, String txnType, SalesHistoryReqDtoExt advanceHistoryDto,
			Pageable pageable);

	PagedRestResponse<List<BillCancellationHistoryDto>> getCancelHistoryService(String searchField, String searchType,
			String subTxnType, String txnType, SalesHistoryReqDtoExt cancelHistoryDto, Pageable pageable);

	PagedRestResponse<List<AdvanceBookingHistoryDto>> getOrderHistoryService(String searchField, String searchType,
			String actionType, String txnType, String subTxnType, String employeeCode,
			SalesHistoryReqDtoExt orderHistoryDto, Pageable pageable);

	PagedRestResponse<List<CNResponseDto>> getCreditNoteHistoryService(String searchField, String searchType,
			String status, String cnType, SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable);

	PagedRestResponse<List<CreditNoteTransferDto>> getCreditNoteTransferHistoryService(String searchField,
			String searchType, String status, String cnType, String destLocation,
			SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable);

	PagedRestResponse<List<GrnHistoryResponse>> getGoodsReturnService(String searchField, String searchType,
			String subTxnType, String txnType, String cmLocation, SalesHistoryReqDtoExt goodReturnHistoryDto,
			Pageable pageable);

	/**
	 * @param searchField
	 * @param searchType
	 * @param subTxnType
	 * @param txnType
	 * @param cancelHistoryDto
	 * @param refTepNo
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<BillCancellationHistoryDto>> getCancelGoodsExchangeHistoryService(String searchField,
			String searchType, String subTxnType, String txnType, SalesHistoryReqDtoExt cancelHistoryDto,
			Integer refTepNo, Pageable pageable);

	/**
	 * @param searchField
	 * @param searchType
	 * @param subTxnType
	 * @param txnType
	 * @param goodReturnHistoryDto
	 * @param status
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<GoodsExchangeDto>> getTepHistory(String searchField, String searchType, String subTxnType,
			String txnType, SalesHistoryReqDtoExt goodReturnHistoryDto, String status, Pageable pageable);

	PagedRestResponse<List<InvoiceDocumentsDetailsDto>> listInvoiceDocuments(String txnType, 
			CustomerDocumentsRequestDto customerDocuments,
			Pageable pageable);
}
