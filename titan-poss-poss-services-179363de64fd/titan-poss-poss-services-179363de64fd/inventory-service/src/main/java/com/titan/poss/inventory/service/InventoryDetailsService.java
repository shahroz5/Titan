/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.BinUpdateBulkDto;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.response.AvailableBinCode;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationListDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface InventoryDetailsService {

	PagedRestResponse<List<InventoryBinDto>> listBins(String name, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable);

	Page<InventoryDetailsDaoExt> listInventoryItems(ListInventoryItemsDto listInventoryItemsDto, String binType,
			Pageable pageable);

	// batch (bin-bin) insert nd update
	void updateBinInventoryItems(List<InventoryDetailsDaoExt> detailsList);
	
	void updateRequestDetailsForInventoryItems(List<InventoryDetailsDaoExt> detailsList);

	// get by only id
	List<InventoryDetailsDaoExt> getInventoryDetailsByIdList(List<String> inventortIds);

	// get by id and location code
	List<InventoryDetailsDaoExt> getItemsByIdAndLocationCode(List<String> idList);

	boolean isValidForUpdate(String destinationBincode, InventoryDetailsDaoExt inventoryDetails);

	// can use listInventoryItems
	List<InventoryDetailsDaoExt> findByBinCodeAndLocationCode(String bin, String locationCode);

	// can use listInventoryItems
	List<InventoryDetailsDaoExt> findByBinCodeAndProductGroupAndLocationCode(String bin, String productGroup,
			String locationCode);

	// need to remove this method as its called in for loop
	Optional<InventoryDetailsDaoExt> findById(String inventoryId);

	// remove
	Optional<InventoryDetailsDaoExt> findOne(Example<InventoryDetailsDaoExt> criteria);

	// Queries related to Stock request starts here
	// can use listInventoryItems
	Optional<InventoryDetailsDaoExt> findByLocationCodeAndItemCodeAndLotNumber(String locationCode, String itemCode,
			String lotNumber);

	// can use listInventoryItems
	List<InventoryDetailsDaoExt> findAllByLocationCodeAndItemCodeAndBinGroupCodeIn(String srcLocationCode,
			String itemCode, List<String> binGroupList);

	// Queries related to stock request ends here

	// batch add or update to inventory
	void addInventoryDetails(List<InventoryDetailsDaoExt> inventoryDetails, Integer docNo, DocTypeEnum docType);

	// batch remove from inventory
	void removeFromInventoryDetails(List<InventoryDetailsDaoExt> inventoryDetails, Integer docNo, DocTypeEnum docType);
	
	List<ItemLocationListDto> getItemsAvailableLocationsList(List<String> itemList, String locationCode,
			Long requestCount, List<String> locationList, List<String> binGroupList);

	void updateBinInventoryItems(String source, String destination, String destinationBinGroup,
			InventorySearchCategoryEnum inventorySearchCategory, List<InventoryDetailsDaoExt> invs, Integer docNo,
			DocTypeEnum docType);

	// test Method
	void updateAllItems(BinUpdateBulkDto binUpdateBulkDto, List<InventoryDetailsDaoExt> invs, Integer docNo,
			DocTypeEnum docType);

	List<AvailableBinCode> getAvailableBinCodesByLocation(String locationCode);

	List<InventoryDetailsDaoExt> listAllInventoryItems(ListInventoryItemsDto listInventoryItemsDto, String binType);
	
	InventoryItemDtoList listInventoryItemsCount(ListInventoryItemsDto listInventoryItemsDto, String binType);

	/*
	 * void addInventoryDtlsTrx(List<InventoryDetailsDaoExt> inventoryDetails,
	 * String binCode, Short fiscalYear, Integer docNo, DocTypeEnum docType,
	 * InventoryDetailsActionEnum actionType);
	 */

	/*
	 * void addInventoryDtlsTrx(List<InventoryDetailsDaoExt> detailsList, Short
	 * fiscalYear, Integer docNo, DocTypeEnum docType, InventoryDetailsActionEnum
	 * actionType);
	 */


	List<Object[]> validateDefectiveAndDisputeItems(List<String> inventoryIds);

	/**
	 * @param invList
	 */
	void updateIssuedQuantity(List<InventoryDetailsDaoExt> invList);

	List<InventoryDetailsDaoExt> findAllByLocationCodeAndItemCodeAndLotNumberAndSerialNumberAndBinCode(
			String locationCode, String itemCode, String lotNumber, BigDecimal serialNumber, String binCode);
	
	
	Optional<InventoryDetailsDaoExt> findByItemCodeAndLotNumberAndBinCodeAndBinGroupCode(String itemCode, String lotNumber, String binCode,String binGroupCode);
	

	List<InventoryDetailsDaoExt> getInventoryItemsDetailsList(String srcLocationCode, String itemCode,
			List<String> binGroupList);
}
