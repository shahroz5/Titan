/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.inventory.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.repository.StockTransactionDetailsRepository;
import com.titan.poss.inventory.repository.StockTransactionRepository;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.repository.StockTransactionDetailsRepositoryExt;
import com.titan.poss.sales.repository.StockTransactionRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.EngineService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class StockTransactionServiceImpl implements StockTransactionService {

	@Autowired
	private StockTransactionRepository stockTransactionRepository;

	@Autowired
	private StockTransactionDetailsRepository stockTransactionDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	private StockTransactionRepositoryExt salesStockTransactionRepo;

	@Autowired
	private StockTransactionDetailsRepositoryExt stockTransactionDetailsRepositoryExt;

	@Autowired
	private BusinessDayService businessDayService;

	@Override
	@Transactional
	public void updateStockTransaction(StockTransactionDao stockTransaction) {
		stockTransactionRepository.save(stockTransaction);

	}

	@Override
	@Transactional
	public void addStockTransactionDetails(List<StockTransactionDetailsDao> stockTransactionDetails) {
		stockTransactionDetailsRepository.saveAll(stockTransactionDetails);

	}

	@Override
	@Transactional
	public StockTransactionDao addBinStockTransaction(String status, String transactionType) {
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		CountryDetailsDto countryDto = getCountryDetails(locationCode);
		Date businessDay = businessDayService.getBodBusinessDay().getBusinessDate();
		StockTransactionDao stockTransactionDao = new StockTransactionDao();
		BigDecimal totalValue = BigDecimal.ZERO;
		short totalQuantity = 0;
		stockTransactionDao.setTransactionType(transactionType);
		stockTransactionDao.setIssuedDocNo(inventoryDocMasterService.getDocNumber(
				countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.BINTOBIN.toString()));
		stockTransactionDao.setReceivedDocNo(stockTransactionDao.getIssuedDocNo());
		stockTransactionDao.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransactionDao.setReceivedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransactionDao.setIssuedDocDate(businessDay);
		stockTransactionDao.setReceivedDocDate(businessDay);
		stockTransactionDao.setStatus(status);
		stockTransactionDao.setCurrencyCode(countryDto.getCurrencyCode());
		stockTransactionDao.setWeightUnit(countryDto.getWeightUnit());
		stockTransactionDao.setOrgCode(CommonConstants.ORG_CODE);
		stockTransactionDao.setTotalIssuedQuantity(totalQuantity);
		stockTransactionDao.setTotalReceivedQuantity(totalQuantity);
		stockTransactionDao.setTotalIssuedValue(totalValue);
		stockTransactionDao.setTotalReceivedValue(totalValue);
		stockTransactionDao.setLocationCode(locationCode);
		stockTransactionDao.setTotalReceivedWeight(totalValue);
		stockTransactionDao.setTotalIssuedWeight(totalValue);
		return stockTransactionRepository.save(stockTransactionDao);
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	@Override
	public StockTransactionDaoExt saveSalesStockTransaction(StockTransactionDaoExt stockTransactionDaoExt) {
		return salesStockTransactionRepo.save(stockTransactionDaoExt);
	}

	@Override
	public StockTransactionDaoExt getSalesStockTransaction(String id, String transactionType, String locationCode) {
		return salesStockTransactionRepo.findByIdAndTransactionTypeAndLocationCode(id, transactionType, locationCode);
	}

	@Override
	public long getCountOfTotalQuantity(StockTransactionDaoExt stockTransactionDaoExt) {
		return stockTransactionDetailsRepositoryExt.getCountOfTotalQuantity(stockTransactionDaoExt);
	}

	@Override
	public StockTransactionDetailsDaoExt saveSalesStockTransactionDetails(
			StockTransactionDetailsDaoExt stockTransactionDetailsDaoExt) {
		return stockTransactionDetailsRepositoryExt.save(stockTransactionDetailsDaoExt);
	}

	@Override
	public List<StockTransactionDetailsDaoExt> getSalesListStockTransaction(
			StockTransactionDaoExt stockTransactionDaoExt) {
		return stockTransactionDetailsRepositoryExt.findByStockTransaction(stockTransactionDaoExt);
	}

	@Override
	public StockTransactionDetailsDaoExt getSalesStockTransactionDetails(StockTransactionDaoExt stockTransactionDaoExt,
			String itemId) {
		return stockTransactionDetailsRepositoryExt.findByStockTransactionAndId(stockTransactionDaoExt, itemId);
	}

	@Override
	public void deleteStockTxnItems(StockTransactionDetailsDaoExt stockTransactionDetailsDaoExt) {
		stockTransactionDetailsRepositoryExt.delete(stockTransactionDetailsDaoExt);
	}

}
