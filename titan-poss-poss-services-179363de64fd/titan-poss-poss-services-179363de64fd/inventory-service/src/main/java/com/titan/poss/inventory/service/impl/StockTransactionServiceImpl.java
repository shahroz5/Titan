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

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dto.request.HistoryTransactionItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.repository.StockTransactionDetailsRepository;
import com.titan.poss.inventory.repository.StockTransactionRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.StockTransactionService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stockTransactionService")
public class StockTransactionServiceImpl implements StockTransactionService {

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	private StockTransactionRepository stockTransactionRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private StockTransactionDetailsRepository stockTransactionDetailsRepository;

	private static final String RECORD_NOT_FOUND = "Records not found";

	private static final String ERR_INV_029 = "ERR-INV-029";

	@Override
	@Transactional
	public void addStockTransactionDetails(List<StockTransactionDetailsDao> stockTransactionDetails) {
		stockTransactionDetailsRepository.saveAll(stockTransactionDetails);

	}

	@Override
	@Transactional
	public StockTransactionDao updateStockTransaction(StockTransactionDao stockTransaction) {
		return stockTransactionRepository.save(stockTransaction);

	}

	@Override
	@Transactional
	public StockTransactionDao addBinStockTransaction(String status, String transactionType) {
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		CountryDetailsDto countryDto = getCountryDetails(locationCode);
		Date businessDay = engineService.getBusinessDayScheduler(locationCode);
		StockTransactionDao stockTransaction = new StockTransactionDao();
		BigDecimal totalValue = BigDecimal.ZERO;
		short totalQuantity = 0;
		stockTransaction.setTransactionType(transactionType);
		stockTransaction.setIssuedDocNo(inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.BINTOBIN.toString()));
		stockTransaction.setReceivedDocNo(stockTransaction.getIssuedDocNo());
		stockTransaction.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransaction.setReceivedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransaction.setIssuedDocDate(businessDay);
		stockTransaction.setReceivedDocDate(businessDay);
		stockTransaction.setStatus(status);
		stockTransaction.setCurrencyCode(countryDto.getCurrencyCode());
		stockTransaction.setWeightUnit(countryDto.getWeightUnit());
		stockTransaction.setOrgCode(CommonConstants.ORG_CODE);
		stockTransaction.setTotalIssuedQuantity(totalQuantity);
		stockTransaction.setTotalReceivedQuantity(totalQuantity);
		stockTransaction.setTotalIssuedValue(totalValue);
		stockTransaction.setTotalReceivedValue(totalValue);
		stockTransaction.setLocationCode(locationCode);
		stockTransaction.setTotalReceivedWeight(totalValue);
		stockTransaction.setTotalIssuedWeight(totalValue);
		return stockTransactionRepository.save(stockTransaction);
	}

	@Override
	public List<InventoryCountDto> getStockTransactionCount(String locationCode, String status,
			List<String> transactionTypes) {
		// get stock transaction count based on location code,status and list of
		// transfer type
		return stockTransactionRepository.getStockTransactionCount(locationCode, status, transactionTypes);
	}

	@Override
	public Page<StockTransactionDao> findStockTransactionByCriteria(
			Example<StockTransactionDao> stockTransactionCriteria, Pageable pageable) {
		// get stock transaction page object by stockTransactionCriteria example
		// criteria object
		return stockTransactionRepository.findAll(stockTransactionCriteria, pageable);
	}

	@Override
	public StockTransactionDao findStockTransactionByIdAndLocationCodeAndTransactionType(Integer id,
			String locationCode, String transactionType) {
		// get stock transaction object by id,location code & transaction type
		Optional<StockTransactionDao> stockTransaction = stockTransactionRepository
				.findByIdAndLocationCodeAndTransactionType(id, locationCode, transactionType);
		return getStockTransactionObject(stockTransaction);
	}

	@Override
	public StockTransactionDetailsDao findStockTransactionDetailsByCriteria(
			Example<StockTransactionDetailsDao> stockTransactionDetailsExample) {
		// get stock transaction details object by id
		return stockTransactionDetailsRepository.findOne(stockTransactionDetailsExample)
				.orElseThrow(() -> new ServiceException(RECORD_NOT_FOUND, ERR_INV_029));
	}

	@Override
	public Page<StockTransactionDetailsDao> findStockTransactionDetailsByCriteria(
			Example<StockTransactionDetailsDao> stockTransactionDetailsCriteria, Pageable pageable) {
		return stockTransactionDetailsRepository.findAll(stockTransactionDetailsCriteria, pageable);
	}

	@Override
	public StockTransactionDetailsDao findByItemIdAndStockTransaction(String itemId,
			StockTransactionDao stockTransaction) {

		// get stock transaction details object by id and stock transaction object
		Optional<StockTransactionDetailsDao> stockTransactionDetails = stockTransactionDetailsRepository
				.findByIdAndStockTransaction(itemId, stockTransaction);

		// throw exception if stockTransactionDetails is empty
		if (!stockTransactionDetails.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		return stockTransactionDetails.get();
	}

	@Override
	@Transactional
	public StockTransactionDetailsDao saveOrUpdateStockTransactionDetails(
			StockTransactionDetailsDao stockTransactionDetails) {

		// save or update stock transaction details
		return stockTransactionDetailsRepository.save(stockTransactionDetails);
	}

	@Override
	public void verifyAllItemsByItemId(StockTransactionDao stockTransaction, String status, List<String> itemIds) {
		stockTransactionDetailsRepository.verifyAllItemsByItemId(status, stockTransaction, itemIds);

	}

	@Override
	public void updateAllStockTransactionDetailsByItemId(StockTransactionDao stockTransaction, List<String> itemIds,
			String binCode, String binGroupCode) {
		stockTransactionDetailsRepository.updateAllStockTransactionDetailsByItemId(stockTransaction, itemIds, binCode,
				binGroupCode);

	}

	@Override
	public void verifyAllStockTransactionItems(String status, String binCode, String binGroupCode,
			StockTransactionDao stockTransaction) {
		if (binCode != null) {
			// if bin code is not null then update bin code against the stock transfer
			// object
			stockTransactionDetailsRepository.updateAllStockTransactionDetails(stockTransaction, binCode, binGroupCode);
		} else {
			// if bin code is null then update status against the stock transfer
			// object and status should be ISSUED
			stockTransactionDetailsRepository.verifyAllItems(status, stockTransaction);
		}
	}

	@Override
	public List<StockTransactionDetailsDao> findAllStockTransactionDetails(StockTransactionDao stockTransaction) {
		return stockTransactionDetailsRepository.findByStockTransaction(stockTransaction);
	}

	@Override
	@Transactional
	public StockTransactionDao saveOrUpdateStockTransaction(StockTransactionDao stockTransaction) {
		// save or update stock transfer
		return stockTransactionRepository.save(stockTransaction);
	}

	@Override
	public List<StockTransactionDetailsDao> saveAll(List<StockTransactionDetailsDao> stList) {
		return stockTransactionDetailsRepository.saveAll(stList);

	}

	@Override
	public List<StockTransactionDetailsDao> findByStockTransactionAndStatus(StockTransactionDao stockTransaction,
			String status) {
		return stockTransactionDetailsRepository.findByStockTransactionAndStatus(stockTransaction, status);
	}

	@Override
	public Integer getOpenItemCount(StockTransactionDao stockTransaction) {
		// open item count if any item details status is OPEN
		return stockTransactionDetailsRepository.getOpenItemCount(stockTransaction);
	}

	@Override
	public Integer getUnassignedBinCount(StockTransactionDao stockTransaction) {
		// count of unassigned bin
		return stockTransactionDetailsRepository.getUnassignedBinCount(stockTransaction);
	}

	@Override
	public void updateAllStockTransactionDetails(StockTransactionDao stockTransaction, String status) {
		stockTransactionDetailsRepository.updateAllStockTransactionItemDetails(stockTransaction, status);

	}

	@Override
	public Page<StockTransactionDetailsDao> listOtherReceiveItems(StockTransactionDao stockTransaction, String itemCode,
			String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory, String status, Pageable pageable) {

		return stockTransactionDetailsRepository.listOtherReceiveItems(binCode, itemCode, productCategory, productGroup,
				binGroupCode, lotNumber, status, stockTransaction, pageable);
	}

	@Override
	public StockTransactionDao getOtherIssuePDF(Integer id, String transactionType) {

		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();

		Optional<StockTransactionDao> stckTransactions = stockTransactionRepository
				.findByIdAndLocationCodeAndTransactionType(id, locationCode, transactionType);

		if (stckTransactions.isPresent()) {
			return stckTransactions.get();
		} else {
			throw new ServiceException("Improper Id no data found", ERR_INV_029);
		}

	}

	@Override
	@Transactional
	public void updatePrintCountOtherIssue(Short printCount, Integer id) {

		stockTransactionRepository.updatePrintCount(printCount, id);

	}

	@Override
	@Transactional
	public void updateTotalWeightAndQuantity(Integer id, Date date, String lastModifiedBy) {
		stockTransactionRepository.updateTotalWeightAndQuantity(id, new Date(), lastModifiedBy);

	}

	@Override
	public Page<StockTransactionDao> listStockTransactionIssueHistory(String transactionType, String locationCode,
			HistoryTransactionRequestDto historyTransactionRequestDto, Date startDate, Date endDate,
			List<String> statuses, Pageable pageable) {

		return stockTransactionRepository.listStockTransactionIssueHistory(transactionType,
				historyTransactionRequestDto.getIssueDocNo(), locationCode, startDate, endDate, statuses,
				historyTransactionRequestDto.getReceiveDocNo(), historyTransactionRequestDto.getIssueFiscalYear(),
				historyTransactionRequestDto.getReceiveFiscalYear(), pageable);
	}

	@Override
	public Page<StockTransactionDetailsDao> listStockTransactionItemHistory(StockTransactionDao stockTransaction,
			HistoryTransactionItemRequestDto historyTransactionItemRequestDto, Pageable pageable) {
		return stockTransactionDetailsRepository.listStockTransactionItemHistory(
				historyTransactionItemRequestDto.getBinCodes(), historyTransactionItemRequestDto.getItemCode(),
				historyTransactionItemRequestDto.getProductCategories(),
				historyTransactionItemRequestDto.getProductGroups(), historyTransactionItemRequestDto.getBinGroupCode(),
				historyTransactionItemRequestDto.getLotNumber(), stockTransaction, pageable);
	}

	@Override
	public StockTransactionDao findStockTransactionById(Integer id) {
		return stockTransactionRepository.findById(id)
				.orElseThrow(() -> new ServiceException(RECORD_NOT_FOUND, ERR_INV_029));
	}

	@Override
	public Page<StockTransactionDao> listStockTransactionReceiveHistory(String transactionType, String locationCode,
			HistoryTransactionRequestDto historyTransactionRequestDto, Date startDate, Date endDate,
			List<String> statuses, Pageable pageable) {
		return stockTransactionRepository.listStockTransactionReceiveHistory(transactionType,
				historyTransactionRequestDto.getIssueDocNo(), locationCode, startDate, endDate, statuses,
				historyTransactionRequestDto.getReceiveDocNo(), historyTransactionRequestDto.getIssueFiscalYear(),
				historyTransactionRequestDto.getReceiveFiscalYear(), pageable);
	}

	private StockTransactionDao getStockTransactionObject(Optional<StockTransactionDao> stTransaction) {
		if (!stTransaction.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		return stTransaction.get();
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

}
