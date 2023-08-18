package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentDetailsSyncDtoExt extends PaymentDetailsSyncDto {
	public PaymentDetailsSyncDtoExt() {

	}

	public PaymentDetailsSyncDtoExt(PaymentDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if(daoExt.getSalesTxnDao()!=null)
			this.setSalesTxnDao(daoExt.getSalesTxnDao().getId());
		if(daoExt.getCreditNoteDao()!=null)
			this.setCreditNoteDao(daoExt.getCreditNoteDao().getId());
	}

}
