/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dto.request.HistoryTransactionItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface StockTransactionService {

	StockTransactionDao addBinStockTransaction(String status, String transactionType);

	void addStockTransactionDetails(List<StockTransactionDetailsDao> stockTransactionDetails);

	StockTransactionDao updateStockTransaction(StockTransactionDao stockTransaction);

	List<InventoryCountDto> getStockTransactionCount(String locationCode, String status, List<String> transactionTypes);

	Page<StockTransactionDao> findStockTransactionByCriteria(Example<StockTransactionDao> stockTransactionCriteria,
			Pageable pageable);

	StockTransactionDao findStockTransactionByIdAndLocationCodeAndTransactionType(Integer id, String locationCode,
			String transactionType);

	StockTransactionDetailsDao findStockTransactionDetailsByCriteria(
			Example<StockTransactionDetailsDao> stockTransactionDetailsExample);

	Page<StockTransactionDetailsDao> findStockTransactionDetailsByCriteria(
			Example<StockTransactionDetailsDao> stockTransactionDetailsCriteria, Pageable pageable);

	StockTransactionDetailsDao findByItemIdAndStockTransaction(String itemId, StockTransactionDao stockTransaction);

	StockTransactionDetailsDao saveOrUpdateStockTransactionDetails(StockTransactionDetailsDao stockTransactionDetails);

	void verifyAllItemsByItemId(StockTransactionDao stockTransaction, String status, List<String> itemIds);

	void updateAllStockTransactionDetailsByItemId(StockTransactionDao stockTransaction, List<String> itemIds,
			String binCode, String binGroupCode);

	void verifyAllStockTransactionItems(String status, String binCode, String binGroupCode,
			StockTransactionDao stockTransaction);

	List<StockTransactionDetailsDao> findAllStockTransactionDetails(StockTransactionDao stockTransaction);

	StockTransactionDao saveOrUpdateStockTransaction(StockTransactionDao stockTransaction);

	List<StockTransactionDetailsDao> saveAll(List<StockTransactionDetailsDao> stList);

	List<StockTransactionDetailsDao> findByStockTransactionAndStatus(StockTransactionDao stockTransaction,
			String status);

	Integer getOpenItemCount(StockTransactionDao stockTransaction);

	Integer getUnassignedBinCount(StockTransactionDao stockTransaction);

	void updateAllStockTransactionDetails(StockTransactionDao stockTransaction, String status);

	Page<StockTransactionDetailsDao> listOtherReceiveItems(StockTransactionDao stockTransaction, String itemCode,
			String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory, String status, Pageable pageable);

	StockTransactionDao getOtherIssuePDF(Integer id, String transactionType);

	void updatePrintCountOtherIssue(Short printCount, Integer id);

	void updateTotalWeightAndQuantity(Integer id, Date date, String lastModifiedBy);

	// stock transaction history method starts here
	Page<StockTransactionDao> listStockTransactionIssueHistory(String transactionType, String locationCode,
			HistoryTransactionRequestDto historyTransactionRequestDto, Date startDate, Date endDate,
			List<String> statues, Pageable pageable);

	Page<StockTransactionDao> listStockTransactionReceiveHistory(String transactionType, String locationCode,
			HistoryTransactionRequestDto historyTransactionRequestDto, Date startDate, Date endDate,
			List<String> statues, Pageable pageable);

	Page<StockTransactionDetailsDao> listStockTransactionItemHistory(StockTransactionDao stockTransaction,
			HistoryTransactionItemRequestDto historyTransactionItemRequestDto, Pageable pageable);

	StockTransactionDao findStockTransactionById(Integer id);

}
