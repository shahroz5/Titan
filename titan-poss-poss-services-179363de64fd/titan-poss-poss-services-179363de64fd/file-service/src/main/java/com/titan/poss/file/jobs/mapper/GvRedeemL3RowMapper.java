package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

@Component
public class GvRedeemL3RowMapper implements RowMapper<DebitNoteDto>{


	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));  
	    String docDate = String.join("",
				Lists.reverse(Arrays
						.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
						.collect(Collectors.toList())));
		debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE)
				+ docDate);
		debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + docDate +"/");
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("TERS");
		debitNoteDto.setTransactionType("GVREDEEM");
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName("");
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setMemoLine("GV REDEEM");
		debitNoteDto.setQty(1);		
		//need to put -ne value
		debitNoteDto.setAmount1(rs.getBigDecimal(FileIntegrationConstants.TOTAL_VALUE).negate());
		debitNoteDto.setAmount2(rs.getBigDecimal(FileIntegrationConstants.TOTAL_VALUE).negate());
		debitNoteDto.setPurchaseOrder(docDate);
		debitNoteDto.setBtqCode(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLine("Line");
		debitNoteDto.setPaymentTerm("");		
		debitNoteDto.setOrg("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setLocation1("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		SimpleDateFormat formate = new SimpleDateFormat("dd-MM-yyyy");  
	    String date = formate.format(rs.getString(FileIntegrationConstants.DOC_DATE));  
		debitNoteDto.setDate(date);
		return debitNoteDto;
	}
}
