package com.titan.poss.file.jobs.mapper;

import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.math.BigDecimal;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GeneralLedgerDto;


@Component
public class GeneralLedgerDebitRowMapper implements RowMapper<GeneralLedgerDto> {

	@Override
	public GeneralLedgerDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		GeneralLedgerDto generalLedger = new GeneralLedgerDto();
		generalLedger.setStatus("NEW");
		generalLedger.setSetOfBooks("1");
		generalLedger.setCurrency("INR");
		generalLedger.setJeSource("POSS");
		if(rs.getString("type_of_transaction").contains("Credit Note Received-L3"))
		{
			BigDecimal creditAmount = new BigDecimal(rs.getString("credit_amount"));
			generalLedger.setEnteredDr(rs.getString("debit_amount"));
			generalLedger.setEnteredCr(creditAmount.setScale(3, RoundingMode.HALF_UP).toString());
			generalLedger.setAcDDr(rs.getString("debit_amount"));
			generalLedger.setAcDCr(creditAmount.setScale(3, RoundingMode.HALF_UP).toString());
		
		}
		else
		{
			BigDecimal debitAmount = new BigDecimal(rs.getString("debit_amount"));
			generalLedger.setEnteredDr(debitAmount.setScale(3, RoundingMode.HALF_UP).toString());
			generalLedger.setEnteredCr(rs.getString("credit_amount"));
			generalLedger.setAcDDr(debitAmount.setScale(3, RoundingMode.HALF_UP).toString());
			generalLedger.setAcDCr(rs.getString("credit_amount"));
		}
		
		generalLedger.setSeg1(rs.getString("seg_no"));
		generalLedger.setSeg2(rs.getString("cost_center"));
		generalLedger.setSeg3(rs.getString("gl_code"));  
		generalLedger.setSeg4("JEWL");
		generalLedger.setSeg5("TQ");
		generalLedger.setSeg6("00");
		generalLedger.setPeriodName(rs.getString("period_name"));
		generalLedger.setAcGDate(rs.getString("ac_g_date"));
		generalLedger.setJeCategory("POSS");
		generalLedger.setCreateDate(rs.getString("create_date"));
		generalLedger.setCreatedBy("1058");
		generalLedger.setActualFlag("A");
		generalLedger.setGroupId("4263");
		String attribute5 = rs.getString("location_code"); 
		if(rs.getString("type_of_transaction").equalsIgnoreCase("Credit Note Cancelled_RO"))
		{
			generalLedger.setAttribute5(attribute5);
		}
		else
		{
			generalLedger.setAttribute5(attribute5);	
		}
		
		generalLedger.setAttribute6("");
		generalLedger.setAttribute4("");
		generalLedger.setAttribute3(rs.getString("location_code"));
		generalLedger.setAttribute2(rs.getString("type_of_transaction")); 
		generalLedger.setAttribute1(rs.getString("attribute1"));

		return generalLedger;
	}
	
}
