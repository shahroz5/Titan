package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CashMemoSyncDtoExt extends CashMemoSyncDto{
	public CashMemoSyncDtoExt() {
	
}
	public CashMemoSyncDtoExt(CashMemoDaoExt cashMemoDao, String createdBy) {
	MapperUtil.getObjectMapping(cashMemoDao,this);
	if(createdBy != null)
		this.setCreatedBy(createdBy);
	this.setSalesTxnDao(cashMemoDao.getSalesTxnDao().getId());
}
	public CashMemoSyncDtoExt(CashMemoDao cashMemoDao, String createdBy) {
		MapperUtil.getObjectMapping(cashMemoDao,this);
		if(createdBy != null)
			this.setCreatedBy(createdBy);
		this.setSalesTxnDao(cashMemoDao.getSalesTxnDao().getId());
	}
	public CashMemoSyncDtoExt(CashMemoDao cashMemoDao) {
		MapperUtil.getObjectMapping(cashMemoDao,this);
		this.setSalesTxnDao(cashMemoDao.getSalesTxnDao().getId());
	}
	
}
