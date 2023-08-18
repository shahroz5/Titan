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
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dto.request.HistoryTransferItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.repository.StockTransferDetailsRepository;
import com.titan.poss.inventory.repository.StockTransferRepository;
import com.titan.poss.inventory.service.StockTransferService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stockTransferService")
public class StockTransferServiceImpl implements StockTransferService {

	@Autowired
	private StockTransferRepository stockTransferRepository;

	@Autowired
	private StockTransferDetailsRepository stockTransferDetailsRepository;

	private static final String RECORD_NOT_FOUND = "Records not found";

	private static final String ERR_INV_029 = "ERR-INV-029";

	@Override
	public List<InventoryCountDto> getStockTransferCount(String locationCode, String status,
			List<String> transferTypes) {
		// get stock transfer count based on location code,status and list of transfer
		// type
		return stockTransferRepository.getStnCount(locationCode, status, transferTypes);
	}

	@Override
	public StockTransferDao findStockTransferByIdAndDestLocationCodeAndTransferType(Integer id, String locationCode,
			String transferType) {
		// get stock transfer object based on id,dest location code & transfer type
		Optional<StockTransferDao> stockTransfer = stockTransferRepository
				.findByIdAndDestLocationCodeAndTransferType(id, locationCode, transferType);
		// if no record available then throw exception
		return getStockTranferObject(stockTransfer);
	}
	
	@Override
	public StockTransferDao getStockTransferByIdAndType(Integer id,String status, String transferType) {
		StockTransferDao stockTransfer = new StockTransferDao();
		stockTransfer.setId(id);
		stockTransfer.setStatus(status);
		stockTransfer.setTransferType(transferType);
		stockTransfer.setSrcLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockTransferDao> criteria = Example.of(stockTransfer, matcher);
		Optional<StockTransferDao> stRequest = stockTransferRepository.findOne(criteria);

		if (stRequest.isPresent()) {
			stockTransfer = stRequest.get();
		}
		return stockTransfer;
	}

	@Override
	public Page<StockTransferDao> findStockTransferByCriteria(Example<StockTransferDao> criteria, Pageable pageable) {
		// return all page stock transfer data based on criteria
		return stockTransferRepository.findAll(criteria, pageable);
	}
	
	@Override
	public Page<StockTransferDao> findStockTransferForStnCancel(Integer srcDocNo,String locationCode, String status,
			String transferType,Date compareDate,Pageable pageable) {
		// return all page stock transfer data for stn cancel
		return stockTransferRepository.findStockTransferStnCancel(srcDocNo,transferType,status,locationCode,compareDate,pageable);
	}
	
	@Override
	public Long findStockTransferForStnCancelCount(String locationCode, String status,
			String transferType,Date compareDate) {
		// return all page stock transfer data for stn cancel
		return stockTransferRepository.findStockTransferStnCancelCount(transferType,status,locationCode,compareDate);
	}

