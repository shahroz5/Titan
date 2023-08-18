/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;
import com.titan.poss.payment.dao.CashbackDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class CardDetailsMapper implements RowMapper<CashbackCardDetailsDaoExt> {

	@Override
	public CashbackCardDetailsDaoExt mapRow(ResultSet rs, int rowNum) throws SQLException {
		CashbackCardDetailsDaoExt cashbackCardDetailsDao = new CashbackCardDetailsDaoExt();
		cashbackCardDetailsDao.setId(rs.getString("id"));
		cashbackCardDetailsDao.setCardNo(rs.getString("card_no"));
		CashbackDaoExt cashbackDao = new CashbackDaoExt();
		cashbackDao.setId(rs.getString("cashback_id"));
		cashbackCardDetailsDao.setCashbackDao(cashbackDao);
		cashbackCardDetailsDao.setIsActive(rs.getBoolean("is_active"));
		cashbackCardDetailsDao.setCreatedBy(rs.getString("created_by"));
		cashbackCardDetailsDao.setCreatedDate(rs.getDate("created_date"));
		cashbackCardDetailsDao.setLastModifiedBy(rs.getString("last_modified_by"));
		cashbackCardDetailsDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		cashbackCardDetailsDao.setSrcSyncId(rs.getInt("src_sync_id"));
		cashbackCardDetailsDao.setDestSyncId(rs.getInt("dest_sync_id"));
		cashbackCardDetailsDao.setCorrelationId(rs.getString("correlation_id"));
		return cashbackCardDetailsDao;
	}

}
