/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.payment.dao.PaymentHostnameMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PaymentHostnameMapper implements RowMapper<PaymentHostnameMappingDaoExt> {

	@Override
	public PaymentHostnameMappingDaoExt mapRow(ResultSet rs, int rowNum) throws SQLException {
		PaymentHostnameMappingDaoExt paymentHostnameMappingDao = new PaymentHostnameMappingDaoExt();
		paymentHostnameMappingDao.setId(rs.getString("id"));
		paymentHostnameMappingDao.setLocationCode(rs.getString("location_code"));
		paymentHostnameMappingDao.setDeviceId(rs.getString("device_id"));
		paymentHostnameMappingDao.setHostName(rs.getString("host_name"));
		paymentHostnameMappingDao.setPaymentCode(rs.getString("payment_code"));
		paymentHostnameMappingDao.setCreatedBy(rs.getString("created_by"));
		paymentHostnameMappingDao.setCreatedDate(rs.getDate("created_date"));
		paymentHostnameMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		paymentHostnameMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		paymentHostnameMappingDao.setCorrelationId(rs.getString("correlation_id"));
		paymentHostnameMappingDao.setSrcSyncId(rs.getInt("src_sync_id"));
		paymentHostnameMappingDao.setDestSyncId(rs.getInt("dest_sync_id"));
		paymentHostnameMappingDao.setIsActive(rs.getBoolean("is_active"));
		return paymentHostnameMappingDao;
	}

}
