/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.inventory.dao.StockTransferDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StockTransferMapper implements RowMapper<StockTransferDao> {

	@Override
	public StockTransferDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		StockTransferDao stockTransferDao = new StockTransferDao();

		stockTransferDao.setCarrierDetails(rs.getString("carrier_details"));
		stockTransferDao.setDestLocationCode(rs.getString("location"));
		stockTransferDao.setOrgCode(CommonConstants.ORG_CODE);
		stockTransferDao.setSrcDocDate(CalendarUtils.convertStringToDate(rs.getString("stm_date"), "yyyy-MM-dd"));
		stockTransferDao.setSrcDocNo(rs.getInt("delivery_no"));
		stockTransferDao.setSrcFiscalYear(rs.getShort("created_year"));
		stockTransferDao.setSrcLocationCode(rs.getString("factory_code"));
		stockTransferDao.setStatus(FileIntegrationConstants.ISSUED);
		stockTransferDao.setTotalIssuedQuantity(rs.getShort("ship_qty"));
		stockTransferDao.setTotalIssuedValue(rs.getBigDecimal("stm_value"));
		stockTransferDao.setTotalIssuedWeight(rs.getBigDecimal("ship_qty2"));
		stockTransferDao.setTransferType(rs.getString("stock_transfer_type"));
		String createdBy = StringUtils.isEmpty(rs.getString("created_by")) ? FileIntegrationConstants.ERP_USER
				: rs.getString("created_by");
		stockTransferDao.setCreatedBy(createdBy);
		stockTransferDao
				.setCreatedDate(CalendarUtils.convertStringToDate(rs.getString("created_date"), "yyyy-MM-dd HH:mm:ss"));
		stockTransferDao.setLastModifiedBy(createdBy);
		stockTransferDao.setLastModifiedDate(
				CalendarUtils.convertStringToDate(rs.getString("created_date"), "yyyy-MM-dd HH:mm:ss"));

		return stockTransferDao;
	}

}
