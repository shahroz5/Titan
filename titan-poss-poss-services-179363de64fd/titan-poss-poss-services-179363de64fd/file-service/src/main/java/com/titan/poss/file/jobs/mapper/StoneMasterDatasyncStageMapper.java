/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.datasync.dao.StoneDataSyncStageDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StoneMasterDatasyncStageMapper implements RowMapper<StoneDataSyncStageDao> {

	@Override
	public StoneDataSyncStageDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		StoneDataSyncStageDao stoneDao = new StoneDataSyncStageDao();
		stoneDao.setStoneCode(rs.getString("stone_code"));
		stoneDao.setColor(rs.getString("color"));
		stoneDao.setStdWeight(rs.getBigDecimal("std_weight"));
		stoneDao.setQuality(rs.getString("quality"));
		stoneDao.setShape(rs.getString("shape"));
		stoneDao.setStdValue(rs.getBigDecimal("std_value"));
		stoneDao.setConfigDetails(rs.getString("config_details"));
		stoneDao.setRatePerCarat(rs.getBigDecimal("rate_per_carat"));
		stoneDao.setCurrencyCode(rs.getString("currency_code"));
		stoneDao.setWeightUnit(rs.getString("weight_unit"));
		stoneDao.setIsActive(rs.getBoolean("is_active"));
		stoneDao.setSrcSyncId(rs.getInt("src_sync_id"));
		stoneDao.setDestSyncId(rs.getInt("dest_sync_id"));
		stoneDao.setCreatedBy(rs.getString("created_by"));
		stoneDao.setCreatedDate(rs.getDate("created_date"));
		stoneDao.setLastModifiedBy(rs.getString("last_modified_by"));
		stoneDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		stoneDao.setStoneType(rs.getString("stone_type_code"));
		stoneDao.setCorrelationId(rs.getString("correlation_id"));
		
		return stoneDao;
	}

}
