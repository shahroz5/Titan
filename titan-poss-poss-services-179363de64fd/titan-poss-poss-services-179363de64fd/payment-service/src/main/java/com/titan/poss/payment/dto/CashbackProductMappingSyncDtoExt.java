package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackProductMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackProductMappingSyncDtoExt extends CashbackProductMappingSyncDto {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CashbackProductMappingSyncDtoExt() {

	}

	public CashbackProductMappingSyncDtoExt(CashbackProductMappingDaoExt cashbackProductMappingDao) {
		MapperUtil.getObjectMapping(cashbackProductMappingDao, this);
		this.setCashbackDao(cashbackProductMappingDao.getCashbackDao().getId());
	}
}
