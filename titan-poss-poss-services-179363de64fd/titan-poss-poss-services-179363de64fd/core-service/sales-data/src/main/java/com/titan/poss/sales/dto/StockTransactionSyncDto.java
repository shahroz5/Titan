package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.StockTransactionDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class StockTransactionSyncDto extends SyncableEntity {

	private String id;

	private String transactionType;

	private String locationCode;

	private Integer docNo;

	private Short totalQuantity;

	private Date docDate;

	private Short fiscalYear;

	private String status;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;

	private String employeeCode;

	private String weightUnit;

	private String currencyCode;

	private String remarks;

	public StockTransactionDao getStockTransactionDao(StockTransactionSyncDto syncDto) {
		StockTransactionDao stockTxnDao = (StockTransactionDao) MapperUtil.getObjectMapping(syncDto,
				new StockTransactionDao());
		return stockTxnDao;
	}

	public List<StockTransactionDao> getStockTransactionDaoList(List<StockTransactionSyncDto> syncDto) {
		List<StockTransactionDao> stockDaoList = new ArrayList<>();
		for (StockTransactionSyncDto stockTransactionDetailsSyncDto : syncDto) {
			StockTransactionDao stockTxnDao = (StockTransactionDao) MapperUtil
					.getObjectMapping(stockTransactionDetailsSyncDto, new StockTransactionDao());
			stockDaoList.add(stockTxnDao);
		}
		return stockDaoList;
	}

	public List<StockTransactionSyncDto> getStockTransactionDtoList(List<StockTransactionDao> syncDto) {
		List<StockTransactionSyncDto> stockDtoList = new ArrayList<>();
		for (StockTransactionDao stockTransactionDao : syncDto) {
			StockTransactionSyncDto stockTxnDto = (StockTransactionSyncDto) MapperUtil
					.getObjectMapping(stockTransactionDao, new StockTransactionSyncDto());
			stockDtoList.add(stockTxnDto);
		}
		return stockDtoList;
	}
}
