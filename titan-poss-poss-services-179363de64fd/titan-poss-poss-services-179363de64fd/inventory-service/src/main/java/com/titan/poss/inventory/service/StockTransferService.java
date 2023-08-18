/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dto.request.HistoryTransferItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface StockTransferService {

	List<InventoryCountDto> getStockTransferCount(String locationCode, String status, List<String> transferType);

	Page<StockTransferDao> findStockTransferByCriteria(Example<StockTransferDao> criteria, Pageable pageable);

	StockTransferDao findStockTransferByIdAndDestLocationCodeAndTransferType(Integer id, String locationCode,
			String transferType);

	StockTransferDetailsDao findStockTransferDetailsByCriteria(
			Example<StockTransferDetailsDao> stockTransferDetailsExample);

	Page<StockTransferDetailsDao> findListStockTransferDetailsByCriteria(
			Example<StockTransferDetailsDao> stockTransferDetailsExample, Pageable pageable);

	StockTransferDetailsDao findStockTransferDetailsByItemIdAndStockTransfer(String stockTransferDetailsId,
			StockTransferDao stockTransfer);

	StockTransferDetailsDao saveOrUpdateStockTransferDetails(StockTransferDetailsDao stockTransferDetails);

	void verifyAllStockTransferItems(String status, String binCode, StockTransferDao stockTransfer);

	List<StockTransferDetailsDao> findAllStockTransferDetailsWithStatus(StockTransferDao stockTransfer, String status);

	List<StockTransferDetailsDao> findAllStockTransferDetails(StockTransferDao stockTransfer);

	StockTransferDao saveOrUpdateStockTransfer(StockTransferDao stockTransfer);

	void verifyAllItemsByItemId(StockTransferDao stockTransfer, String status, List<String> itemIds);

	void updateAllStockTransferDetailsByItemId(StockTransferDao stockTransfer, List<String> itemIds, String binCode);

	List<Object[]> getJointList(Integer id, List<String> bin, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, String sortParameter,
			List<String> productGroupList, List<String> binCode,Date businessDate, int startsAt, int pageSize);

	int getPageSize(Integer id, List<String> bin, List<String> productGroup, String status, String itemCode, String lotNumber,
			String locationCode, List<String> productCategory, List<String> productGroupList, List<String> binCode,Date businessDate);
	
	List<Object[]> getJointListForDefective(Integer id, List<String> bin, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, String sortParameter,
			List<String> productGroupList, List<String> binCode,Date businessDate, int startsAt, int pageSize);

    int getPageSizeForDefective(Integer id, List<String> bin, List<String> productGroup, String status, String itemCode, String lotNumber,
			String locationCode, List<String> productCategory, List<String> productGroupList, List<String> binCode,Date businessDate);

	void saveAll(List<StockTransferDetailsDao> stList);

	Optional<StockTransferDao> findByIdAndTransferType(Integer id, String transferType);

	Integer getOpenItemCount(StockTransferDao stockTransfer);

	Integer getUnassignedBinCount(StockTransferDao stockTransfer);

	void changeItemStatus(String status, StockTransferDao stockTransfer);

	void updateAllStockIssueDetailsByItemIds(StockTransferDao stockTransfer, String status);

	List<StockTransferDao> findByTransferTypeAndStatusAndSrcLocationCode(String transferType, String status,
			String locationCode);

	Optional<StockTransferDao> getStockTransferById(Integer id);

	List<StockTransferDetailsDao> findAllTransferDetailsByItemIds(List<String> itemIds);

	void deleteInBatch(List<StockTransferDetailsDao> stockTransferDetails);

	// Service related to IBT starts here

	StockTransferDao getOne(Integer id);

	void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id);

	List<Object[]> checkAvailableQuantityWithInventory(Integer id);

	void updateTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy);

	List<StockTransferDetailsDao> findByStockTransferAndStatus(StockTransferDao stockTransfer, String status);
	// Service related to IBT ends here

	Page<StockTransferDetailsDao> listStockReceiveItems(StockTransferDao stockTransfer, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status, Pageable pageable);
	
	public BigDecimal listStockReceiveItemsWeightSum(StockTransferDao stockTransfer, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status);

	void updatePrintCountStockIssue(Short printCount, Integer id);

	void updateReceivedTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy);

	StockTransferDao findStockTransferByIdAndSrcLocationCodeAndTransferType(Integer id, String locationCode,
			String transferType);

	void updateAllStockTransferDetailsByStockTransferId(String status, StockTransferDao stockTransfer);

	// stock transfer history method starts here
	Page<StockTransferDao> listStockTransferIssueHistory(String srcLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable);
	
	Page<StockTransferDao> listStockTransferIssueLegacyIbtHistory(String srcLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType,  Pageable pageable);
	
	Page<StockTransferDao> listStockTransferIssueIbtHistory(String srcLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable);

	Page<StockTransferDao> listStockTransferReceiveHistory(String destLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable);

	Page<StockTransferDetailsDao> listStockTransferItemHistory(StockTransferDao stockTransfer,
			HistoryTransferItemRequestDto historyTransferItemRequestDto, Pageable pageable);
	// stock transfer history method ends here

	StockTransferDao findStockTransferById(Integer id);

	StockTransferDao findStockTransferByIdAndSrcLocationCode(Integer id, String locationCode);

	StockTransferDao findStockTransferByIdAndDestLocationCode(Integer id, String locationCode);
	
	Page<StockTransferDao> findStockTransferForStnCancel(Integer srcdocno,String locationCode, String status,
			String transferType,Date businessDate,Pageable pageable);
	
	Long findStockTransferForStnCancelCount(String locationCode, String status,
			String transferType,Date compareDate);
	 StockTransferDao getStockTransferByIdAndType(Integer id,String status, String transferType);
	 

	 List<Object[]> getJointListForHeader(Integer id, List<String> bin, List<String> productGroup, String status, 
			 String locationCode, Date businessDate);

	 List<Object[]> getJointListForDefectiveHeader(Integer id, List<String> bin, List<String> productGroup, String status, 
			 String locationCode, Date businessDate);
	 
	 List<Object[]> getJointListForBtqHeader(Integer id, List<String> productGroup, String status, 
			 String locationCode, List<String> bin, Date businessDate);


}
