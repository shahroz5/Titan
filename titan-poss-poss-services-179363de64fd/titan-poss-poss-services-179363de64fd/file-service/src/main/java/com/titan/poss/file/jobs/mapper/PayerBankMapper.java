/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.payment.dao.PayerBankDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PayerBankMapper implements  RowMapper<PayerBankDao> {

	@Override
	public PayerBankDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		
		PayerBankDao payerBankDao = new PayerBankDao();
		payerBankDao.setBankName(rs.getString("bank_name"));
		payerBankDao.setIsActive(rs.getBoolean("is_active"));
		payerBankDao.setCreatedBy(rs.getString("created_by"));
		payerBankDao.setCreatedDate(rs.getDate("created_date"));
		payerBankDao.setLastModifiedBy(rs.getString("last_modified_by"));
		payerBankDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		payerBankDao.setSrcSyncId(rs.getInt("src_sync_id"));
		payerBankDao.setDestSyncId(rs.getInt("dest_sync_id"));
		payerBankDao.setCorrelationId(rs.getString("correlation_id"));
		return payerBankDao;
	}

}
