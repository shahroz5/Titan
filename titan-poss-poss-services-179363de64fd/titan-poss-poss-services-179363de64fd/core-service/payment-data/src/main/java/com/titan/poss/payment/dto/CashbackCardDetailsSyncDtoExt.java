package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@EqualsAndHashCode(callSuper = false)
public class CashbackCardDetailsSyncDtoExt extends CashbackCardDetailsSyncDto {

	public CashbackCardDetailsSyncDtoExt() {

	}

	public CashbackCardDetailsSyncDtoExt(CashbackCardDetailsDaoExt cashbackCardDetailsDaoExt) {
		MapperUtil.getObjectMapping(cashbackCardDetailsDaoExt, this);
		this.setCashbackDao(cashbackCardDetailsDaoExt.getCashbackDao().getId());
	}

	public List<CashbackCardDetailsSyncDtoExt> getSyncDtoList(List<CashbackCardDetailsDaoExt> daoList) {

		List<CashbackCardDetailsSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			log.info("dao value" + dao);
			CashbackCardDetailsSyncDtoExt syncDto = new CashbackCardDetailsSyncDtoExt(dao);
			syncDto.setCashbackDao(dao.getCashbackDao().getId());
			log.info("sync dto value" + dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
