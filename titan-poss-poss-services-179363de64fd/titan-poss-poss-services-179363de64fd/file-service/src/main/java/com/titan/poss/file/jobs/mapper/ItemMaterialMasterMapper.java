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

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.dao.MaterialDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMaterialMasterMapper implements RowMapper<ItemMaterialMappingDao>{

	@Override
	public ItemMaterialMappingDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ItemMaterialMappingDao itemMaterialMappingDao = new ItemMaterialMappingDao();
		itemMaterialMappingDao.setId(rs.getString("id"));

		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(rs.getString("item_code"));
		itemMaterialMappingDao.setItem(itemDao);
//
//		MaterialDao materialDao = new MaterialDao();
//		materialDao.setMaterialCode(rs.getString("material_code"));
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
