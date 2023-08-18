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

import com.titan.poss.datasync.dao.ItemStoneDatasyncStageDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemStoneDatasyncStageMapper implements RowMapper<ItemStoneDatasyncStageDao> {

	@Override
	public ItemStoneDatasyncStageDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ItemStoneDatasyncStageDao itemStoneMappingDao = new ItemStoneDatasyncStageDao();
		itemStoneMappingDao.setId(rs.getString("id"));

		itemStoneMappingDao.setItem(rs.getString("item_code"));

		itemStoneMappingDao.setStone(rs.getString("stone_code"));

		itemStoneMappingDao.setNoOfStones(rs.getShort("no_of_stones"));
		itemStoneMappingDao.setIsActive(rs.getBoolean("is_active"));
		// add sync time
		itemStoneMappingDao.setSyncTime(new Date().getTime());
		itemStoneMappingDao.setCreatedBy(rs.getString("created_by"));
		itemStoneMappingDao.setCreatedDate(rs.getDate("created_date"));
		itemStoneMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		itemStoneMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		itemStoneMappingDao.setCorrelationId(rs.getString("correlation_id"));

		return itemStoneMappingDao;
	}

}
