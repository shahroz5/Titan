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

import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.dto.ItemsParamListDto;
import com.titan.poss.inventory.dto.request.HistoryInvoiceRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface InvoiceService {

	List<InventoryCountDto> getPurchaseInvoiceCount(String locationCode, String invoiceStatus, String invoiceType);

	Page<StockInvoiceDao> listInvoices(Example<StockInvoiceDao> criteria, Pageable pageable);

	Optional<StockInvoiceDao> getInvoiceById(Example<StockInvoiceDao> criteria);

	Optional<StockInvoiceDetailsDao> getInvoiceItemById(Example<StockInvoiceDetailsDao> criteria);

	Page<StockInvoiceDetailsDao> findPurchaseInvoiceItems(Example<StockInvoiceDetailsDao> criteria, Pageable pageable);

	List<Object[]> listInvoiceReturnItems(ItemsParamListDto params, Pageable pageable);

	List<StockInvoiceDao> findByInvoiceTypeAndStatusAndSrcLocationCode(String invoiceType, String status,
			String locationCode);

	StockInvoiceDao createStockInvoice(StockInvoiceDao stockInvoice);

	// items to save in invoiceDetails table
	void saveItemLevelInvoice(StockInvoiceDetailsDao invoiceDetailNew);

	void verifyAllItems(String status, StockInvoiceDao stockInvoice);

	void updateAllStockTransferDetails(StockInvoiceDao stockInvoice, String binCode, String status);

	void verifyAllItemsByItemId(StockInvoiceDao stockInvoice, String status, List<String> itemId);

	void updateAllStockTransferDetailsByItemId(StockInvoiceDao stockInvoice, List<String> itemId, String binCode,
			String status);

	Integer getOpenItemCount(StockInvoiceDao stockInvoice);

	// List of items to save in invoiceDetails table
	void saveAllListItemsToInvoice(List<StockInvoiceDetailsDao> itemsToSave);

	Integer getUnassignedBinCount(StockInvoiceDao stockInvoice);

	StockInvoiceDao saveInvoice(StockInvoiceDao stockInvoice);

	void changeItemStatus(String status, StockInvoiceDao stoockInvoice);

	void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer invoiceId, BigDecimal totalDiscount);

	StockInvoiceDao getOne(Integer invoiceId);

	List<StockInvoiceDetailsDao> findByStockInvoice(StockInvoiceDao stockInvoice);

	void deleteInBatch(List<StockInvoiceDetailsDao> stockInvoiceDetailsList);

	List<StockInvoiceDetailsDao> findAllById(List<String> list);

	void changeItemDetailStatus(String string, StockInvoiceDao stockInvoice);

	List<Object[]> checkAvailableQuantityWithInventory(Integer id);

	List<StockInvoiceDetailsDao> findByStockInvoiceAndStatus(StockInvoiceDao stockInvoice, String status);

	void updateTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy);

	List<StockInvoiceDetailsDao> getInvoiceItem(Example<StockInvoiceDetailsDao> stockInvoiceDetailsCriteria);

	StockInvoiceDao findById(Integer id);

	void updatePurchaseTotalWeightAndQuantity(Integer invoiceId, Date date, String lastModifiedBy);

	Optional<StockInvoiceDao> findByIdAndInvoiceType(Integer id, String invoiceType);

	void updatePrintCountStockIssue(Short printCount, Integer id);

	List<Object[]> checkBinValidationWithInventory(Integer id);

	// history related method starts here
	Page<StockInvoiceDao> listPurchaseInvoiceHistory(String invoiceType, String destLocationCode,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Date startDate, Date endDate, List<String> statuses,
			Pageable pageable);

	Page<StockInvoiceDao> listReturnInvoiceHistory(String invoiceType, String srcLocationCode,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Date startDate, Date endDate, List<String> statuses,
			Pageable pageable);

	Page<StockInvoiceDetailsDao> listInvoiceItems(StockInvoiceDao stockInvoice, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status, Pageable pageable);

	BigDecimal listInvoiceItemsWeightSum(StockInvoiceDao stockInvoice, String itemCode, List<String> productGroup,
			List<String> productCategory, String lotNumber, List<String> binCode, String binGroupCode, String status);
	// history related method ends here

	List<Object[]> getJointList(Integer id, List<String> productGroup, String status, String itemCode, String lotNumber,
			String locationCode, List<String> productCategory, String sortParameter, List<String> productGroupList,
			List<String> binCode, List<String> binGroup,String binGroupCode, Date businessDate, int startsAt, int pageSize);

	int getPageSize(Integer id, List<String> productGroup, String status, String itemCode, String lotNumber,
			String locationCode, List<String> productCategory, List<String> productGroupList, List<String> binCode,
			List<String> binGroup,String binGroupCode, Date businessDate);
	
	List<Object[]> getJointListForBtqCfa(Integer id, List<String> productGroup, String status, String itemCode, String lotNumber,
			String locationCode, List<String> productCategory, String sortParameter, List<String> productGroupList,
			List<String> binCode, List<String> binGroup,String binGroupCode, Date businessDate, int startsAt, int pageSize);

	int getPageSizeBtqCfa(Integer id, List<String> productGroup, String status, String itemCode, String lotNumber,
			String locationCode, List<String> productCategory, List<String> productGroupList, List<String> binCode,
			List<String> binGroup,String binGroupCode, Date businessDate);


	StockInvoiceDao findByIdAndSrcLocationCodeAndInvoiceType(Integer invoiceId, String locationCode,
			String invoiceType);

	StockInvoiceDao findByIdAndDestLocationCodeAndInvoiceType(Integer invoiceId, String locationCode,
			String invoiceType);
	
	List<StockInvoiceDetailsDao>  findAllStockInvoiceDetails(Integer id, String status);
	
	void updateTotalWeightAndQuantityData(Integer id,List<String> stockInvIds, Date lastModifiedDate, String lastModifiedBy);

	public List<Object[]> getJointListDetail(Integer id, List<String> productGroup, String status,  String locationCode, 
		List<String> binGroupList, Date businessDate);
	
	public List<Object[]> getJointBtqCfaListDetail(Integer id, List<String> productGroup, String status,  String locationCode, 
			 List<String> binGroupList, Date businessDate);

}
