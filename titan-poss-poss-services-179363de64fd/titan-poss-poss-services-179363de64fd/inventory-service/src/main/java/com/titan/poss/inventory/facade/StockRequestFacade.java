/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.inventory.dto.request.ComStockRequestDto;
import com.titan.poss.inventory.dto.request.StockRequestCreateDto;
import com.titan.poss.inventory.dto.request.StockRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.StockRequestUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.StockRequestDto;
import com.titan.poss.inventory.dto.response.StockRequestItemDto;

/**
 * Facade Layer of Stock Request Controller
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface StockRequestFacade {

	/**
	 * Will get the count of stock requests sent and received
	 * 
	 * @return - count of IBT stock requests (SENT and RECEIVED)
	 */
	public ListResponse<InventoryCountDto> getStockRequestCount();





	public PagedRestResponse<List<StockRequestDto>> listStockRequests(String requestType, String requestGroup,
			Integer reqDocNo, String status, String srcLocationCode, String reqLocationCode, Pageable pageable);





	public StockRequestDto getStockRequest(Integer stockRequestId, String requestType, String requestGroup);





	public PagedRestResponse<List<StockRequestItemDto>> listStockRequestItems(Integer stockRequestId,
			String requestType, String requestGroup, String itemCode, String productGroup, String productCategory,
			String lotNumber, String binCode, String binGroupCode, String status, Pageable pageable);





	public StockRequestDto createStockRequest(String requestType, StockRequestCreateDto stockRequestCreateDto);





	public StockRequestItemDto updateStockRequestItem(Integer stockRequestId, String itemId, String requestType,
			StockRequestItemUpdateDto itemUpdateDto);





	public StockRequestDto updateStockRequest(Integer stockRequestId, String requestType, String requestGroup,
			StockRequestUpdateDto requestUpdateDto);
	
	public StringResponse createCoStockRequest(ComStockRequestDto comStockRequest);
	

}
