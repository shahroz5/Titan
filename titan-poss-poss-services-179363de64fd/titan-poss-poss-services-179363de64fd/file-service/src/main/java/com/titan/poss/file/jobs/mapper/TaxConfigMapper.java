/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.location.dao.TaxConfigsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class TaxConfigMapper implements RowMapper<TaxConfigsDao> {

	@Override
	public TaxConfigsDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		TaxConfigsDao taxConfigsDao = new TaxConfigsDao();
		taxConfigsDao.setId(rs.getString("id"));
		taxConfigsDao.setTxnType(rs.getString("txn_type"));
		taxConfigsDao.setSrcLocationTaxType(rs.getString("src_location_type"));
		taxConfigsDao.setDestLocationTaxType(rs.getString("dest_location_type"));
		taxConfigsDao.setCustomerTaxType(rs.getString("customer_type"));
		taxConfigsDao.setIsSameState(rs.getBoolean("is_same_state"));
		taxConfigsDao.setSrcTaxApplicable(rs.getBoolean("src_tax_applicable"));
		taxConfigsDao.setApplicableTax(rs.getString("applicable_tax"));
		taxConfigsDao.setIsActive(rs.getBoolean("is_active"));
		taxConfigsDao.setCreatedBy(rs.getString("created_by"));
		taxConfigsDao.setCreatedDate(rs.getDate("created_date"));
		taxConfigsDao.setLastModifiedBy(rs.getString("last_modified_by"));
		taxConfigsDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		taxConfigsDao.setSrcLocationApplicableTax(rs.getString("src_location_applicable_tax"));
		taxConfigsDao.setDestLocationApplicableTax(rs.getString("dest_location_applicable_tax"));
		taxConfigsDao.setSrcSyncId(rs.getInt("src_sync_id"));
		taxConfigsDao.setDestSyncId(rs.getInt("dest_sync_id"));
		taxConfigsDao.setCorrelationId(rs.getString("correlation_id"));
		return taxConfigsDao;
	}

}