	@Override
	public StockTransferDetailsDao findStockTransferDetailsByCriteria(
			Example<StockTransferDetailsDao> stockTransferDetailsExample) {
		Optional<StockTransferDetailsDao> stockTransferDetails = stockTransferDetailsRepository
				.findOne(stockTransferDetailsExample);
		// if no record available then throw exception
		if (!stockTransferDetails.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		return stockTransferDetails.get();
	}

	@Override
	public Page<StockTransferDetailsDao> findListStockTransferDetailsByCriteria(
			Example<StockTransferDetailsDao> stockTransferDetailsExample, Pageable pageable) {

		return stockTransferDetailsRepository.findAll(stockTransferDetailsExample, pageable);
	}

	@Override
	public StockTransferDetailsDao findStockTransferDetailsByItemIdAndStockTransfer(String stockTransferDetailsId,
			StockTransferDao stockTransfer) {
		// get stock transfer details by stock transfer details id and stockTransfer
		// object
		Optional<StockTransferDetailsDao> stockTransferDetails = stockTransferDetailsRepository
				.findByIdAndStockTransfer(stockTransferDetailsId, stockTransfer);
		// if no record available then throw exception
		if (!stockTransferDetails.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		return stockTransferDetails.get();
	}

	@Override
	@Transactional
	public StockTransferDetailsDao saveOrUpdateStockTransferDetails(StockTransferDetailsDao stockTransferDetailsObj) {
		// save or update stock transfer details
		return stockTransferDetailsRepository.save(stockTransferDetailsObj);
	}

	@Override
	@Transactional
	public void verifyAllStockTransferItems(String status, String binCode, StockTransferDao stockTransfer) {
		if (binCode != null) {
			// if bin code is not null then update bin code against the stock transfer
			// object
			stockTransferDetailsRepository.updateAllStockTransferDetails(stockTransfer, binCode);
		} else {
			// if bin code is null then update status against the stock transfer
			// object and status should be ISSUED
			stockTransferDetailsRepository.verifyAllItems(status, stockTransfer);
		}
	}

	@Override
	public List<StockTransferDetailsDao> findAllStockTransferDetailsWithStatus(StockTransferDao stockTransfer,
			String status) {
		// get all stock transfer details by stock transfer
		return stockTransferDetailsRepository.findByStockTransferAndStatus(stockTransfer, status);
	}

	@Override
	public List<StockTransferDetailsDao> findAllStockTransferDetails(StockTransferDao stockTransfer) {
		// get all stock transfer details by stock transfer
		return stockTransferDetailsRepository.findByStockTransfer(stockTransfer);
	}

	@Override
	@Transactional
	public StockTransferDao saveOrUpdateStockTransfer(StockTransferDao stockTransfer) {
		// save or update stock transfer
		return stockTransferRepository.save(stockTransfer);
	}

	@Override
	@Transactional
	public void verifyAllItemsByItemId(StockTransferDao stockTransfer, String status, List<String> itemIds) {
		stockTransferDetailsRepository.verifyAllItemsByItemId(status, stockTransfer, itemIds);
	}

	@Override
	@Transactional
	public void updateAllStockTransferDetailsByItemId(StockTransferDao stockTransfer, List<String> itemIds,
			String binCode) {
		stockTransferDetailsRepository.updateAllStockTransferDetailsByItemId(stockTransfer, itemIds, binCode);

	}

	@Override
	public List<Object[]> getJointList(Integer id, List<String> bin, List<String> productGroup, String status,
			String itemCode, String lotNumber, String locationCode, List<String> productCategory, String sortParameter,
			List<String> productGroupList, List<String> binCodeList,Date businessDate, int startsAt, int pageSize) {
		return stockTransferDetailsRepository.getJointList(id, bin, productGroup, status, itemCode, lotNumber,
				locationCode, productCategory, productGroupList, binCodeList,businessDate, sortParameter, startsAt, pageSize);
	}

	@Override
	public int getPageSize(Integer id, List<String> bin, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, List<String> productGroupList,
			List<String> binCodeList,Date businessDate) {
		return stockTransferDetailsRepository.getPageSize(id, bin, productGroup, status, itemCode, lotNumber,
				locationCode, productCategory, productGroupList, binCodeList,businessDate);
	}
	
	// Get Data for Defective transfer type
	@Override
	public List<Object[]> getJointListForDefective(Integer id, List<String> bin, List<String> productGroup, String status,
			String itemCode, String lotNumber, String locationCode, List<String> productCategory, String sortParameter,
			List<String> productGroupList, List<String> binCodeList,Date businessDate, int startsAt, int pageSize) {
		return stockTransferDetailsRepository.getJointListForDefective(id, bin, productGroup, status, itemCode, lotNumber,
				locationCode, productCategory, productGroupList, binCodeList,businessDate, sortParameter, startsAt, pageSize);
	}

	@Override
	public int getPageSizeForDefective(Integer id, List<String> bin, List<String> productGroup, String status, String itemCode,
			String lotNumber, String locationCode, List<String> productCategory, List<String> productGroupList,
			List<String> binCodeList,Date businessDate) {
		return stockTransferDetailsRepository.getPageSizeForDefective(id, bin, productGroup, status, itemCode, lotNumber,
				locationCode, productCategory, productGroupList, binCodeList,businessDate);
	}

	@Override
	public void saveAll(List<StockTransferDetailsDao> stList) {
		stockTransferDetailsRepository.saveAll(stList);
	}

	@Override
	public Optional<StockTransferDao> findByIdAndTransferType(Integer id, String transferType) {
		return stockTransferRepository.findByIdAndTransferType(id, transferType);
	}

	@Override
	public Integer getOpenItemCount(StockTransferDao stockTransfer) {
		return stockTransferDetailsRepository.getOpenItemCount(stockTransfer);
	}

	@Override
	@Transactional
	public void changeItemStatus(String status, StockTransferDao stockTransfer) {
		stockTransferDetailsRepository.changeItemStatus(status, stockTransfer);
	}

	@Override
	@Transactional
	public void updateAllStockIssueDetailsByItemIds(StockTransferDao stockTransfer, String status) {
		stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, status);
	}

	@Override
	public List<StockTransferDao> findByTransferTypeAndStatusAndSrcLocationCode(String transferType, String status,
			String locationCode) {
		return stockTransferRepository.findByTransferTypeAndStatusAndSrcLocationCode(transferType, status,
				locationCode);
	}

	@Override
	public Optional<StockTransferDao> getStockTransferById(Integer id) {
		return stockTransferRepository.findById(id);
	}

	@Override
	public List<StockTransferDetailsDao> findAllTransferDetailsByItemIds(List<String> itemIds) {
		return stockTransferDetailsRepository.findAllTransferDetailsByItemIds(itemIds);
	}

	@Override
	public void deleteInBatch(List<StockTransferDetailsDao> stockTransferDetails) {
		stockTransferDetailsRepository.deleteInBatch(stockTransferDetails);
	}

	@Override
	public Integer getUnassignedBinCount(StockTransferDao stockTransfer) {
		return stockTransferDetailsRepository.getUnassignedBinCount(stockTransfer);
	}

	@Override
	public StockTransferDao getOne(Integer id) {
		return stockTransferRepository.getOne(id);
	}

	@Override
	@Transactional
	public void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id) {
		stockTransferRepository.updateTotalValues(totalQuantity, totalWeight, totalValue, id);

	}

