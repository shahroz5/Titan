/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.datasync.dao.MaterialDatasyncStageDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class MaterialMasterDataSyncStageMapper implements RowMapper<MaterialDatasyncStageDao> {

	@Override
	public MaterialDatasyncStageDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		MaterialDatasyncStageDao materialDao = new MaterialDatasyncStageDao();
		materialDao.setMaterialCode(rs.getString("material_code"));
		materialDao.setMaterialType(rs.getString("material_type_code"));
		materialDao.setStdValue(rs.getBigDecimal("std_value"));
		materialDao.setStdWeight(rs.getBigDecimal("std_weight"));
		materialDao.setRatePerGram(rs.getBigDecimal("rate_per_gram"));
		materialDao.setColor(rs.getString("color"));
		materialDao.setQuality(rs.getString("quality"));
		materialDao.setShape(rs.getString("shape"));
		materialDao.setWeightUnit(rs.getString("weight_unit"));
		materialDao.setCurrencyCode(rs.getString("currency_code"));
		materialDao.setConfigDetails(rs.getString("config_details"));
		materialDao.setSrcSyncId(rs.getInt("src_sync_id"));
		materialDao.setDestSyncId(rs.getInt("dest_sync_id"));
		materialDao.setIsActive(rs.getBoolean("is_active"));
		materialDao.setCreatedBy(rs.getString("created_by"));
		materialDao.setCreatedDate(rs.getDate("created_date"));
		materialDao.setLastModifiedBy(rs.getString("last_modified_by"));
		materialDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		materialDao.setCorrelationId(rs.getString("correlation_id"));

		return materialDao;
	}

}
