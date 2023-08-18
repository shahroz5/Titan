/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.request.OtherReceiveItemBulkDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockCreateDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface OtherReceiveFacade {

	public ListResponse<InventoryCountDto> getOtherReceiveCount(String otherReceiveStatus);

	public PagedRestResponse<List<OtherReceiveStockDto>> listOtherReceive(Integer docNo, String otherReceiveType,
			String otherReceiveStatus, Pageable pageable);

	public OtherReceiveStockDto getOtherReceive(Integer id, String otherReceiveType);

	public OtherReceiveStockItemDto getOtherReceiveItem(Integer id, String itemId, String otherReceiveType);

	public ReceiveStockItemDto updateOtherReceiveItem(Integer id, String itemId,
			ReceiveStockItemUpdateDto receiveStockItemUpdateDto, String otherReceiveType);

	public void updateAllOtherReceiveItems(Integer id, String stockReceiveType,
			OtherReceiveItemBulkDto otherReceiveStockItemBulkDto);

	OtherReceiveStockDto createStockReceiveItems(String otherReceiveType,
			OtherReceiveStockCreateDto otherReceiveStockCreateDto);

	OtherReceiveStockDto updateOtherReceive(Integer id, String transactionType,
			OtherReceiveStockConfirmDto otherReceiveStockConfirmDto);

	public PagedRestResponse<List<OtherReceiveStockItemDto>> listOtherReceiveItems(Integer id, String otherReceiveType,
			String itemCode, String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory, String otherReceiveStatus, Pageable pageable);

}
