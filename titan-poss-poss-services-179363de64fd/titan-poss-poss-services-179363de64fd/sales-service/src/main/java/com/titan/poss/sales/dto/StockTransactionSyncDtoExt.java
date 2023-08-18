package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.StockTransactionDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class StockTransactionSyncDtoExt extends StockTransactionSyncDto {

	public StockTransactionSyncDtoExt() {

	}

	public StockTransactionSyncDtoExt(StockTransactionDaoExt stockTransactionDao) {
		MapperUtil.getObjectMapping(stockTransactionDao, this);
	}

}
