package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.GeneralLedgerDto;

public class GeneralLedgerQcgcGiftCardRowMapper implements RowMapper<GeneralLedgerDto> {

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
		String paymentCode = toDisplayCase(rs.getString("payment_code")); 
		if( paymentCode.equalsIgnoreCase("CC") 
				|| paymentCode.equalsIgnoreCase("CN") 
				|| paymentCode.equalsIgnoreCase("DD") 
				|| paymentCode.equalsIgnoreCase("RTGS")
				|| paymentCode.equalsIgnoreCase("UPI") 
				|| paymentCode.equalsIgnoreCase("RO") 
				|| paymentCode.equalsIgnoreCase("QCGC") 
				|| paymentCode.equalsIgnoreCase("CASHBACKOFFER") 
				|| paymentCode.equalsIgnoreCase("GV") 
				|| paymentCode.equalsIgnoreCase("HDFC")
				|| paymentCode.equalsIgnoreCase("QCEGHS"))
		{
			paymentCode =   paymentCode.toUpperCase();
		}
		else if(paymentCode.equalsIgnoreCase("UNIPAY"))
		{
			paymentCode = "CC";
		}
		else if(paymentCode.toUpperCase().contains("DIGIGOLD"))
		{
			paymentCode = "DIGIGOLDREDEEM";
		}
		
		String attribute5 = StringUtils.isEmpty(debitAmount) ? rs.getString("gift_card_no") 
				:rs.getString("location_code") + CalendarUtils.formatDateToString(businessDate,
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT2) + "_" + paymentCode ;
		generalLedger.setAttribute5(attribute5);
		String at5 = generalLedger.getAttribute5();
		if(at5.contains("CARD"))
		{
			attribute5 = at5.replace("CARD", "CC");
		}
		if(at5.contains("CREDIT NOTE"))
		{
			attribute5 = at5.replace("CREDIT NOTE", "CN");
		}
		
		generalLedger.setAttribute5(attribute5);
		String attribute6 = StringUtils.isEmpty(debitAmount) ? "CM" + rs.getString("cm_doc_no") 
				: "";
		generalLedger.setAttribute6(attribute6);
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
