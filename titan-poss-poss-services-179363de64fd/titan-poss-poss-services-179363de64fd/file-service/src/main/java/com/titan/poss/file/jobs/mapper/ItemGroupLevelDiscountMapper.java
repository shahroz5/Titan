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
import com.titan.poss.config.dao.DiscountItemMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemGroupLevelDiscountMapper implements RowMapper<DiscountItemMappingDao> {

	@Override
	public DiscountItemMappingDao mapRow(ResultSet rs, int rowNum) throws SQLException {

		DiscountItemMappingDao discountItemMappingDao = new DiscountItemMappingDao();
		discountItemMappingDao.setId(rs.getString("id"));
		discountItemMappingDao.setItemCode(rs.getString("item_code"));
		discountItemMappingDao.setLotNumber(rs.getString("lot_number"));
		discountItemMappingDao.setLocationCode(rs.getString("location_code"));
		discountItemMappingDao.setIsActive(rs.getBoolean("is_active"));
		discountItemMappingDao.setCreatedBy(rs.getString("created_by"));
		discountItemMappingDao.setCreatedDate(rs.getDate("created_date"));
		discountItemMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		discountItemMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));

		DiscountDao discount = new DiscountDao();
		discount.setId(rs.getString("discount_id"));
		discountItemMappingDao.setDiscount(discount);
		
		discountItemMappingDao.setStartDate(rs.getDate("start_date"));
		discountItemMappingDao.setEndDate(rs.getDate("end_date"));
		discountItemMappingDao.setPreviewStartDate(rs.getDate("preview_start_date"));
		discountItemMappingDao.setPreviewEndDate(rs.getDate("preview_end_date"));
		discountItemMappingDao.setPreviewConfigDetails(rs.getString("preview_config_details"));
		discountItemMappingDao.setRegularConfigDetails(rs.getString("regular_config_details"));
		discountItemMappingDao.setIsTransferredLocation(rs.getBoolean("is_transferred_location"));
		discountItemMappingDao.setIsPreviewApplicable(rs.getBoolean("is_preview_applicable"));
		discountItemMappingDao.setCorrelationId(rs.getString("correlation_id"));
		discountItemMappingDao.setSrcSyncId(rs.getInt("src_sync_id"));
		discountItemMappingDao.setDestSyncId(rs.getInt("dest_sync_id"));
		return discountItemMappingDao;
	}
}
