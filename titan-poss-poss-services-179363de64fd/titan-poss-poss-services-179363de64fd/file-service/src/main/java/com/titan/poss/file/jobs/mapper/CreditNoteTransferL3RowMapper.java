package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

@Component
public class CreditNoteTransferL3RowMapper implements RowMapper<DebitNoteDto>{
	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setReference(rs.getString("src_location_code") + "CN" 
				+ rs.getString(FileIntegrationConstants.DOC_NO) 
				+ rs.getString(FileIntegrationConstants.FISCAL_YEAR) );
		debitNoteDto.setReference1(rs.getString("src_location_code") + "CN" 
				+ rs.getString(FileIntegrationConstants.DOC_NO) 
				+ rs.getString(FileIntegrationConstants.FISCAL_YEAR) +"/");
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("TERS");
		/*TransactionType Value will be WINTBTQCNTRANSFER
		  W + INT + BTQ + CN + TRANSFER -West Region (get the first letter from region code.)
		  INT - Inter  BTQ-Boutique CN-Credit Note TRANSFER-TRANSFER */
		debitNoteDto.setTransactionType(rs.getString(FileIntegrationConstants.REGION_CODE).substring(0, 1)
				+"INTBTQCNTRANSFER");
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName("");
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setMemoLine("L1L2Credit Note Transfer");
		debitNoteDto.setQty(1);		
		debitNoteDto.setAmount1(rs.getBigDecimal("amount"));
		debitNoteDto.setAmount2(rs.getBigDecimal("amount"));
		/*
		 * KORCN152020_TRA 
		 * Loc Code + CN + CN Doc No + Fiscal Year + '_' + Loc code of the receiving boutique (Btq to which the CN has been transferred to.)
		 */
		debitNoteDto.setPurchaseOrder(rs.getString("src_location_code") +
				"CN"+rs.getString(FileIntegrationConstants.DOC_NO) +
				rs.getString(FileIntegrationConstants.FISCAL_YEAR) + "_" +
				rs.getString("dest_location_code"));
		debitNoteDto.setBtqCode(rs.getString("src_location_code"));
		debitNoteDto.setLine("Line");
		debitNoteDto.setPaymentTerm("D001");		
		debitNoteDto.setOrg("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setLocation1("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString("src_location_code"));
		debitNoteDto.setDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		return debitNoteDto;
	}
}

