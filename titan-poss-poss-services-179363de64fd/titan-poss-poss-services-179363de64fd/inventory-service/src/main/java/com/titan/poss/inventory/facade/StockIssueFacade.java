/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.facade;

import java.util.List;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.IssueStockItemUpdateDto;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.StockIssueCancelDto;
import com.titan.poss.inventory.dto.request.StockIssueItemDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;
import com.titan.poss.inventory.dto.request.StockIssueTransferConfirmDto;
import com.titan.poss.inventory.dto.request.StockTransferCancelDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.IssueStockDto;
import com.titan.poss.inventory.dto.response.IssueStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface StockIssueFacade {

	ListResponse<InventoryCountDto> getStockRequestCount();

	PagedRestResponse<List<IssueStockDto>> listStockRequests(Integer reqDocNo, String requestType, Pageable pageable);

	IssueStockDto getStockRequest(Integer id, String requestType);

	PagedRestResponse<List<IssueStockItemDto>> listStockTransferItems(Integer id, String transferType, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status,String cfaLocationCode, Pageable pageable);

	RequestStockItemResponseDto getStockRequestItem(String requestType, Integer id, String itemId);

	IssueStockItemDto getStockTransferItem(String transferType, Integer id, String itemId);

	ReceiveStockDto confirmStockRequest(Integer id, String requestType,
			StockIssueStockConfirmDto stockRequestConfirmDto);

	ReceiveStockDto confirmStockTransfer(Integer id, String transferType,
			StockIssueTransferConfirmDto stockTransferConfirmDto);

	void updateAllStockIssueRequestItems(Integer id, String requestType, IssueStockItemBulkDto issueStockItemBulkDto);

	ReceiveStockDto createStockIssue(String transferType);
	
	ReceiveStockDto getStockIssueDetail(Integer id, String transferType,String status);

	void createStockIssueItems(Integer id, String string, StockIssueItemDto stockIssueItemDto);

	void removeStockIssue(Integer id, RemoveStockItemsDto removeStockItemDto, String transferType);

	RequestStockItemResponseDto updateStockRequestItem(Integer id, String itemId, String requestType,
			IssueStockItemUpdateDto issueStockItemUpdateDto);

	PagedRestResponse<List<RequestStockItemResponseDto>> listStockRequestItems(Integer id, String requestType,
			String itemCode, List<String> productGroup, List<String> productCategory, String lotNumber,
			List<String> binCode, String binGroupCode, String status, Pageable pageable);

	ResponseEntity<Resource> getStockRequestIssuePDF(Integer id, String string);

	ResponseEntity<Resource> getStockTransferIssuePDF(Integer id, String string);

	void updateStockRequest(Integer id, StockIssueCancelDto stockIssueCancelDto, String issueType);

	void updateStockTransfer(Integer id, String transferType, StockTransferCancelDto stockTransferCancelDto);
	
	void checkIfItemsAreInRequestAndPrevent(InventoryDetailsDaoExt inventoryDetail, Short qty);
	
	void getInvDetailsOfItemsInRequestForRequestFlow(StockRequestDao stockRequest);
	
	void getInvDetailsOfItemsInRequestForTransferFlow(StockTransferDao stockTransfer1);
}
