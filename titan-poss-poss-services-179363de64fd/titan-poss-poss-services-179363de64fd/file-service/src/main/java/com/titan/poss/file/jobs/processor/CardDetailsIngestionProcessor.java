/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.CardDetailsDto;
import com.titan.poss.payment.dao.CashbackCardDetailsDao;
import com.titan.poss.payment.dao.CashbackDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class CardDetailsIngestionProcessor implements ItemProcessor<CardDetailsDto, CashbackCardDetailsDao> {

	@Override
	public CashbackCardDetailsDao process(CardDetailsDto item) throws Exception {
		CashbackCardDetailsDao cashbackCardDetailsDao = new CashbackCardDetailsDao();
		cashbackCardDetailsDao.setId(item.getId());
		CashbackDao cashbackDao = new CashbackDao();
		cashbackDao.setId(item.getCashbackId());
		cashbackCardDetailsDao.setCashbackDao(cashbackDao);
		cashbackCardDetailsDao.setCardNo(item.getCardNo());
		cashbackCardDetailsDao.setIsActive(item.getIsActive());
		cashbackCardDetailsDao.setCreatedBy(item.getCreatedBy());
		cashbackCardDetailsDao.setCreatedDate(item.getCreatedDate());
		cashbackCardDetailsDao.setLastModifiedBy(item.getLastModifiedBy());
		cashbackCardDetailsDao.setLastModifiedDate(item.getLastModifiedDate());
		cashbackCardDetailsDao.setCorrelationId(item.getFileAuditId());
		cashbackCardDetailsDao.setSrcSyncId(0);
		cashbackCardDetailsDao.setDestSyncId(0);
		return cashbackCardDetailsDao ;
	}
}
