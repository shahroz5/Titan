/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.service.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.dto.ItemsParamListDto;
import com.titan.poss.inventory.dto.request.HistoryInvoiceRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.repository.StockInvoiceDetailsRepository;
import com.titan.poss.inventory.repository.StockInvoiceRepository;
import com.titan.poss.inventory.service.InvoiceService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service("invoiceService")
public class InvoiceServiceImpl implements InvoiceService {

	@Autowired
	StockInvoiceRepository stockInvoiceRepository;

	@Autowired
	StockInvoiceDetailsRepository stockInvoiceDetailsRepository;

	@Override
	public List<InventoryCountDto> getPurchaseInvoiceCount(String locationCode, String invoiceStatus,
			String invoiceType) {
		return stockInvoiceRepository.getPurchaseInvoiceCount(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), invoiceStatus, invoiceType);
	}

	@Override
	public Page<StockInvoiceDao> listInvoices(Example<StockInvoiceDao> criteria, Pageable pageable) {
		return stockInvoiceRepository.findAll(criteria, pageable);
	}

	@Override
	public Optional<StockInvoiceDao> getInvoiceById(Example<StockInvoiceDao> criteria) {
		return stockInvoiceRepository.findOne(criteria);
	}

	@Override
	public Optional<StockInvoiceDetailsDao> getInvoiceItemById(Example<StockInvoiceDetailsDao> criteria) {
		return stockInvoiceDetailsRepository.findOne(criteria);
	}

	@Override
	public Page<StockInvoiceDetailsDao> findPurchaseInvoiceItems(Example<StockInvoiceDetailsDao> criteria,
			Pageable pageable) {
		return stockInvoiceDetailsRepository.findAll(criteria, pageable);
	}

	@Override
	public List<Object[]> listInvoiceReturnItems(ItemsParamListDto params, Pageable pageable) {
		return stockInvoiceDetailsRepository.getJointList(params.getHeaderId(), params.getProductGroups(),
				params.getStatus(), params.getItemCode(), params.getLotNumber(), params.getLocationCode(),
				params.getProductCategory(), params.getProductGroupList(), params.getBinCodeList(),
				params.getBinGroupList(),params.getBinGroupCode(), params.getBusinessDate(),
				params.getSortParameter() == null ? "NULL" : params.getSortParameter(),
				pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

	}

	@Override
	public List<StockInvoiceDao> findByInvoiceTypeAndStatusAndSrcLocationCode(String invoiceType, String status,
			String locationCode) {
		return stockInvoiceRepository.findByInvoiceTypeAndStatusAndSrcLocationCode(invoiceType, status, locationCode);
	}

	@Override
	public StockInvoiceDao createStockInvoice(StockInvoiceDao stockInvoice) {
		return stockInvoiceRepository.save(stockInvoice);
	}

	@Override
	public void saveItemLevelInvoice(StockInvoiceDetailsDao invoiceDetailNew) {
		stockInvoiceDetailsRepository.save(invoiceDetailNew);

	}

	@Override
	@Transactional
	public void verifyAllItems(String status, StockInvoiceDao stockInvoice) {
		stockInvoiceDetailsRepository.verifyAllItems(status, stockInvoice);
	}

	@Override
	@Transactional
	public void updateAllStockTransferDetails(StockInvoiceDao stockInvoice, String binCode, String status) {
		stockInvoiceDetailsRepository.updateAllStockTransferDetails(stockInvoice, binCode, status);
	}

	@Override
	@Transactional
	public void verifyAllItemsByItemId(StockInvoiceDao stockInvoice, String status, List<String> itemId) {
		stockInvoiceDetailsRepository.verifyAllItemsByItemId(stockInvoice, status, itemId);
	}

	@Override
	@Transactional
	public void updateAllStockTransferDetailsByItemId(StockInvoiceDao stockInvoice, List<String> itemId, String binCode,
			String status) {
		stockInvoiceDetailsRepository.updateAllStockTransferDetailsByItemId(stockInvoice, itemId, binCode, status);
	}

	@Override
	public Integer getOpenItemCount(StockInvoiceDao stockInvoice) {
		return stockInvoiceDetailsRepository.getOpenItemCount(stockInvoice);

	}

	@Override
	public void saveAllListItemsToInvoice(List<StockInvoiceDetailsDao> itemsToSave) {
		stockInvoiceDetailsRepository.saveAll(itemsToSave);
	}

	@Override
	public Integer getUnassignedBinCount(StockInvoiceDao stockInvoice) {
		return stockInvoiceDetailsRepository.getUnassignedBinCount(stockInvoice);
	}

	@Override
	public StockInvoiceDao saveInvoice(StockInvoiceDao stockInvoice) {
		return stockInvoiceRepository.save(stockInvoice);

	}

	@Override
	@Transactional
	public void changeItemStatus(String status, StockInvoiceDao stoockInvoice) {
		stockInvoiceDetailsRepository.changeItemStatus(status, stoockInvoice);

	}

	@Override
	@Transactional
	public void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id,BigDecimal totalDiscount) {
		stockInvoiceRepository.updateTotalValues(totalQuantity, totalWeight, totalValue, id, totalDiscount);

	}

	@Override
	public StockInvoiceDao getOne(Integer id) {
		return stockInvoiceRepository.getOne(id);
	}

	@Override
	public List<StockInvoiceDetailsDao> findByStockInvoice(StockInvoiceDao stockInvoice) {
		return stockInvoiceDetailsRepository.findByStockInvoice(stockInvoice);
	}

	@Override
	public void deleteInBatch(List<StockInvoiceDetailsDao> stockInvoiceDetailsList) {
		stockInvoiceDetailsRepository.deleteInBatch(stockInvoiceDetailsList);

	}

	@Override
	public List<StockInvoiceDetailsDao> findAllById(List<String> itemIds) {
		return stockInvoiceDetailsRepository.findAllById(itemIds);

	}

	@Override
	@Transactional
	public void changeItemDetailStatus(String status, StockInvoiceDao stockInvoice) {
		stockInvoiceDetailsRepository.changeItemDetailStatus(status, stockInvoice);

	}

	@Override
	public List<Object[]> checkAvailableQuantityWithInventory(Integer id) {

		return stockInvoiceDetailsRepository.checkAvailableQuantityWithInventory(id);
	}

	@Override
	public List<StockInvoiceDetailsDao> findByStockInvoiceAndStatus(StockInvoiceDao stockInvoice, String status) {

		return stockInvoiceDetailsRepository.findByStockInvoiceAndStatus(stockInvoice, status);
	}

	@Override
	@Transactional
	public void updateTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy) {
		stockInvoiceRepository.updateTotalWeightAndQuantity(id, lastModifiedDate, lastModifiedBy);

	}

	@Override
	public List<StockInvoiceDetailsDao> getInvoiceItem(Example<StockInvoiceDetailsDao> stockInvoiceDetailsCriteria) {
		return stockInvoiceDetailsRepository.findAll(stockInvoiceDetailsCriteria);
	}

	@Override
	public StockInvoiceDao findById(Integer invoiceId) {
		Optional<StockInvoiceDao> stockInvoiceOptional = stockInvoiceRepository.findById(invoiceId);
		return getStockInvoiceObject(stockInvoiceOptional);
	}

	@Override
	@Transactional
	public void updatePurchaseTotalWeightAndQuantity(Integer invoiceId, Date lastModifiedDate, String lastModifiedBy) {
		stockInvoiceRepository.updatePurchaseTotalWeightAndQuantity(invoiceId, lastModifiedDate, lastModifiedBy);

	}

	@Override
	public Optional<StockInvoiceDao> findByIdAndInvoiceType(Integer id, String invoiceType) {
		return stockInvoiceRepository.findByIdAndInvoiceType(id, invoiceType);
	}

	@Override
	@Transactional
	public void updatePrintCountStockIssue(Short printCount, Integer id) {
		stockInvoiceRepository.updatePrintCount(printCount, id);

	}

	@Override
	public List<Object[]> checkBinValidationWithInventory(Integer id) {
		return stockInvoiceDetailsRepository.checkBinValidationWithInventory(id);
	}

	@Override
	public Page<StockInvoiceDetailsDao> listInvoiceItems(StockInvoiceDao stockInvoice, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status, Pageable pageable) {
		return stockInvoiceDetailsRepository.listInvoiceItems(binCode, itemCode, productCategory, productGroup,
				binGroupCode, lotNumber, status, stockInvoice, pageable);
	}

	@Override
	public BigDecimal listInvoiceItemsWeightSum(StockInvoiceDao stockInvoice, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status) {

		return stockInvoiceDetailsRepository.listInvoiceItemsReceivedWeight(binCode, itemCode, productCategory,
				productGroup, binGroupCode, lotNumber, status, stockInvoice);
	}

	@Override
	public Page<StockInvoiceDao> listPurchaseInvoiceHistory(String invoiceType, String destLocationCode,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Date startDate, Date endDate, List<String> statuses,
			Pageable pageable) {
		return stockInvoiceRepository.listPurchaseInvoiceHistory(invoiceType, historyInvoiceRequestDto.getSrcDocNo(),
				historyInvoiceRequestDto.getLocationCode(), destLocationCode, startDate, endDate,
				historyInvoiceRequestDto.getDestFiscalYear(), historyInvoiceRequestDto.getSrcFiscalYear(),
				historyInvoiceRequestDto.getDestDocNo(), statuses, pageable);
	}

	@Override
	public Page<StockInvoiceDao> listReturnInvoiceHistory(String invoiceType, String srcLocationCode,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Date startDate, Date endDate, List<String> statuses,
			Pageable pageable) {
		return stockInvoiceRepository.listReturnInvoiceHistory(invoiceType, historyInvoiceRequestDto.getSrcDocNo(),
				srcLocationCode, historyInvoiceRequestDto.getLocationCode(), startDate, endDate,
				historyInvoiceRequestDto.getDestFiscalYear(), historyInvoiceRequestDto.getSrcFiscalYear(),
				historyInvoiceRequestDto.getDestDocNo(), statuses, pageable);
	}

	@Override
	public StockInvoiceDao findByIdAndSrcLocationCodeAndInvoiceType(Integer id, String locationCode,
			String invoiceType) {
		Optional<StockInvoiceDao> stInvoiOptional = stockInvoiceRepository.findByIdAndSrcLocationCodeAndInvoiceType(id,
				locationCode, invoiceType);
		return getStockInvoiceObject(stInvoiOptional);
	}

	@Override
	public StockInvoiceDao findByIdAndDestLocationCodeAndInvoiceType(Integer id, String locationCode,
			String invoiceType) {
		Optional<StockInvoiceDao> stInvoiOptional = stockInvoiceRepository.findByIdAndDestLocationCodeAndInvoiceType(id,
				locationCode, invoiceType);
		return getStockInvoiceObject(stInvoiOptional);
	}

	private StockInvoiceDao getStockInvoiceObject(Optional<StockInvoiceDao> stInvoiOptional) {
		if (!stInvoiOptional.isPresent()) {
			throw new ServiceException("Records not found", "ERR-INV-029");
		}
		return stInvoiOptional.get();
	}

	@Override
	public List<Object[]> getJointList(Integer id, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, String sortParameter,
			List<String> productGroupList, List<String> binCodeList, List<String> binGroup,String binGroupCode, Date businessDate,
			int startsAt, int pageSize) {
		return stockInvoiceDetailsRepository.getJointList(id, productGroup, status, itemCode, lotNumber, locationCode,
				productCategory, productGroupList, binCodeList, binGroup,binGroupCode, businessDate, sortParameter, startsAt,
				pageSize);
	}

	@Override
	public int getPageSize(Integer id, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, List<String> productGroupList,
			List<String> binCodeList,List<String> binGroup,String binGroupCode, Date businessDate) {
		return stockInvoiceDetailsRepository.getPageSize(id, productGroup, status, itemCode, lotNumber,
				locationCode, productCategory, productGroupList, binCodeList,binGroup,binGroupCode, businessDate);
	}
	
	@Override
	public List<Object[]> getJointListForBtqCfa(Integer id, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, String sortParameter,
			List<String> productGroupList, List<String> binCodeList, List<String> binGroup,String binGroupCode, Date businessDate,
			int startsAt, int pageSize) {
		return stockInvoiceDetailsRepository.getJointListForBtqCfa(id, productGroup, status, itemCode, lotNumber, locationCode,
				productCategory, productGroupList, binCodeList, binGroup,binGroupCode, businessDate, sortParameter, startsAt,
				pageSize);
	}

	@Override
	public int getPageSizeBtqCfa(Integer id, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, List<String> productGroupList,
			List<String> binCodeList,List<String> binGroup,String binGroupCode, Date businessDate) {
		return stockInvoiceDetailsRepository.getPageSizeBtqCfa(id, productGroup, status, itemCode, lotNumber,
				locationCode, productCategory, productGroupList, binCodeList,binGroup,binGroupCode, businessDate);
	}
	
	@Override
	public List<StockInvoiceDetailsDao> findAllStockInvoiceDetails(Integer id, String status) {
		
		return stockInvoiceDetailsRepository.findAllStockInvoiceDetails( id, status);
	}

	@Override
	public void updateTotalWeightAndQuantityData(Integer id,List<String> stockInvIds, Date lastModifiedDate,
			String lastModifiedBy) {
		
		stockInvoiceRepository.updateTotalWeightAndQuantityData(id,stockInvIds,lastModifiedDate,lastModifiedBy);
	}
	
	@Override
	public List<Object[]> getJointListDetail(Integer id, List<String> productGroup, String status, String locationCode, 
			 List<String> binGroupList, Date businessDate) {
		
		return stockInvoiceDetailsRepository.getJointListDetail(id, productGroup, status, locationCode,
				  binGroupList, businessDate);
	}
	
	@Override
	public List<Object[]> getJointBtqCfaListDetail(Integer id, List<String> productGroup, String status, String locationCode, 
			List<String> binGroupList, Date businessDate) {
		
		return stockInvoiceDetailsRepository.getJointBtqCfaListDetail(id, productGroup, status, locationCode,
				 binGroupList, businessDate);
	}
	
	

}
