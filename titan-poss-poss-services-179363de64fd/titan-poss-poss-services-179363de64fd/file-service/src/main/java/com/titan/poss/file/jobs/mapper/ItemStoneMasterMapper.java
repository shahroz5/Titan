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
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dao.StoneDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemStoneMasterMapper implements RowMapper<ItemStoneMappingDao> {

	@Override
	public ItemStoneMappingDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ItemStoneMappingDao itemStoneMappingDao = new ItemStoneMappingDao();
		itemStoneMappingDao.setId(rs.getString("id"));

		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(rs.getString("item_code"));
		itemStoneMappingDao.setItem(itemDao);

		StoneDao stoneDao = new StoneDao();
		stoneDao.setStoneCode(rs.getString("stone_code"));
		itemStoneMappingDao.setStone(stoneDao);

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
