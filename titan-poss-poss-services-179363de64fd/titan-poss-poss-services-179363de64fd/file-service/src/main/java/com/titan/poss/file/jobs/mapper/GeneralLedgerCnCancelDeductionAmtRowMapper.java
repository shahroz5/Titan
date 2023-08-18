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
public class GeneralLedgerCnCancelDeductionAmtRowMapper implements RowMapper<GeneralLedgerDto> {

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
		if(!(rs.getString("credit_note_type").equalsIgnoreCase("TEP") || rs.getString("credit_note_type").equalsIgnoreCase("GEP")))
		{
		generalLedger.setSeg3(rs.getString("gl_code")); 
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
		String attribute5 = rs.getString("location_code"); 
		generalLedger.setAttribute5(attribute5);
		generalLedger.setAttribute6("");
		generalLedger.setAttribute4("");
		generalLedger.setAttribute3(rs.getString("location_code"));
		
		
			
			switch((rs.getString("credit_note_type")).toUpperCase()){    
			case "ADV":  				generalLedger.setAttribute2("ADV CNCAN Deduction AMT"); 
										break;
			case "BILL_CANCELLATION":   generalLedger.setAttribute2("BC CNCAN Deduction AMT"); 
										break; 
			case "GEP":   				generalLedger.setAttribute2("GEP CNCAN Deduction AMT");
										generalLedger.setSeg3("400521");
										break;
			case "GHS":   				generalLedger.setAttribute2("GHS CNCAN Deduction AMT"); 
										break;	
			case "GRN":   				generalLedger.setAttribute2("GRN CNCAN Deduction AMT"); 
										break;	
			case "TEP":   				generalLedger.setAttribute2("TEP CNCAN Deduction AMT"); 
										generalLedger.setSeg3("400529");
										break;	
			default:     
										generalLedger.setAttribute2("CN IBT CNCAN Deduction AMT"); 
				
			}    
		
		generalLedger.setAttribute1(
				CalendarUtils.formatDateToString(businessDate, FileIntegrationConstants.DD_MMM_YY_DATE_FORMAT2));

		return generalLedger;
	}
}
