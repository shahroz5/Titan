/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountExcludeMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class DiscountExcludeItemMapper implements RowMapper<DiscountExcludeMappingDao> {

	@Override
	public DiscountExcludeMappingDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		DiscountExcludeMappingDao discountExcludeItemMappingDao = new DiscountExcludeMappingDao();
		discountExcludeItemMappingDao.setId(rs.getString("id"));
		DiscountDao discountDao = new DiscountDao();
		discountDao.setId(rs.getString("discount_id"));
		discountExcludeItemMappingDao.setDiscount(discountDao);
		discountExcludeItemMappingDao.setItemCode(rs.getString("item_code"));
		discountExcludeItemMappingDao.setThemeCode(rs.getString("theme_code"));
		discountExcludeItemMappingDao.setIsExcluded(rs.getBoolean("is_excluded"));
		discountExcludeItemMappingDao.setExcludeType(rs.getString("exclude_type"));
		discountExcludeItemMappingDao.setFromValue(rs.getBigDecimal("from_value"));
		discountExcludeItemMappingDao.setToValue(rs.getBigDecimal("to_value"));
		discountExcludeItemMappingDao.setCreatedBy(rs.getString("created_by"));
		discountExcludeItemMappingDao.setCreatedDate(rs.getDate("created_date"));
		discountExcludeItemMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		discountExcludeItemMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		discountExcludeItemMappingDao.setSrcSyncId(rs.getInt("src_sync_id"));
		discountExcludeItemMappingDao.setDestSyncId(rs.getInt("dest_sync_id"));
		// discountExcludeItemMappingDao.setCorrelationId(rs.getString("correlation_id"));
		return discountExcludeItemMappingDao;
	}

}
