package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.StockTransactionDao;
import com.titan.poss.sales.dao.StockTransactionDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class StockTransactionDetailsSyncDto extends SyncableEntity {

	
	private String id;
	
	private String stockTransaction;

	private String itemCode;

	private String lotNumber;

	private String binCode;

	private String binGroupCode;

	private BigDecimal stdValue;

	private BigDecimal stdWeight;

	private Short quantity;

	private String weightUnit;

	private String currencyCode;

	private BigDecimal karat;

	private String itemDetails;
	
	public List<StockTransactionDetailsDao> getStockTransactionDetailsDaoList(List<StockTransactionDetailsSyncDto> syncDto) {
		List<StockTransactionDetailsDao> stockDaoList = new ArrayList<>();
		for (StockTransactionDetailsSyncDto stockTransactionDetailsSyncDto : syncDto) {
			StockTransactionDao stockTxnDao = new StockTransactionDao();
			stockTxnDao.setId(stockTransactionDetailsSyncDto.getStockTransaction());
			StockTransactionDetailsDao stockTxnDetailsDao = (StockTransactionDetailsDao)MapperUtil.getObjectMapping(stockTransactionDetailsSyncDto, new StockTransactionDetailsDao());
			stockTxnDetailsDao.setStockTransaction(stockTxnDao);
			stockDaoList.add(stockTxnDetailsDao);
		}
		return stockDaoList;
	}
	
	
	
}
