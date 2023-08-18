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

@Component
public class GeneralLedgerCreditNoteCancelledRowMapper implements RowMapper<GeneralLedgerDto> {

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
		if(rs.getString("gl_code") != null || !(rs.getString("type_of_transaction").equalsIgnoreCase("Credit Note Cancelled - Inter boutique")) )
		{
		generalLedger.setSeg3(rs.getString("gl_code"));
		}
		else
		{
			String regionCode =  rs.getString("region_code");
			regionCode = regionCode.toUpperCase();
			switch(regionCode)
			{
			case "NORTH" : generalLedger.setSeg3("242010");
						   break;
			case "SOUTH" : generalLedger.setSeg3("242013");
						   break;
			case "EAST"  : generalLedger.setSeg3("242011");
						   break;
			case "WEST"  : generalLedger.setSeg3("242012");
						   break;
			}
		}
		generalLedger.setSeg4("JEWL");
		generalLedger.setSeg5("TQ");
		generalLedger.setSeg6("00");
		Date businessDate = rs.getDate("business_date");
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(businessDate);
		int year = rs.getInt("debit_note_fiscal_year");
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
		String attribute5;
		String paymentCode = toDisplayCase(rs.getString("payment_code"));
		if(paymentCode.equalsIgnoreCase("CARD"))
		{
			paymentCode = "CC";
		}
		else if(paymentCode.equalsIgnoreCase("DD"))
		{
			paymentCode = "DD";
		}
		if(rs.getString("type_of_transaction").equalsIgnoreCase("Credit Note Cancelled_RO") && rs.getString("is_debit").equalsIgnoreCase("N"))
		{
			attribute5 = rs.getString("location_code") + "/" + rs.getString("doc_no") + "/" + year % 100 + "-" + (year % 100 + 1) ;
		}
		else if(rs.getString("type_of_transaction").equalsIgnoreCase("Residual Value Refund") && rs.getString("is_debit").equalsIgnoreCase("N"))
		{
			attribute5 = rs.getString("location_code") + CalendarUtils.formatDateToString(rs.getDate("business_date"),
					FileIntegrationConstants.DD_MM_YY_DATE_FORMAT2) + "_"+ paymentCode;
		}
		else
		{
		 attribute5 = rs.getString("location_code"); 
		}
		generalLedger.setAttribute5(attribute5);
		generalLedger.setAttribute6("");
		generalLedger.setAttribute4("");
		generalLedger.setAttribute3(rs.getString("location_code"));
		generalLedger.setAttribute2(rs.getString("type_of_transaction")); 
		generalLedger.setAttribute1(
				CalendarUtils.formatDateToString(businessDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT2));//DD_MM_YY_DATE_FORMAT

		return generalLedger;
	}
	
	public static String toDisplayCase(String s) {

	    final String ACTIONABLE_DELIMITERS = " '-/"; // these cause the character following
	                                                 // to be capitalized
	    
	    StringBuilder sb = new StringBuilder();
	    boolean capNext = true;

	    for (char c : s.toCharArray()) {
	        c = (capNext)
	                ? Character.toUpperCase(c)
	                : Character.toLowerCase(c);
	        sb.append(c);
	        capNext = (ACTIONABLE_DELIMITERS.indexOf((int) c) >= 0); // explicit cast not needed
	    }
	    return sb.toString();
	}
	
}
