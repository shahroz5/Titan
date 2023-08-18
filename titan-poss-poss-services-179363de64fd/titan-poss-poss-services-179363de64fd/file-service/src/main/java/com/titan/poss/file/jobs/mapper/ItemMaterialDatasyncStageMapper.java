/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.datasync.dao.ItemMaterialDatasyncStageDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMaterialDatasyncStageMapper implements RowMapper<ItemMaterialDatasyncStageDao>{

	@Override
	public ItemMaterialDatasyncStageDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ItemMaterialDatasyncStageDao itemMaterialMappingDao = new ItemMaterialDatasyncStageDao();
		itemMaterialMappingDao.setId(rs.getString("id"));
		itemMaterialMappingDao.setItem(rs.getString("item_code"));
		itemMaterialMappingDao.setMaterial(rs.getString("material_code"));
		itemMaterialMappingDao.setNoOfMaterials(rs.getBigDecimal("no_of_materials"));
		itemMaterialMappingDao.setIsActive(rs.getBoolean("is_active"));
		// add sync time
		itemMaterialMappingDao.setSyncTime(new Date().getTime());
		itemMaterialMappingDao.setCreatedBy(rs.getString("created_by"));
		itemMaterialMappingDao.setCreatedDate(rs.getDate("created_date"));
		itemMaterialMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		itemMaterialMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		itemMaterialMappingDao.setCorrelationId(rs.getString("correlation_id"));

		return itemMaterialMappingDao;
	}

}
