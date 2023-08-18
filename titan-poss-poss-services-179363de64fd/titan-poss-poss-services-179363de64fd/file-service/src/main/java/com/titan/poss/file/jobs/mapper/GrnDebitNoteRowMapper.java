package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

@Component
public class GrnDebitNoteRowMapper implements RowMapper<DebitNoteDto> {

	private static final String AMOUNT = "amount";
	
	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		//payment code = Encircle then 
//		debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
//		+ "CN" + rs.getString("doc_no"));
		//else
		if(rs.getString("debit_type").equalsIgnoreCase("ENCIRCLE"))
		{
			debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
			+ "CM" + rs.getString("doc_no"));
			debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
			+ "CM" + rs.getString("doc_no") + "/");
			debitNoteDto.setTransactionType(
					rs.getString(FileIntegrationConstants.LOCATION_CODE) + "Encircle");
			debitNoteDto.setAmount1(rs.getBigDecimal("amount"));
			debitNoteDto.setAmount2(rs.getBigDecimal("amount"));
		}
		else
		{
			debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
			+ "CN" + rs.getString("doc_no"));
			debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
			+ "CN" + rs.getString("doc_no") + "/");
			debitNoteDto.setTransactionType(
					rs.getString(FileIntegrationConstants.LOCATION_CODE) + "CN");
			debitNoteDto.setAmount1(rs.getBigDecimal(AMOUNT));
			debitNoteDto.setAmount2(rs.getBigDecimal(AMOUNT));
		}
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("EPOSS");
		
		if(rs.getString("debit_type").equalsIgnoreCase("ENCIRCLE") && rs.getString("txn_type").equalsIgnoreCase("CMCAN"))
		{
			debitNoteDto.setCustomerNo("");
			debitNoteDto.setMemoLine("CM Cancellation");
			debitNoteDto.setPurchaseOrder(rs.getString(FileIntegrationConstants.LOCATION_CODE) + String.join("",
					Lists.reverse(Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
							.collect(Collectors.toList()))));
			
		}
		else if (rs.getString("debit_type").equalsIgnoreCase("ENCIRCLE") && rs.getString("txn_type").equalsIgnoreCase("GRN"))
		{
			debitNoteDto.setCustomerNo(rs.getString("sap_code"));
			debitNoteDto.setMemoLine("GRN");
			debitNoteDto.setPurchaseOrder( "GRN" + String.join("",
					Lists.reverse(Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
							.collect(Collectors.toList()))));
		}
		else
		{
			debitNoteDto.setCustomerNo(rs.getString("sap_code")); // null for only cmcan
			debitNoteDto.setMemoLine("GRN"); // cmcan CM cancellation in encircle
			debitNoteDto.setPurchaseOrder("GRN" + String.join("",// for cmcan instead of grn keep locationcode
					Lists.reverse(Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
							.collect(Collectors.toList()))));
			
		}
		
		debitNoteDto.setCustomerName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		
		debitNoteDto.setQty(1);
		
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
