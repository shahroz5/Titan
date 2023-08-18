package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNoteSyncDtoExt extends CreditNoteSyncDto {
	public CreditNoteSyncDtoExt() {

	}

	public CreditNoteSyncDtoExt(CreditNoteDaoExt creditDaoExt) {
		MapperUtil.getObjectMapping(creditDaoExt, this);
		if (creditDaoExt.getSalesTxn() != null)
			this.setSalesTxn(creditDaoExt.getSalesTxn().getId());
		if (creditDaoExt.getParentCn() != null)
			this.setParentCn(creditDaoExt.getParentCn().getId());
		if (creditDaoExt.getOriginalCn() != null)
			this.setOriginalCn(creditDaoExt.getOriginalCn().getId());
		if (creditDaoExt.getLinkedTxn() != null)
			this.setLinkedTxn(creditDaoExt.getLinkedTxn().getId());
		if (creditDaoExt.getCancelTxn() != null)
			this.setCancelTxn(creditDaoExt.getCancelTxn().getId());
		if (creditDaoExt.getMergedCN() != null)
			this.setMergedCN(creditDaoExt.getMergedCN().getId());
	}
	
	public CreditNoteSyncDtoExt(CreditNoteDao creditDaoExt) {
		MapperUtil.getObjectMapping(creditDaoExt, this);
		if (creditDaoExt.getSalesTxn() != null)
			this.setSalesTxn(creditDaoExt.getSalesTxn().getId());
		if (creditDaoExt.getParentCn() != null)
			this.setParentCn(creditDaoExt.getParentCn().getId());
		if (creditDaoExt.getOriginalCn() != null)
			this.setOriginalCn(creditDaoExt.getOriginalCn().getId());
		if (creditDaoExt.getLinkedTxn() != null)
			this.setLinkedTxn(creditDaoExt.getLinkedTxn().getId());
		if (creditDaoExt.getCancelTxn() != null)
			this.setCancelTxn(creditDaoExt.getCancelTxn().getId());
		if (creditDaoExt.getMergedCN() != null)
			this.setMergedCN(creditDaoExt.getMergedCN().getId());
	}

}
