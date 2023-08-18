/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GepConfigExcludeMapper implements RowMapper<ExchangeConfigExcludeMappingDaoExt> {

	@Override
	public ExchangeConfigExcludeMappingDaoExt mapRow(ResultSet rs, int rowNum) throws SQLException {
		ExchangeConfigExcludeMappingDaoExt gepConfigExcludeMappingDao = new ExchangeConfigExcludeMappingDaoExt();
		gepConfigExcludeMappingDao.setId(rs.getString("id"));
		ExchangeConfigMasterDaoExt gepConfigMasterDao = new ExchangeConfigMasterDaoExt();
		gepConfigMasterDao.setConfigId(rs.getString("config_id"));
		gepConfigExcludeMappingDao.setExchangeConfig(gepConfigMasterDao);
		gepConfigExcludeMappingDao.setItemCode(rs.getString("item_code"));
		gepConfigExcludeMappingDao.setThemeCode(rs.getString("theme_code"));
		gepConfigExcludeMappingDao.setIsExcluded(rs.getBoolean("is_excluded"));
		gepConfigExcludeMappingDao.setCreatedBy(rs.getString("created_by"));
		gepConfigExcludeMappingDao.setCreatedDate(rs.getDate("created_date"));
		gepConfigExcludeMappingDao.setLastModifiedBy(rs.getString("last_modified_by"));
		gepConfigExcludeMappingDao.setLastModifiedDate(rs.getDate("last_modified_date"));
//		gepConfigExcludeMappingDao.setSrcSyncId(rs.getInt("src_sync_id"));
//		gepConfigExcludeMappingDao.setDestSyncId(rs.getInt("dest_sync_id"));
		gepConfigExcludeMappingDao.setCorrelationId(rs.getString("correlation_id"));
		return gepConfigExcludeMappingDao;
	}

}
