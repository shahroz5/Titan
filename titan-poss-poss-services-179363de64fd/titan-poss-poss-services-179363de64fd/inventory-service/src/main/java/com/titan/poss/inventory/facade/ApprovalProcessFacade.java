/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.request.ApprovalRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.ApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.request.BinRequestUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransferApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestItemDto;
import com.titan.poss.inventory.dto.response.ApprovalTransferDto;
import com.titan.poss.inventory.dto.response.ApprovalTransferItemDto;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ApprovalProcessFacade {

	public ListResponse<InventoryCountDto> getApprovalRequestCount();





	public PagedRestResponse<List<ApprovalRequestDto>> listApprovalRequests(String requestType, Integer reqDocNo,
			String reqLocationCode, String status, Pageable pageable);





	public ApprovalRequestDto getApprovalRequest(Integer requestId, String requestType);





	public PagedRestResponse<List<ApprovalRequestItemDto>> listApprovalRequestItems(Integer requestId,
			String requestType, String status, List<String> productCategory, List<String> productGroup, String itemCode,
			String lotNumber, Pageable pageable);





	public ApprovalRequestItemDto updateApprovalRequestItem(Integer requestId, String itemId, String requsetType,
			ApprovalRequestItemUpdateDto itemUpdateDto);





	public ApprovalRequestDto updateApprovalRequest(Integer requestId, String requestType,
			ApprovalRequestUpdateDto requestUpdateDto);





	public PagedRestResponse<List<BinRequestDto>> listBinApprovalRequests(Integer reqDocNo, String locationCode,
			Pageable pageable);





	public BinRequestDto updateBinApprovalRequest(Integer id, BinRequestUpdateDto binRequestUpdateDto);





	public PagedRestResponse<List<ApprovalTransferDto>> listTransferApprovalRequest(String transferType,
			Integer srcDocNo, String srcLocationCode, String status, Pageable pageable);





	public PagedRestResponse<List<ApprovalTransferItemDto>> listTransferApprovalRequestItems(Integer id,
			String transferType, String status, Pageable pageable);





	public ApprovalTransferDto updateTransferApprovalRequest(Integer id, String transferType,
			StockTransferApprovalRequestUpdateDto stUpdateDto);





	public ApprovalTransferDto getTransferApprovalRequest(Integer id, String transferType);

}
