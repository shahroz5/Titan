package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

public class TcsDebitNoteRowMapper  implements RowMapper<DebitNoteDto> {
	
private static final String AMOUNT = "tcs_amount_paid";
	
	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
			+ "CM" + rs.getString("doc_no"));
			debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
			+ "CM" + rs.getString("doc_no") + "/");
			debitNoteDto.setTransactionType("TCSCOLLECTED");
			debitNoteDto.setAmount1(rs.getBigDecimal(AMOUNT));
			debitNoteDto.setAmount2(rs.getBigDecimal(AMOUNT));
		
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("EPOSS");
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setMemoLine("TCS Collected");
		debitNoteDto.setQty(1);
		debitNoteDto.setPurchaseOrder("CM" + rs.getString("doc_no"));
		debitNoteDto.setBtqCode(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLine("Line");
		if (rs.getBigDecimal(AMOUNT).compareTo(BigDecimal.ZERO) > 0)
	    debitNoteDto.setPaymentTerm("D001");
		else
		debitNoteDto.setPaymentTerm("");

		debitNoteDto.setOrg("B" + rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLocation1("B" + rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		return debitNoteDto;
	}

}
