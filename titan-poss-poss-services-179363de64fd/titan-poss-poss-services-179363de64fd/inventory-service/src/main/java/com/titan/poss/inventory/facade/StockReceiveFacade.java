/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.ReceivedWeightDto;
import com.titan.poss.inventory.dto.request.ReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.request.StnCancelDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface StockReceiveFacade {
	
	public ListResponse<InventoryCountDto> getStockReceiveCount(String stockReceiveStatus);

	public PagedRestResponse<List<ReceiveStockDto>> listStockReceive(Integer srcdocno, String stockReceiveType,
			String stockReceiveStatus, Pageable pageable);
	
	public PagedRestResponse<List<ReceiveStockDto>> listStockReceiveStnCancel(Integer srcdocno,String stockReceiveType,
			String stockReceiveStatus,Pageable pageable);

	public ReceiveStockDto getStockReceive(Integer id, String stockReceiveType);

	public ReceiveStockItemDto getStockReceiveItem(Integer id, String itemId, String stockReceiveType);

	public ReceiveStockDto getStockReceiveStnCancel(Integer id, String status, String stockReceiveType);

	public ReceiveStockItemDto updateStockReceiveItem(Integer id, String itemId,
			ReceiveStockItemUpdateDto receiveStockItemUpdateDto, String stockReceiveType);

	public void updateAllStockReceiveItems(Integer id, String stockReceiveType,
			ReceiveStockItemBulkDto receiveStockItemBulkDto);

	public ReceiveStockDto updateStockReceive(Integer id, String stockReceiveType,
			ReceiveStockConfirmDto receiveStockConfirmDto);
	
	public ReceiveStockDto cancelStockReceive(Integer id, String stockReceiveType,
			StnCancelDto stnCancelDto);

	public PagedRestResponse<List<ReceiveStockItemDto>> listStockReceiveItems(Integer id, String stockReceiveType,
			String stockReceiveStatus, String itemCode, String binGroupCode, String lotNumber, List<String> binCode,
			List<String> productGroup, List<String> productCategory, Pageable pageable);
	
	public PagedRestResponse<List<ReceiveStockItemDto>> listCancelStockReceiveItems(Integer id, String stockReceiveType,
			String stockReceiveStatus, String itemCode, String binGroupCode, String lotNumber, List<String> binCode,
			List<String> productGroup, List<String> productCategory, Pageable pageable);
	
	public ReceivedWeightDto getTotalReceivedWeight(Integer id, String stockReceiveType, String stockReceiveStatus,
			String itemCode, String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory);
	
	public PagedRestResponse<List<ReceiveStockDto>> getStnFromErp(String srcdocno, String transferType);
	
	public StnCancelDto listStockReceiveStnCancelCount(String stockReceiveType,
			String stockReceiveStatus);

}
