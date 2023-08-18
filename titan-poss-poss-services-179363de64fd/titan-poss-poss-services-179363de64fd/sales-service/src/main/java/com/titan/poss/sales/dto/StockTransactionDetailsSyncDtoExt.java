package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.StockTransactionDao;
import com.titan.poss.sales.dao.StockTransactionDetailsDao;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class StockTransactionDetailsSyncDtoExt extends StockTransactionDetailsSyncDto {

	public StockTransactionDetailsSyncDtoExt() {

	}

	public StockTransactionDetailsSyncDtoExt(StockTransactionDetailsDao stockTransactionDetailsDao) {
		MapperUtil.getObjectMapping(stockTransactionDetailsDao, this);
	}
	
	public List<StockTransactionDetailsSyncDtoExt> getStockTransactionDetailsDtoList(List<StockTransactionDetailsDaoExt> syncDto) {
		List<StockTransactionDetailsSyncDtoExt> stockDaoList = new ArrayList<>();
		for (StockTransactionDetailsDaoExt stockTransactionDetailsDao : syncDto) {
			StockTransactionDao stockTxnDao = new StockTransactionDao();
			stockTxnDao.setId(stockTransactionDetailsDao.getStockTransaction().getId());
			StockTransactionDetailsSyncDtoExt stockTxnDetailsDao = (StockTransactionDetailsSyncDtoExt)MapperUtil.getObjectMapping(stockTransactionDetailsDao, new StockTransactionDetailsSyncDtoExt());
			stockTxnDetailsDao.setStockTransaction(stockTxnDao.getId());
			stockDaoList.add(stockTxnDetailsDao);
		}
		return stockDaoList;
	}

}
