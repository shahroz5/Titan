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

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.inventory.dao.StockInvoiceDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StockInvoiceMapper implements RowMapper<StockInvoiceDao> {

	@Override
	public StockInvoiceDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		StockInvoiceDao stockInvoiceDao = new StockInvoiceDao();
		stockInvoiceDao.setCreatedBy(FileIntegrationConstants.ERP_USER);
		stockInvoiceDao.setCreatedDate(new Date());
		stockInvoiceDao.setInvoiceType(FileIntegrationConstants.TRANSFER_TYPE_CFA_BTQ);
		stockInvoiceDao.setLastModifiedBy(FileIntegrationConstants.ERP_USER);
		stockInvoiceDao.setLastModifiedDate(new Date());
		stockInvoiceDao.setOrgCode(CommonConstants.ORG_CODE);
		stockInvoiceDao.setSrcDocDate(rs.getDate("cfa_invoice_date"));
		stockInvoiceDao.setSrcFiscalYear(rs.getShort("cfa_fiscal_year"));
		stockInvoiceDao.setSrcDocNo(rs.getInt("cfa_invoice_number"));
		stockInvoiceDao.setSrcLocationCode(rs.getString("to_sub_inv"));
		stockInvoiceDao.setStatus(FileIntegrationConstants.ISSUED);
		stockInvoiceDao.setTotalIssuedQuantity(rs.getShort("cfa_tot_primary_qty"));
		stockInvoiceDao.setTotalIssuedValue(rs.getBigDecimal("cfa_item_basic_value"));
		stockInvoiceDao.setTotalIssuedWeight(rs.getBigDecimal("cfa_tot_secondary_qty"));
		stockInvoiceDao.setTotalDiscount(rs.getBigDecimal("cfa_tot_discount_amount"));
		stockInvoiceDao.setTotalTax(rs.getBigDecimal("cfa_tax_amount"));
		return stockInvoiceDao;
	}

}
