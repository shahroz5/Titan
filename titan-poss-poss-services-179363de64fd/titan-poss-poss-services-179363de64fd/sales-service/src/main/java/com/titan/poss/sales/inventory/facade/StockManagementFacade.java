/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.inventory.facade;

import java.util.List;

import javax.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.BinUpdateBulkDto;
import com.titan.poss.inventory.dto.request.InventoryBinUpdateDto;
import com.titan.poss.inventory.dto.request.InventoryStageBinUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransactionAddItemDto;
import com.titan.poss.inventory.dto.request.StockTransactionConfirmDto;
import com.titan.poss.inventory.dto.request.StockTransactionUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransactionUpdateItemDto;
import com.titan.poss.inventory.dto.response.BinToBinFileStageDto;
import com.titan.poss.inventory.dto.response.FileItemStageDto;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryBinToBinItemsDtoList;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.StockTransactionDocNoDto;
import com.titan.poss.inventory.dto.response.StockTransactionDto;
import com.titan.poss.inventory.dto.response.StockTransactionItemDto;
import com.titan.poss.sales.dto.response.BaseTransactionDetailsDto;
import com.titan.poss.sales.dto.response.StockTransactionStatusCountDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface StockManagementFacade {

	PagedRestResponse<List<InventoryBinDto>> listBins(String binCode, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable);

	PagedRestResponse<List<InventoryBinDto>> listProductCategory(String productCategory, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable);

	PagedRestResponse<List<InventoryBinDto>> listProductGroup(String productGroup, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable);

	PagedRestResponse<InventoryItemDtoList> listInventoryItems(List<String> binCode, String itemCode,
			List<String> productCategory, List<String> productGroup, String binGroupCode, String lotNumber,
			String binType, Boolean isPageable, Pageable pageable);

	StockTransactionDocNoDto updateAllInventoryItemsByBinCode(String srcBincode, String destinationBincode,
			String destinationBinGroup, InventorySearchCategoryEnum bincode);

	StockTransactionDocNoDto updateAllInventoryItemsByProductCategory(String productCategory, String destinationBincode,
			String destinationBinGroup, InventorySearchCategoryEnum bincode);

	SchedulerResponseDto updateFromReserveBin(String locationCode);

	StockTransactionDocNoDto updateAllInventoryItemsByProductGroup(String productGroup, String destinationBincode,
			String destinationBinGroup, InventorySearchCategoryEnum bincode);

	/**
	 * @param binTransferItems
	 * @return StockTransactionDocNoDto
	 */
	StockTransactionDocNoDto updateInventoryItems(Integer id,@Valid InventoryBinUpdateDto binTransferItems);

	/**
	 * @param binUpdateBulkDto
	 * @return StockTransactionDocNoDto
	 */
	StockTransactionDocNoDto updateAllItems(@Valid BinUpdateBulkDto binUpdateBulkDto);

	/**
	 * @param locationCode
	 * @param numberOfDays
	 * @return
	 */
	SchedulerResponseDto moveItemsFromReserveBin(String locationCode, Integer numberOfDays);

	SchedulerResponseDto moveItemsFromReserveBin(String locationCode);

	StockTransactionDto createStockManagements(String transactionType);

	StockTransactionDto getStockManagements(String id, String transactionType);

	StockTransactionItemDto addItems(String id, String transactionType,
			StockTransactionAddItemDto stockTransactionAddItemDto);

	StockTransactionItemDto getItems(String id, String transactionType, String itemId);

	StockTransactionItemDto updateItems(String id, String transactionType, String itemId,
			StockTransactionUpdateItemDto stockTransactionUpdateItemDto);

	StockTransactionDto updateStockTransaction(String id, String transactionType,
			StockTransactionUpdateDto stockTransactionUpdateDto);

	StockTransactionDto confirmStockTransaction(String id, String transactionType,
			StockTransactionConfirmDto stockTransactionConfirmDto);

	StockTransactionDto deleteStockTransactionItem(String id, String transactionType, String itemId);

	void deleteStockTransaction(String id, String transactionType);

	PagedRestResponse<List<BaseTransactionDetailsDto>> getTransactionDetails(String transactionType, Integer docNo,
			Short fiscalYear, String status, Pageable pageable);

	ListResponse<StockTransactionStatusCountDto> getStockManagementsCount(String transactionType, String status,
			Pageable pageable);
	
	InventoryItemDtoList uploadFile(MultipartFile file);
	
	FileItemStageDto uploadFileBinToBinTransfer(MultipartFile file);
	
	InventoryBinToBinItemsDtoList getBinsTransferItems(Integer id , Pageable pageable);
	
	StockTransactionDocNoDto updateAllUploadedInventoryItemsByBinCode(Integer id,  String destinationBincode,
			String destinationBinGroup);
	
	PagedRestResponse<List<BinToBinFileStageDto>> listBinToBinStageData(Pageable pageable);

	StockTransactionDocNoDto updateInventoryStageItems( Integer id, InventoryStageBinUpdateDto stageBinTransferItems);

	ResponseEntity<Resource> getInventoryItemLotDetails(String itemCode, String lotNumber, Boolean isHallmarking);
}
