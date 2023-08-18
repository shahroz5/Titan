/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.dao.PriceGroupDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PriceMasterMapper implements RowMapper<PriceDao> {

	@Override
	public PriceDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		PriceDao priceDao = new PriceDao();
		priceDao.setId(rs.getString("id"));

		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(rs.getString("item_code"));
		priceDao.setItem(itemDao);

		PriceGroupDao priceGroupDao = new PriceGroupDao();
		priceGroupDao.setPriceGroup(rs.getString("price_group"));
		priceDao.setPriceGroup(priceGroupDao);

		priceDao.setMakingCharge(rs.getBigDecimal("making_charge"));
		priceDao.setIsActive(rs.getBoolean("is_active"));
		priceDao.setSrcSyncId(rs.getInt("src_sync_id"));
		priceDao.setDestSyncId(rs.getInt("dest_sync_id"));
		priceDao.setCreatedBy(rs.getString("created_by"));
		priceDao.setCreatedDate(rs.getDate("created_date"));
		priceDao.setLastModifiedBy(rs.getString("last_modified_by"));
		priceDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		priceDao.setCorrelationId(rs.getString("correlation_id"));

		return priceDao;
	}

}
