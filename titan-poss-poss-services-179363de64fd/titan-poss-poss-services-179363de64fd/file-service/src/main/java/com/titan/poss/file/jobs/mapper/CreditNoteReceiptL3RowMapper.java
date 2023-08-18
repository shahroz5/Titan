package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

@Component
public class CreditNoteReceiptL3RowMapper implements RowMapper<DebitNoteDto>{
	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setReference(rs.getString("dest_location_code") + "CN" 
				+ rs.getString("dest_cn_doc_no") 
				+ rs.getString("dest_fiscal_year") );
		debitNoteDto.setReference1(rs.getString("dest_location_code") + "CN" 
				+ rs.getString("dest_cn_doc_no") 
				+ rs.getString("dest_fiscal_year") +"/");
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("TERS");
		/*TransactionType Value will be NINTBTQCNREC 
		 N + INT + BTQ + CN + REC 
		 N-Region-North 
		 INT - Inter 
		 Btq-Boutique CN-Credit Note REC - Receipt */
		debitNoteDto.setTransactionType(rs.getString(FileIntegrationConstants.REGION_CODE).substring(0, 1)
				+"INTBTQCNREC");
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName("");
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setMemoLine("L1L2Credit Note Receipt");
		debitNoteDto.setQty(1);		
		debitNoteDto.setAmount1(rs.getBigDecimal("amount").negate());
		debitNoteDto.setAmount2(rs.getBigDecimal("amount").negate());
		/*
		 * MOHCN242020(MOH + CN + 24 + 2020)
		 * Loc of the transferring btq + CN + CN Doc number at the receiving btq + FY.
		 */
		debitNoteDto.setPurchaseOrder(rs.getString("src_location_code") +
				"CN"+ rs.getString("src_cn_doc_no") +
				rs.getString("src_fiscal_year"));
		debitNoteDto.setBtqCode(rs.getString("dest_location_code"));
		debitNoteDto.setLine("Line");
		debitNoteDto.setPaymentTerm("");		
		debitNoteDto.setOrg("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setLocation1("C" + rs.getString(FileIntegrationConstants.CFA_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString("dest_location_code"));
		debitNoteDto.setDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		return debitNoteDto;
	}
}
