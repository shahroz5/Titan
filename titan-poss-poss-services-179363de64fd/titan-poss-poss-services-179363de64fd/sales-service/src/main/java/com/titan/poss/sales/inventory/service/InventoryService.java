/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.inventory.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.response.InvWeightAndQuantityDto;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dto.request.SalesItemDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface InventoryService {

	List<InventoryDetailsDao> removeFromInventoryDetails(List<UpdateInventoryDto> removeInventoryDto, Integer docNo,
			SalesDocTypeEnum docType);

	List<InventoryDetailsDao> addInventoryDetails(List<InventoryDetailsDao> inventoryDetails, Integer docNo,
			SalesDocTypeEnum docType, Short fiscalYear);

	Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> getInvCoinDetails(
			Map<ItemCodeInvWeightDto, SalesItemDto> coinsItemCodeAndWeightMap, List<String> saleableBinGroupList,
			Boolean isReserverdBin);

	List<SyncStagingDto> updateInventoryAndSaveToStaging(List<InventoryDetailsDao> inventoryDetailLists,
			Integer stockTransactionId);

	PagedRestResponse<List<InventoryBinDto>> listBins(String name, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable);

	Page<InventoryDetailsDao> listInventoryItems(ListInventoryItemsDto listInventoryItemsDto, String binType,
			Pageable pageable);

	InventoryItemDtoList listInventoryItemsCount(ListInventoryItemsDto listInventoryItemsDto, String binType);

	InventoryItemDtoList listBintoBinAllowedItemsCount(ListInventoryItemsDto listInventoryItemsDto, String binType);

	boolean isValidForUpdate(String destinationBincode, InventoryDetailsDao inventoryDetails);

	public List<InventoryDetailsDao> updateBinById(List<UpdateInventoryDto> inventoryDto, String destinationBin,
			boolean flag);

	/**
	 * This method will check if the item is present in inventory or not (with
	 * sufficient quantity)
	 * 
	 * @param id
	 * @param itemCode
	 * @param inventoryWeight
	 * @param coinProductGroupCode
	 * @param totalQuantity
	 * @param isCoinStockCheck
	 * @return InvWeightAndQuantityDto
	 */
	InvWeightAndQuantityDto checkIfItemIsInStock(String id, String itemCode, BigDecimal inventoryWeight,
			String coinProductGroupCode, Short totalQuantity, Boolean isCoinStockCheck);

	/**
	 * @param idList
	 * @return
	 */
	List<InventoryDetailsDao> getItemsByIdAndLocationCode(List<String> idList);
	
	InventoryDetailsDao getItemByIdAndLocationCode(String id);

	/**
	 * @param name
	 * @param locationCode
	 * @param numberOfDays
	 * @return
	 */
	List<InventoryDetailsDao> getReserveBinItemsList(String name, String locationCode, Integer numberOfDays);

	List<InventoryDetailsDao> getInventoryDetails(List<String> inventoryIds);

	List<InventoryDetailsDao> updateInventoryCutPeice(InventoryDetailsDao updateInventoryDto, Integer docNo,
			String inventoryId, Map<String, StandardPriceResponseDto> goldRate,
			CutPieceTepPriceResponseDto cutPieceTepPriceResponse, String transactionType,
			StockTransactionDetailsDaoExt stockTransactionDetails);

	List<InventoryDetailsDao> getItemsByItemCodeAndLotNumber(String itemCode, String lotNumber);

	List<InventoryDetailsDao> getItemsByItemCodeAndBinGroupCodeAndLocationCode(String itemCode, String binGroupCode,
			String locationCode);
}