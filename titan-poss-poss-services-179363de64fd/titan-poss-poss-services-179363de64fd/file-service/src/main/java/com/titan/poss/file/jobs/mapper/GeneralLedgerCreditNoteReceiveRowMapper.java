/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.GeneralLedgerDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GeneralLedgerCreditNoteReceiveRowMapper implements RowMapper<GeneralLedgerDto> {

	@Override
	public GeneralLedgerDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		GeneralLedgerDto generalLedger = new GeneralLedgerDto();
		generalLedger.setStatus("NEW");
		generalLedger.setSetOfBooks("1");
		generalLedger.setCurrency("INR");
		generalLedger.setJeSource("POSS");
		String debitAmount = rs.getString("debit_amount");
		generalLedger.setEnteredDr(debitAmount);
		generalLedger.setEnteredCr(rs.getString("credit_amount"));
		generalLedger.setAcDDr(debitAmount);
		generalLedger.setAcDCr(rs.getString("credit_amount"));
		generalLedger.setSeg1(rs.getString("seg_no"));
		generalLedger.setSeg2(rs.getString("cost_center"));
		generalLedger.setSeg3(rs.getString("gl_code"));
		generalLedger.setSeg4("JEWL");
		generalLedger.setSeg5("TQ");
		generalLedger.setSeg6("00");
		Date businessDate = rs.getDate("business_date");
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(businessDate);
		int year = rs.getInt("fiscal_year");
		generalLedger.setPeriodName(
				CalendarUtils.formatDateToString(businessDate, "MMM") + year % 100 + "-" + (year % 100 + 1));
		generalLedger.setAcGDate(
				CalendarUtils.formatDateToString(businessDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT2));
		generalLedger.setJeCategory("POSS");
		generalLedger.setCreateDate(
				CalendarUtils.formatDateToString(businessDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT2));
		generalLedger.setCreatedBy("1058");
		generalLedger.setActualFlag("A");
		generalLedger.setGroupId("4263");
		String srcLocationCode = rs.getString("src_location_code");
		String destLocationCode = rs.getString("dest_location_code");
		String attribute5  = "CN" + srcLocationCode + rs.getString("doc_no");
		generalLedger.setAttribute5(attribute5);
		String attribute6 = attribute5;
		generalLedger.setAttribute6(attribute6);
		generalLedger.setAttribute4("");
		generalLedger.setAttribute3(srcLocationCode);
		generalLedger.setAttribute2(rs.getString("type_of_transaction") + " " + destLocationCode + " - Inter boutique");
		generalLedger.setAttribute1(
				CalendarUtils.formatDateToString(businessDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT2));

		return generalLedger;
	}

}
