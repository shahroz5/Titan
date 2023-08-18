package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayerLocationMappingDaoExt;

public class PayerLocationMappingSyncDtoExt extends PayerLocationMappingSyncDto{

	private static final long serialVersionUID = 1L;

	public PayerLocationMappingSyncDtoExt() {

	}

	public PayerLocationMappingSyncDtoExt(PayerLocationMappingDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setPayment(daoExt.getPayment().getPaymentCode());
		this.setPayerBankConfig(daoExt.getPayerBankConfig().getId());
	}

	public List<PayerLocationMappingSyncDtoExt> getSyncDtoList(List<PayerLocationMappingDaoExt> daoExtList) {
		List<PayerLocationMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		daoExtList.forEach(dao -> {
			PayerLocationMappingSyncDtoExt dto = new PayerLocationMappingSyncDtoExt(dao);
			syncDtoList.add(dto);
		});
		return syncDtoList;
	}
}
