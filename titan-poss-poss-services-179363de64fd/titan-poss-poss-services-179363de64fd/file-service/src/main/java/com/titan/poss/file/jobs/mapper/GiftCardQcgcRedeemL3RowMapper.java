package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

@Component
public class GiftCardQcgcRedeemL3RowMapper implements RowMapper<DebitNoteDto>{
	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + "CM" 
				+ rs.getString(FileIntegrationConstants.DOC_NO));
		debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
				+ rs.getString(FileIntegrationConstants.DOC_NO)+"/");
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("TERS");
		debitNoteDto.setTransactionType("QCCARDREDEEM");
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName("");
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setMemoLine("GIFT CARD REDEEM");
		debitNoteDto.setQty(1);		
		//need to put -ne value
		debitNoteDto.setAmount1(rs.getBigDecimal(FileIntegrationConstants.TOTAL_VALUE).negate());
		debitNoteDto.setAmount2(rs.getBigDecimal(FileIntegrationConstants.TOTAL_VALUE).negate());
		debitNoteDto.setPurchaseOrder(rs.getString("instrument_no"));
		debitNoteDto.setBtqCode(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLine("Line");
		debitNoteDto.setPaymentTerm("");		
		debitNoteDto.setOrg("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setLocation1("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		return debitNoteDto;
	}
}

