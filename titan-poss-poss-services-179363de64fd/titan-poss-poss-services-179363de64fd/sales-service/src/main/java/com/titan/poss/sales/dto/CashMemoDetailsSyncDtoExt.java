package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CashMemoDetailsSyncDtoExt extends CashMemoDetailsSyncDto {
	public CashMemoDetailsSyncDtoExt() {

	}

	public CashMemoDetailsSyncDtoExt(CashMemoDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setCashMemoDao(daoExt.getCashMemoDao().getId());
		if (daoExt.getOrderItem() != null) {
			this.setOrderItem(daoExt.getOrderItem().getId());
		}
	}
	
	public CashMemoDetailsSyncDtoExt(CashMemoDetailsDao daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setCashMemoDao(daoExt.getCashMemoDao().getId());
		if (daoExt.getOrderItem() != null) {
			this.setOrderItem(daoExt.getOrderItem().getId());
		}
	}
}
