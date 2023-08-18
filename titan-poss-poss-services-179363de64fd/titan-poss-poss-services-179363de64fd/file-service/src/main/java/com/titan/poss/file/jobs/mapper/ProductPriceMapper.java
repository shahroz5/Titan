/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.ProductPriceMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ProductPriceMapper implements RowMapper<ProductPriceMappingDao> {

	@Override
	public ProductPriceMappingDao mapRow(ResultSet rs, int rowNum) throws SQLException {

		ProductPriceMappingDao productPriceMappingDao = new ProductPriceMappingDao();
		productPriceMappingDao.setId(rs.getString("id"));
		ProductGroupDao productGroupDao = new ProductGroupDao();
		productGroupDao.setProductGroupCode(rs.getString("product_group_code"));
		productPriceMappingDao.setProductGroup(productGroupDao);
		productPriceMappingDao.setFromBand(rs.getInt("from_band"));
		productPriceMappingDao.setToBand(rs.getInt("to_band"));
		productPriceMappingDao.setFromPrice(rs.getBigDecimal("from_price"));
		productPriceMappingDao.setToPrice(rs.getBigDecimal("to_price"));
		productPriceMappingDao.setMargin(rs.getBigDecimal("margin"));
		productPriceMappingDao.setCreatedBy(rs.getString("created_by"));
		productPriceMappingDao.setCreatedDate(rs.getDate("created_date"));
		productPriceMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		productPriceMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		productPriceMappingDao.setSrcSyncId(rs.getInt("src_sync_id"));
		productPriceMappingDao.setDestSyncId(rs.getInt("dest_sync_id"));
		productPriceMappingDao.setCorrelationId(rs.getString("correlation_id"));
		return productPriceMappingDao;
	}

}
