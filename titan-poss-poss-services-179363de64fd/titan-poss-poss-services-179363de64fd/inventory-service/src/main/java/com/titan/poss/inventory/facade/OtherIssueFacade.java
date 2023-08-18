/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.facade;

import java.util.List;

import javax.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.IssueStockDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface OtherIssueFacade {

	ListResponse<InventoryCountDto> getStockRequestCount();

	PagedRestResponse<List<IssueStockDto>> listStockRequests(Integer reqDocNo, String requestType, Pageable pageable);

	IssueStockDto getStockRequest(Integer id, String requestType);

	PagedRestResponse<List<RequestStockItemResponseDto>> listStockRequestItems(Integer id, String requestType,
			String itemCode, List<String> productGroup, List<String> productCategory, String lotNumber,
			List<String> binCode, String binGroupCode, String status, Pageable pageable);

	RequestStockItemResponseDto getStockRequestItem(Integer id, String itemId, String requestType);

	ReceiveStockDto updateStockRequest(Integer id, String requestType,
			@Valid StockIssueStockConfirmDto stockRequestConfirmDto);

	void updateAllStockIssueItems(Integer id, String requestType, IssueStockItemBulkDto issueStockItemBulkDto);

	ResponseEntity<Resource> getOtherIssuePDF(Integer id, String otherIssueType, String Receive);

}
