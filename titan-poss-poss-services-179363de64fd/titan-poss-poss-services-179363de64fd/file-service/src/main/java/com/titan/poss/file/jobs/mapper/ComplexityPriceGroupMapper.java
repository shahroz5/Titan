/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ComplexityPriceGroupDao;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ComplexityPriceGroupMapper implements RowMapper<ComplexityPriceGroupDao> {

	@Override
	public ComplexityPriceGroupDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ComplexityPriceGroupDao complexityPriceGroupMappingDao = new ComplexityPriceGroupDao();
		complexityPriceGroupMappingDao.setId(rs.getString("id"));
		ComplexityDao ComplexityDao = new ComplexityDao();
		ComplexityDao.setComplexityCode(rs.getString("complexity_code"));
		complexityPriceGroupMappingDao.setComplexity(ComplexityDao);
		PriceGroupDao priceGroupDao = new PriceGroupDao();
		priceGroupDao.setPriceGroup(rs.getString("price_group"));
		complexityPriceGroupMappingDao.setPriceGroup(priceGroupDao);
		complexityPriceGroupMappingDao.setMakingChargePunit(rs.getBigDecimal("making_charge_punit"));
		complexityPriceGroupMappingDao.setMakingChargePgram(rs.getBigDecimal("making_charge_pgram"));
		complexityPriceGroupMappingDao.setWastagePct(rs.getBigDecimal("wastage_pct"));
		complexityPriceGroupMappingDao.setMakingChargePct(rs.getBigDecimal("making_charge_pct"));
		complexityPriceGroupMappingDao.setIsActive(rs.getBoolean("is_active"));
		complexityPriceGroupMappingDao.setCreatedBy(rs.getString("created_by"));
		complexityPriceGroupMappingDao.setCreatedDate(rs.getDate("created_date"));
		complexityPriceGroupMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		complexityPriceGroupMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		complexityPriceGroupMappingDao.setSrcSyncId(rs.getInt("src_sync_id"));
		complexityPriceGroupMappingDao.setDestSyncId(rs.getInt("dest_sync_id"));
		complexityPriceGroupMappingDao.setCurrencyCode(rs.getString("currency_code"));
		complexityPriceGroupMappingDao.setCorrelationId(rs.getString("correlation_id"));
		
		return complexityPriceGroupMappingDao;
	}

}
