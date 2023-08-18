/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.BoutiqueSalesDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class BoutiqueSalesFileTaxMapper implements RowMapper<BoutiqueSalesDto> {

	@Override
	public BoutiqueSalesDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		BoutiqueSalesDto boutiqueSalesDto = new BoutiqueSalesDto();

		boutiqueSalesDto.setRecType(rs.getString("rec_type"));
		boutiqueSalesDto.setTaxSysDocumentRef(rs.getString("sys_document_ref"));
		boutiqueSalesDto.setTaxLineNo(rs.getInt("tax_line_no"));
		boutiqueSalesDto.setTaxName(rs.getString("tax_name"));
		String sysDocRef = rs.getString("sys_document_ref");
		if(sysDocRef.substring(3).contains("BC") || sysDocRef.substring(3).contains("GRN") ) {
			BigDecimal mul = new BigDecimal("-1");
			boutiqueSalesDto.setTaxAmount(rs.getBigDecimal("tax_amount").multiply(mul));
		}
		else {
			boutiqueSalesDto.setTaxAmount(rs.getBigDecimal("tax_amount"));
		}
		boutiqueSalesDto.setTaxInventoryItem(rs.getString("inventory_item"));
		boutiqueSalesDto.setTaxLotNumber(rs.getString("lot_number"));
		boutiqueSalesDto.setLineNo(rs.getInt("line_no"));
		boutiqueSalesDto.setTaxRecordId(rs.getInt("record_id"));
		boutiqueSalesDto.setTaxLocationId(rs.getString("location_id"));
		boutiqueSalesDto.setTaxBusinessDate(CalendarUtils.formatDateToString(rs.getDate("business_date"),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueSalesDto.setTaxFileName(rs.getString("file_name"));

		return boutiqueSalesDto;

	}

}