	@Override
	public List<Object[]> checkAvailableQuantityWithInventory(Integer id) {
		return stockTransferRepository.checkAvailableQuantityWithInventory(id);

	}

	@Override
	@Transactional
	public void updateTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy) {
		stockTransferRepository.updateTotalWeightAndQuantity(id, lastModifiedDate, lastModifiedBy);
	}

	@Override
	public List<StockTransferDetailsDao> findByStockTransferAndStatus(StockTransferDao stockTransfer, String status) {
		return stockTransferDetailsRepository.findByStockTransferAndStatus(stockTransfer, status);

	}

	@Override
	public Page<StockTransferDetailsDao> listStockReceiveItems(StockTransferDao stockTransfer, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status, Pageable pageable) {

		return stockTransferDetailsRepository.listStockReceiveItems(binCode, itemCode, productCategory, productGroup,
				binGroupCode, lotNumber, status, stockTransfer, pageable);
	}
	
	@Override
	public BigDecimal listStockReceiveItemsWeightSum(StockTransferDao stockTransfer, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status) {

		return stockTransferDetailsRepository.listStockReceiveItemsReceivedWeight(binCode, itemCode, productCategory, productGroup,
				binGroupCode, lotNumber, status, stockTransfer);
	}

	@Override
	@Transactional
	public void updatePrintCountStockIssue(Short printCount, Integer id) {
		stockTransferRepository.updatePrintCount(printCount, id);

	}

	@Override
	@Transactional
	public void updateReceivedTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy) {
		//stockTransferRepository.updateReceivedTotalWeightAndQuantity(id, new Date(), lastModifiedBy);
		stockTransferRepository.updateTotalWeightAndQuantity(id, lastModifiedDate, lastModifiedBy);
	}

	@Override
	public StockTransferDao findStockTransferByIdAndSrcLocationCodeAndTransferType(Integer id, String locationCode,
			String transferType) {
		// get stock transfer object based on id,src location code & transfer type
		Optional<StockTransferDao> stockTransfer = stockTransferRepository.findByIdAndSrcLocationCodeAndTransferType(id,
				locationCode, transferType);

		// if no record available then throw exception
		return getStockTranferObject(stockTransfer);
	}

	@Override
	public void updateAllStockTransferDetailsByStockTransferId(String status, StockTransferDao stockTransfer) {
		stockTransferDetailsRepository.updateAllStockIssueDetailsByItemIds(stockTransfer, status);
	}

	@Override
	public Page<StockTransferDao> listStockTransferIssueHistory(String srcLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable) {
		return stockTransferRepository.listStockTransferIssueHistory(transferType,
				historyTransferRequestDto.getSrcDocNo(), srcLocationCode, historyTransferRequestDto.getLocationCode(),
				startDate, endDate, status, historyTransferRequestDto.getDestFiscalYear(),
				historyTransferRequestDto.getDestDocNo(), historyTransferRequestDto.getSrcFiscalYear(), pageable);
	}
	@Override
	public Page<StockTransferDao> listStockTransferIssueLegacyIbtHistory(String srcLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable) {
		return stockTransferRepository.listStockTransferIssueLegacyIbtHistory(transferType,
				historyTransferRequestDto.getSrcDocNo(), srcLocationCode, historyTransferRequestDto.getLocationCode(),
				startDate, endDate, status, historyTransferRequestDto.getDestFiscalYear(),
				historyTransferRequestDto.getDestDocNo(), historyTransferRequestDto.getSrcFiscalYear(), pageable);
	}
	
	@Override
	public Page<StockTransferDao> listStockTransferIssueIbtHistory(String srcLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable) {
		return stockTransferRepository.listStockTransferIssueIbtHistory(transferType,
				historyTransferRequestDto.getSrcDocNo(), srcLocationCode, historyTransferRequestDto.getLocationCode(),
				startDate, endDate, status, historyTransferRequestDto.getDestFiscalYear(),
				historyTransferRequestDto.getDestDocNo(), historyTransferRequestDto.getSrcFiscalYear(), pageable);
	}

	@Override
	public Page<StockTransferDao> listStockTransferReceiveHistory(String destLocationCode,
			HistoryTransferRequestDto historyTransferRequestDto, Date startDate, Date endDate, List<String> status,
			String transferType, Pageable pageable) {
		return stockTransferRepository.listStockTransferReceiveHistory(transferType,
				historyTransferRequestDto.getSrcDocNo(), historyTransferRequestDto.getLocationCode(), destLocationCode,
				startDate, endDate, status, historyTransferRequestDto.getDestFiscalYear(),
				historyTransferRequestDto.getDestDocNo(), historyTransferRequestDto.getSrcFiscalYear(), pageable);
	}

	@Override
	public Page<StockTransferDetailsDao> listStockTransferItemHistory(StockTransferDao stockTransfer,
			HistoryTransferItemRequestDto historyTransferItemRequestDto, Pageable pageable) {
		return stockTransferDetailsRepository.listStockTransferItemHistory(historyTransferItemRequestDto.getBinCodes(),
				historyTransferItemRequestDto.getItemCode(), historyTransferItemRequestDto.getProductCategories(),
				historyTransferItemRequestDto.getProductGroups(), historyTransferItemRequestDto.getBinGroupCode(),
				historyTransferItemRequestDto.getLotNumber(), stockTransfer, pageable);
	}

	@Override
	public StockTransferDao findStockTransferById(Integer id) {
		Optional<StockTransferDao> stTransfer = stockTransferRepository.findById(id);
		return getStockTranferObject(stTransfer);
	}

	@Override
	public StockTransferDao findStockTransferByIdAndSrcLocationCode(Integer id, String locationCode) {
		Optional<StockTransferDao> stTransferDao = stockTransferRepository.findByIdAndSrcLocationCode(id, locationCode);
		return getStockTranferObject(stTransferDao);
	}

	@Override
	public StockTransferDao findStockTransferByIdAndDestLocationCode(Integer id, String locationCode) {
		Optional<StockTransferDao> stTransferDao = stockTransferRepository.findByIdAndDestLocationCode(id,
				locationCode);
		return getStockTranferObject(stTransferDao);
	}

	StockTransferDao getStockTranferObject(Optional<StockTransferDao> stTransferDao) {
		if (!stTransferDao.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		return stTransferDao.get();
	}



	@Override
	public List<Object[]> getJointListForHeader(Integer id, List<String> bin, List<String> productGroup, String status,
		String locationCode,  Date businessDate) {

		return stockTransferDetailsRepository.getJointListForHeader(id, bin, productGroup, status,
				locationCode, businessDate);
	}
	
	@Override
	public List<Object[]> getJointListForDefectiveHeader(Integer id, List<String> bin, List<String> productGroup, String status,
		String locationCode,  Date businessDate) {

		return stockTransferDetailsRepository.getJointListForDefetiveHeader(id, bin, productGroup, status,
				locationCode, businessDate);
	}
	
	@Override
	public List<Object[]> getJointListForBtqHeader(Integer id, List<String> productGroup, String status,
		String locationCode, List<String> bin,  Date businessDate) {

		return stockTransferDetailsRepository.getJointListForBtqHeader(id, productGroup, status,
				locationCode, bin, businessDate);
	}

}
