/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.request.HistoryInvoiceItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryInvoiceRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueRequestDto;
import com.titan.poss.inventory.dto.request.HistoryRequestBinDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferRequestDto;
import com.titan.poss.inventory.dto.response.HistoryBinRequestDto;
import com.titan.poss.inventory.dto.response.HistoryConversionItemsDto;
import com.titan.poss.inventory.dto.response.HistoryInvoiceDto;
import com.titan.poss.inventory.dto.response.HistoryInvoiceItemDto;
import com.titan.poss.inventory.dto.response.HistoryIssueDto;
import com.titan.poss.inventory.dto.response.HistoryOtherReceiveStockDto;
import com.titan.poss.inventory.dto.response.HistoryReceiveStockDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface HistoryFacade {

	PagedRestResponse<List<HistoryReceiveStockDto>> listStockTransfer(String transferType,
			HistoryTransferRequestDto historyTransferRequestDto, Pageable pageable,Boolean isLegacy);

	PagedRestResponse<List<ReceiveStockItemDto>> listStockTransferItems(Integer id,
			HistoryTransferItemRequestDto historyTransferItemRequestDt, Pageable pageable, String actionType,
			String transferType);

	PagedRestResponse<List<HistoryIssueDto>> listStockRequest(String reqeustType,
			HistoryIssueRequestDto historyIssueRequestDto, Pageable pageable);

	PagedRestResponse<List<RequestStockItemResponseDto>> listStockIssueItems(Integer id, String requestType,
			HistoryIssueItemRequestDto historyIssueItemRequestDto, String actionType, Pageable pageable);

	PagedRestResponse<List<HistoryInvoiceDto>> listStockInvoice(String invoiceType,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Pageable pageable);

	PagedRestResponse<List<HistoryInvoiceItemDto>> listStockInvoiceItems(Integer invoiceId, String invoiceType,
			HistoryInvoiceItemRequestDto historyInvoiceItemRequestDto, String actionType, Pageable pageable);

	PagedRestResponse<List<HistoryOtherReceiveStockDto>> listStockTransaction(String transactionType,
			HistoryTransactionRequestDto historyTransactionRequestDto, Pageable pageable);

	PagedRestResponse<List<OtherReceiveStockItemDto>> listStockTransactionItems(Integer id, String transactionType,
			HistoryTransactionItemRequestDto historyTransactionItemRequestDto, Pageable pageable);

	HistoryReceiveStockDto getStockTransfer(Integer id, String transferType, String actionType);

	HistoryIssueDto getStockRequest(Integer id, String requestType, String actionType);

	HistoryInvoiceDto getStockInvoice(Integer id, String invoiceType, String actionType);

	HistoryOtherReceiveStockDto getStockTransaction(Integer id, String transactionType);

	PagedRestResponse<List<HistoryBinRequestDto>> listBinRequest(HistoryRequestBinDto historyRequestBinDto,
			Pageable pageable);

	HistoryConversionItemsDto listConversionItems(Integer id);

}
