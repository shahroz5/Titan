package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackOfferDetailsDaoExt;

public class CashbackOfferDetailsSyncDtoExt extends CashbackOfferDetailsSyncDto{

	private static final long serialVersionUID = 1L;

	public CashbackOfferDetailsSyncDtoExt() {
		
	}
	
	public CashbackOfferDetailsSyncDtoExt(CashbackOfferDetailsDaoExt cashbackOfferDetailsDaoExt) {
		MapperUtil.getObjectMapping(cashbackOfferDetailsDaoExt, this);
		this.setCashbackDao(cashbackOfferDetailsDaoExt.getCashbackDao().getId());
	}
}
