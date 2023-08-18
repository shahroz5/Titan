/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackCardDetailsDao;
import com.titan.poss.payment.dao.CashbackDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackCardDetailsSyncDto extends MasterSyncableEntity {

	private String cardNo;

	private String id;

	private String cashbackDao;

	private String correlationId;

	public CashbackCardDetailsDao getCashbackDao(CashbackCardDetailsSyncDto cashbackCardDetailsSyncDto) {
		CashbackCardDetailsDao cashbackCardDetailsDao = (CashbackCardDetailsDao) MapperUtil
				.getObjectMapping(cashbackCardDetailsSyncDto, new CashbackCardDetailsDao());
		CashbackDao cashbaackDao = new CashbackDao();
		cashbaackDao.setId(cashbackCardDetailsSyncDto.getCashbackDao());
		cashbackCardDetailsDao.setCashbackDao(cashbaackDao);
		return cashbackCardDetailsDao;
	}

	public CashbackCardDetailsSyncDto getCashbackCardDetailsSyncDto(CashbackCardDetailsDao cashbackCardDetailsDao) {
		CashbackCardDetailsSyncDto cashbackCardDetailsSyncDto = (CashbackCardDetailsSyncDto) MapperUtil
				.getObjectMapping(cashbackCardDetailsDao, this);
		cashbackCardDetailsSyncDto.setCashbackDao(cashbackCardDetailsDao.getCashbackDao().getId());
		return cashbackCardDetailsSyncDto;
	}

	public List<CashbackCardDetailsDao> getDaoList(List<CashbackCardDetailsSyncDto> dtoList) {
		List<CashbackCardDetailsDao> daoList = new ArrayList<>();
		dtoList.forEach(dto -> {
			CashbackCardDetailsSyncDto syncDto = new CashbackCardDetailsSyncDto();
			daoList.add(syncDto.getCashbackDao(dto));
		});
		return daoList;
	}

}
