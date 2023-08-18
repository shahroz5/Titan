package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class SalesTxnSyncDtoExt extends SalesTxnSyncDto {
	public SalesTxnSyncDtoExt() {

	}

	public SalesTxnSyncDtoExt(SalesTxnDaoExt salesDao, String createdBy) {
		MapperUtil.getObjectMapping(salesDao, this);
		if(createdBy != null)
			this.setCreatedBy(createdBy);
		if (salesDao.getRefTxnId() != null)
			this.setRefTxnId(salesDao.getRefTxnId().getId());
	}

	public SalesTxnSyncDtoExt(SalesTxnDao salesDao, String createdBy) {
		MapperUtil.getObjectMapping(salesDao, this);
		if(createdBy != null)
			this.setCreatedBy(createdBy);
		if (salesDao.getRefTxnId() != null)
			this.setRefTxnId(salesDao.getRefTxnId().getId());
	}
	public SalesTxnSyncDtoExt(SalesTxnDao salesDao) {
		MapperUtil.getObjectMapping(salesDao, this);
		if (salesDao.getRefTxnId() != null)
			this.setRefTxnId(salesDao.getRefTxnId().getId());
	}
}
