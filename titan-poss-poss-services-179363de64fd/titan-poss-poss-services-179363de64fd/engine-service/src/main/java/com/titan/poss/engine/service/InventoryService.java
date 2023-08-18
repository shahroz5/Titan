/*  Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service;

import java.util.List;

import org.json.JSONException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.engine.dto.request.FocItemRequestDto;
import com.titan.poss.engine.dto.response.InventoryFocItemDto;
import com.titan.poss.engine.dto.response.ItemQuantityDto;

/**
 * Service interface for Inventory.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("EngineInventoryService")
public interface InventoryService {

	/**
	 * This method will give total quantity of items present in inventory for a give
	 * itemCode.
	 * 
	 * @param itemCode
	 * @param pageable
	 * @return PagedRestResponse<List<ItemQuantityDto>>
	 * @throws JSONException 
	 */
	PagedRestResponse<List<ItemQuantityDto>> getInventoryItemDetails(String itemCode, Pageable pageable) throws JSONException;

	/**
	 * This method will get inventory-item details for the given item code.
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @param pageable
	 * @return PagedRestResponse<List<InventoryItemDto>>
	 */
	PagedRestResponse<List<InventoryItemDto>> getInventoryItemLotDetails(String itemCode, String lotNumber,
			Pageable pageable);

	/**
	 * This method will validate whether the item is sale able or not based on
	 * inventoryId and transaction type.
	 * 
	 * @param inventoryId
	 * @param itemCode
	 * @return InventoryItemDto
	 */
	InventoryItemDto validateInventoryItem(String inventoryId, String itemCode);

	/**
	 * This method will give coin details (itemCode is optional).
	 * 
	 * @param itemCode
	 * @param withSaleableCheck
	 * @return List<CoinDetailsDto>
	 */
	ListResponse<CoinDetailsDto> getCoinDetails(String itemCode, Boolean withSaleableCheck);

	/**
	 * This Method will list the Inventory details of applicable FOC items
	 * 
	 * @param itemCodeList
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<InventoryFocItemDto>> listFocItems(FocItemRequestDto focItemRequestDto, Pageable pageable,
			Boolean isPageable);
	
	/**
	 * This method will validate whether the item is present in inventory or not
	 * inventoryId and transaction type.
	 * 
	 * @param inventoryId
	 * @param itemCode
	 * @return InventoryItemDto
	 */
	InventoryItemDto validateInventoryItems(String inventoryId, String itemCode);
}
