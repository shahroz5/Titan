package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerTxnSyncDtoExt extends CustomerTxnSyncDto {
	public CustomerTxnSyncDtoExt() {

	}

	public CustomerTxnSyncDtoExt(CustomerTxnDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setSalesTxnDao(daoExt.getSalesTxnDao().getId());
	}

	public CustomerTxnSyncDtoExt(CustomerTxnDao daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setSalesTxnDao(daoExt.getSalesTxnDao().getId());
	}
}
