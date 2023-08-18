/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GeneralLedgerDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GeneralLedgerFileReaderRowMapper implements RowMapper<GeneralLedgerDto> {

	@Override
	public GeneralLedgerDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		GeneralLedgerDto generalLedger = new GeneralLedgerDto();
		generalLedger.setStatus(rs.getString("status"));
		generalLedger.setSetOfBooks(rs.getString("set_of_books"));
		generalLedger.setCurrency(rs.getString("currency"));
		generalLedger.setJeSource(rs.getString("je_source"));
		String debitAmount = StringUtils.isEmpty(rs.getString("entered_dr")) ? ""
				: rs.getBigDecimal("entered_dr").toString();
		String creditAmount = StringUtils.isEmpty(rs.getString("entered_cr")) ? ""
				: rs.getBigDecimal("entered_cr").toString();
		generalLedger.setEnteredDr(debitAmount);
		generalLedger.setEnteredCr(creditAmount);
		generalLedger.setAcDDr(debitAmount);
		generalLedger.setAcDCr(creditAmount);
		generalLedger.setJeLineNum(rs.getString("je_line_num"));
		generalLedger.setSeg1(rs.getString("seg1"));
		generalLedger.setSeg2(rs.getString("seg2"));
		generalLedger.setSeg3(rs.getString("seg3"));
		generalLedger.setSeg4(rs.getString("seg4"));
		generalLedger.setSeg5(rs.getString("seg5"));
		generalLedger.setSeg6(rs.getString("seg6"));
		generalLedger.setPeriodName(rs.getString("period_name"));
		generalLedger.setAcGDate(rs.getString("ac_g_date"));
		generalLedger.setJeCategory(rs.getString("je_category"));
		generalLedger.setCreateDate(rs.getString("create_date"));
		generalLedger.setCreatedBy(rs.getString("created_by"));
		generalLedger.setActualFlag(rs.getString("actual_flag"));
		generalLedger.setGroupId(rs.getString("group_id"));
		generalLedger.setAttribute5(rs.getString("attribute5"));
		generalLedger.setAttribute6(rs.getString("attribute6"));
		generalLedger.setAttribute4(rs.getString("attribute4"));
		generalLedger.setAttribute3(rs.getString("attribute3"));
		generalLedger.setAttribute2(rs.getString("attribute2"));
		generalLedger.setAttribute1(rs.getString("attribute1"));
		generalLedger.setFileName(rs.getString("file_name"));
		return generalLedger;
	}
}
